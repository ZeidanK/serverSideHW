
using ServerSide_HW.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens; // namespace for SymmetricSecurityKey
using System.IdentityModel.Tokens.Jwt; //  namespace for JwtSecurityToken and JwtSecurityTokenHandler
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization; //  namespace for Claim


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ServerSide_HW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            DBservices dBservices = new DBservices();
            var results = dBservices.GetAllUsers();
            return results.Item1;
        }

        //// GET api/<UsersController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/<UsersController>
        [HttpPost]
        public bool Post([FromBody] User user)
        {
            if (user == null)
            {
                return false;// BadRequest();
            }
            else
            {
                DBservices dBservices = new DBservices();
                int res = dBservices.Insert(user);
                return res > 0;
            }
        }

        [HttpPost("Register")]
        public bool Register([FromBody] Models.User user)
        {

            if (user == null)
            {
                return false;// BadRequest();

            }

            else
            {
                user.Id = Models.User.NewID();
                try
                {
                    Models.User.ValidateUser(user);
                }
                catch
                {
                    return false;
                }
                user.Password = Models.User.HashPassword(user.Password);
                DBservices dBservices = new DBservices();
                int res = dBservices.Insert(user);
                return res > 0;
                //return user.Insert();
            }

        }

        [HttpPost("Login")]
        public bool Login([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return false;
            }
            DBservices dBservices = new DBservices();
            // Find the user in the UsersList by email  
            var existingUser = dBservices.GetUser(user.Email);

            if (existingUser == null)
            {
                return false; // User not found  
            }

            // Hash the provided password and compare with the stored password  
            var hashedPassword = Models.User.HashPassword(user.Password);
            if (existingUser.Password == hashedPassword)
            {
                return true; // Login successful  
            }

            return false; // Password mismatch  
        }
        [HttpPost("LoginJWT")]
        public IActionResult LoginJWT([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password)|| user.Active!= true)
            {
                return BadRequest("Invalid user data.");
            }

            // Find the user in the UsersList by email  
            //var existingUser = Models.User.Read().FirstOrDefault(u => u.Email == user.Email);
            DBservices dBservices = new DBservices();
            // Find the user in the UsersList by email  
            var existingUser = dBservices.GetUser(user.Email);

            

            // Hash the provided password and compare with the stored password  
            //var hashedPassword = Models.User.HashPassword(user.Password);
            if (existingUser == null)
            {
                return Unauthorized("User not found.");
            }
            if(existingUser.Active == false)
            {
                return Unauthorized("User is not active.");
            }

            // Hash the provided password and compare with the stored password  
            var hashedPassword = Models.User.HashPassword(user.Password);
            if (existingUser.Password != hashedPassword)
            {
                return Unauthorized("Invalid password.");
            }

            // Generate JWT token
            var Token = GenerateJwtToken(existingUser);

            return Ok(new Dictionary<string, string> { { "Token", Token } });
        }

        private readonly IConfiguration _config;

        public UsersController(IConfiguration config)
        {
            _config = config;
        }

        private string GenerateJwtToken(User user)
        {
            var key = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email), // Standard subject claim
        new Claim("id", user.Id.ToString()), // Standard name identifier
        new Claim("name", user.Name),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPut("UpdateUserStatus")]
        public int UpdateUserStatus(User user)
        {
            DBservices dBservices = new DBservices();
            if (user.Active)
            {
                user.Active = false;
            }
            else user.Active = true;
                int result = dBservices.UpdateUser(user);
            return result;
        }
        //[HttpPut("UpdateProfile")]
        //[Authorize]
        [HttpPut("UpdateProfile")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] User[] request)
        {
            if (request == null || request[0] == null || string.IsNullOrEmpty(request[1].Password))
            {
                return BadRequest("Invalid user data.");
            }

            // Extract user ID from JWT token
            var userID = GetUserIdFromToken();
            if (userID == null)
            {
                return Unauthorized("Invalid token.");
            }

            DBservices dBservices = new DBservices();
            var existingUser = dBservices.GetUser(null, userID, null);

            if (existingUser == null)
            {
                return NotFound("User not found.");
            }

            // Verify the provided password matches the current user's password
            var hashedPassword = Models.User.HashPassword(request[1].Password);
            if (existingUser.Password != hashedPassword)
            {
                return Unauthorized("Incorrect password.");
            }

            // Update user details based on provided values
            if (request[0].Name != "-1")
            {
                existingUser.Name = request[0].Name;
            }
            if (request[0].Email != "-1")
            {
                existingUser.Email = request[0].Email;
            }
            if (request[0].Password != "-1")
            {
                existingUser.Password = Models.User.HashPassword(request[0].Password);
            }

            // Save the updated user to the database
            int result = dBservices.UpdateUser(existingUser);

            if (result > 0)
            {
                // Generate a new JWT token for the updated user
                var newToken = GenerateJwtToken(existingUser);

                return Ok(new
                {
                    message = "Profile updated successfully.",
                    Token = newToken
                });
            }

            return StatusCode(500, "An error occurred while updating the profile.");
        }




        private string GetEmailFromToken()
        {
            return User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        }

        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst("id")?.Value; // Use "id" instead of ClaimTypes.NameIdentifier
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null;
        }

        [HttpGet("test-claims")]
        //[Authorize]
        public IActionResult TestClaims()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            return Ok(new
            {
                Email = GetEmailFromToken(),
                UserId = GetUserIdFromToken(),
                AllClaims = claims,
                Token = token
            });
        }
        [HttpGet("debug-token")]
        [Authorize]
        public IActionResult DebugToken()
        {
            // Check if we even have an authenticated user
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "User is not authenticated" });
            }

            // Get all claims
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();

            // Get authorization header
            var authHeader = Request.Headers["Authorization"].ToString();

            return Ok(new
            {
                HasIdentity = User.Identity.IsAuthenticated,
                IdentityName = User.Identity.Name,
                AuthenticationType = User.Identity.AuthenticationType,
                ClaimsCount = claims.Count,
                Claims = claims,
                AuthHeader = authHeader,
                AuthHeaderLength = authHeader.Length,
                AllHeaders = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString())
            });
        }
        [HttpPost("TransferMovie")]
        [Authorize]
        public IActionResult TransferMovie([FromBody] TransferMovieRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.RecipientEmail) || request.MovieId <= 0 || request.MovieRentStartDate == default)
            {
                return BadRequest(new { message = "Invalid transfer data." });
            }

            // Get current user ID from JWT token
            var oldUserId = GetUserIdFromToken();
            if (oldUserId == null)
            {
                return Unauthorized(new { message = "Invalid token." });
            }

            DBservices db = new DBservices();
            // Get recipient user by email
            var recipientUser = db.GetUser(request.RecipientEmail);
            if (recipientUser == null)
            {
                return NotFound(new { message = "Recipient user not found." });
            }
            if(recipientUser.Active == false)
            {
                return BadRequest(new { message = "Recipient user is not active." });
            }
            List<Movie> rentedMovies = db.GetRentedMovies(recipientUser.Id);
            bool alreadyRented = rentedMovies.Any(m => m.Id == request.MovieId);
            if (alreadyRented)
            {
                return BadRequest(new { message = "Recipient already has this movie rented." });
            }

            try
            {
                int result = db.TransferMovie(oldUserId.Value, recipientUser.Id, request.MovieId, DateTime.Parse(request.MovieRentStartDate));
                if (result > 0)
                {
                    return Ok(new { message = "Rental transferred successfully!" });
                }
                else
                {
                    return StatusCode(500, new { message = "Transfer failed." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



    }

    // DTO for transfer request
    public class TransferMovieRequest
    {
        public int MovieId { get; set; }
        public string RecipientEmail { get; set; }
        public string MovieRentStartDate { get; set; }
    }
}