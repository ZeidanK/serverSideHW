
using ServerSide_HW.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens; // namespace for SymmetricSecurityKey
using System.IdentityModel.Tokens.Jwt; //  namespace for JwtSecurityToken and JwtSecurityTokenHandler
using System.Security.Claims; //  namespace for Claim


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
                return user.Insert();
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

                return user.Insert();
            }

        }

        [HttpPost("Login")]
        public bool Login([FromBody] User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return false;
            }

            // Find the user in the UsersList by email  
            var existingUser = Models.User.Read().FirstOrDefault(u => u.Email == user.Email);

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
            var existingUser = Models.User.Read().FirstOrDefault(u => u.Email == user.Email);

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
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim("id", user.Id.ToString()),
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


        //// PUT api/<UsersController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<UsersController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}