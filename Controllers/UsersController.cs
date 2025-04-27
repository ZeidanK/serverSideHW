
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

            List<User> users = Models.User.Read();
            return users;
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
                int res =dBservices.Insert(user);
                return res>0;
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
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
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
        [HttpPut("UpdateProfile")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] User updatedUser)
        {
            if (updatedUser == null)
            {
                return BadRequest("Invalid user data.");
            }

            // Extract email from JWT token
            string emailFromToken = GetEmailFromToken();
           var userID = GetUserIdFromToken();
            //if (string.IsNullOrEmpty(emailFromToken))
            //{
            //    return Unauthorized("Invalid token.");
            //}

            DBservices dBservices = new DBservices();
            var existingUser = dBservices.GetUser(null,userID,null);

            if (existingUser == null)
            {
                return NotFound("User not found.");
            }

            //var Token = GenerateJwtToken(existingUser);

            // Update user details
            existingUser.Name = updatedUser.Name ?? existingUser.Name;
            if (!string.IsNullOrEmpty(updatedUser.Password))
            {
                existingUser.Password = Models.User.HashPassword(updatedUser.Password);
            }
            var Token = GenerateJwtToken(existingUser);
            int result = dBservices.UpdateUser(existingUser);

            if (result > 0)
            {
                return Ok(new { message = "Profile updated successfully." });
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

    }
}