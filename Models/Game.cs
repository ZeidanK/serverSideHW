using serverSideHW.Utilities;

namespace serverSideHW.Models
{
    public class Game
    {

        // Fields
        int appID;
        string name;
        DateOnly releaseDate;
        double price;
        string description;
        string headerImage;
        string website;
        Boolean windows;
        Boolean mac;
        Boolean linux;
        int scoreRank;
        string recommendations;
        string publisher;
        static List<Game> GamesList = new List<Game>();



        // Properties
        public int AppID
        {
            get => appID;
            set => appID = ValidationHelper.ValidatePositive<int>(value, nameof(AppID));
            //!int.IsPositive(value) ? 
            //throw new ArgumentException($"{nameof(AppID)} cannot be negative."): value;
        }
        public string Name
        {
            get => name;
            set => name = ValidationHelper.ValidateString(value, nameof(Name));
            //string.IsNullOrEmpty(value) ?
            //throw new ArgumentException($"{nameof(Name)} cannot be null or empty.") : value;
        }
        public DateOnly ReleaseDate
        {
            get => releaseDate;
            set => releaseDate = ValidationHelper.ValidateDate(value, nameof(ReleaseDate));
            //value == default ? // DateOnly has a default value of 0001-01-01
            //throw new ArgumentException($"{nameof(ReleaseDate)} cannot be default.") : value;
        }
        public double Price
        {
            get => price;
            set => price = ValidationHelper.ValidatePositive<double>(value, nameof(Price));
            //!double.IsPositive(value) ?
            //throw new ArgumentException($"{nameof(Price)} cannot be negative.") : value;
        }
        public string Description
        {
            get => description;
            set => description = ValidationHelper.ValidateString(value, nameof(Description));
            //string.IsNullOrEmpty(value) ?
            //throw new ArgumentException($"{nameof(Description)} cannot be null or empty.") : value;
        }
        public string HeaderImage // will need more validation later when when have a way to check if it's a valid URL
        {
            get => headerImage;
            set => headerImage = ValidationHelper.ValidateString(value, nameof(HeaderImage));
            //string.IsNullOrEmpty(value) ?
            //throw new ArgumentException($"{nameof(HeaderImage)} cannot be null or empty.") : value;
        }
        public string Website // will need more validation later
        {
            get => website;
            set => website = ValidationHelper.ValidateString(value, nameof(Website));
            //string.IsNullOrEmpty(value) ?
            //throw new ArgumentException($"{nameof(Website)} cannot be null or empty.") : value;
        }
        public Boolean Windows
        {
            get => windows;
            set => windows = value;
        }
        public Boolean Mac
        {
            get => mac;
            set => mac = value;
        }
        public Boolean Linux
        {
            get => linux;
            set => linux = value;
        }
        public int ScoreRank
        {
            get => scoreRank;
            set => scoreRank = ValidationHelper.ValidatePositive<int>(value, nameof(ScoreRank));
            //!int.IsPositive(value) ?
            //throw new ArgumentException($"{nameof(ScoreRank)} cannot be negative.") : value;
        }
        public string Recommendations
        {
            get => recommendations;
            set => recommendations = ValidationHelper.ValidateString(value, nameof(Recommendations));
            //string.IsNullOrEmpty(value) ?
            //throw new ArgumentException($"{nameof(Recommendations)} cannot be null or empty.") : value;
        }
        public string Publisher
        {
            get => publisher;
            set => publisher = ValidationHelper.ValidateString(value, nameof(Publisher));
            //string.IsNullOrEmpty(value) ?
            //throw new ArgumentException($"{nameof(Publisher)} cannot be null or empty.") : value;
        }


        // Constructors
        public Game(int appID, string name, DateOnly releaseDate, double price, string description, string headerImage, string website, Boolean windows, Boolean mac, Boolean linux, int scoreRank, string recommendations, string publisher)
        {
            AppID = appID;
            Name = name;
            ReleaseDate = releaseDate;
            Price = price;
            Description = description;
            HeaderImage = headerImage;
            Website = website;
            Windows = windows;
            Mac = mac;
            Linux = linux;
            ScoreRank = scoreRank;
            Recommendations = recommendations;
            Publisher = publisher;
        }
        public Game()
        {
            AppID = 0;
            Name = "";
            ReleaseDate = new DateOnly();
            Price = 0;
            Description = "";
            HeaderImage = "";
            Website = "";
            Windows = false;
            Mac = false;
            Linux = false;
            ScoreRank = 0;
            Recommendations = "";
            Publisher = "";
        }


        // Methods
        //Use camelCase for method names, parameters, and local variables 
        //(e.g., methodName, variableName). so if its one word, it should be lowercase? 
        public bool insert()
        {
            if (GamesList.Any(game => game.AppID == this.AppID || game.Name == this.Name))
            {
                return false;
            }
            GamesList.Add(this);
            return true;
        }
        static public List<Game> read()
        {
            return GamesList;
        }
    }
}
