using System.Security.Cryptography;
using System.Text;

namespace ServerSide_HW.Models
{
    public class User
    {
        int id;
        string name;
        string email;
        string password;
        bool active;

        static List<User> UsersList = new List<User>();
        public User(User user)
        {
            
                this.Id = user.Id;
                this.Name = user.Name;
                this.Email = user.Email;
                this.Password = user.Password;
                this.Active = user.Active;
           
        }
        public User(int id, string name, string email, string password, bool active)
        {
            this.Id = id;
            this.Name = name;
            this.Email = email;
            this.Password = password;
            this.Active = active;
        }
        public User()
        {
        }

       
        
        public int Id
        {
            get => id;
            set => id = value;
        }
        public string Name
        {
            get => name;
            set => name = value;
        }
        public string Email
        {
            get => email;
            set => email = value;
        }
        public string Password
        {
            get => password;
            set => password = value;
        }
        public bool Active
        {
            get => active;
            set => active = value;
        }

        public static bool ValidateUser(User user)
        {
            if (user == null)
            {
                return false;
            }

            try
            {
                user.Id = ValidationHelper.ValidatePositive<int>(user.Id, nameof(user.Id));
                user.Name = ValidationHelper.ValidateString(user.Name, nameof(user.Name));
                user.Email = ValidationHelper.ValidateString(user.Email, nameof(user.Email));
                user.Password = ValidationHelper.ValidateString(user.Password, nameof(user.Password));
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public bool Register(User user)
        {
            try
            {
                ValidateUser(user);
            }
            catch
            {
                throw new Exception("Validation failed");
            }
            if (UsersList.Any(u => u.Id == user.Id)||UsersList.Any(u=>u.Email==user.Email))
            {
                throw new Exception("User already exists");
            }
            return true;
        }

        public bool Insert()
        {
            if (UsersList.Any(u => u.Id == Id))
            {
                return false;
            }
            UsersList.Add(this);
            return true;
        }
        static public List<User> Read()
        {
            return UsersList;
        }
        static public string HashPassword(string password)
        {
            using (var sha512 = SHA512.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha512.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }
        static public int NewID()
        {
            return UsersList.Count + 1;
        }
    }
}
