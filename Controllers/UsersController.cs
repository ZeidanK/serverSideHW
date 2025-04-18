
using ServerSide_HW.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
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
            if(user == null)
            {
                return false;// BadRequest();
            }
            else
            {
               return user.Insert();
            }
        }

        [HttpPost("Register")]
        public bool Register([FromBody] User user)
        {
            if (user == null)
            {
                return false;// BadRequest();
                
            }
            else
            {
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
