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
            set => id = ValidationHelper.ValidatePositive<int>(value, nameof(Id));
        }
        public string Name
        {
            get => name;
            set => name = ValidationHelper.ValidateString(value, nameof(Name));
        }
        public string Email
        {
            get => email;
            set => email = ValidationHelper.ValidateString(value, nameof(Email));
        }
        public string Password
        {
            get => password;
            set => password = ValidationHelper.ValidateString(value, nameof(Password));
        }
        public bool Active
        {
            get => active;
            set => active = value;
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

    }
}
