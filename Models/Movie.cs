namespace ServerSide_HW.Models
{
    public class Movie
    {
        // Private fields for the properties
        int id;
        string url;
        string primaryTitle;
        string description;
        string primaryImage;
        int year;
        DateTime releaseDate;
        string language;
        double budget;
        double grossWorldwide;
        string genres;
        bool isAdult;
        int runtimeMinutes;
        float averageRating;
        int numVotes;

        static List<Movie> MoviesList = new List<Movie>() ;

        // Constructor for the Movie class
        public Movie(int id, string url, string primaryTitle, string description, string primaryImage, int year, DateTime releaseDate, string language, double budget, double grossWorldwide, string genres, bool isAdult, int runtimeMinutes, float averageRating, int numVotes)
        {
            this.id = id;
            this.url = url;
            this.primaryTitle = primaryTitle;
            this.description = description;
            this.primaryImage = primaryImage;
            this.year = year;
            this.releaseDate = releaseDate;
            this.language = language;
            this.budget = budget;
            this.grossWorldwide = grossWorldwide;
            this.genres = genres;
            this.isAdult = isAdult;
            this.runtimeMinutes = runtimeMinutes;
            this.averageRating = averageRating;
            this.numVotes = numVotes;
        }


        public Movie()
        {

        }
        //next part creating properties for all fields
        // extra validation is done in the ValidationHelper class
        // should use camleCase for the properties

        public int Id
        {
            get => id;
            set => id = ValidationHelper.ValidatePositive<int>(value, nameof(Id), allowZero: false);
        }
        public string Url
        {
            get => url;
            set => url = ValidationHelper.ValidateString(value, nameof(Url));
        }
        public string PrimaryTitle
        {
            get => primaryTitle;
            set => primaryTitle = ValidationHelper.ValidateString(value, nameof(PrimaryTitle));
        }
        public string Description
        {
            get => description;
            set => description = ValidationHelper.ValidateString(value, nameof(Description));
        }
        public string PrimaryImage
        {
            get => primaryImage;
            set => primaryImage = ValidationHelper.ValidateString(value, nameof(PrimaryImage));
        }
        public int Year
        {
            get => year;
            set => year = ValidationHelper.ValidatePositive<int>(value, nameof(Year), allowZero: true);
        }
        public DateTime ReleaseDate
        {
            get => releaseDate;
            set => releaseDate = ValidationHelper.ValidateDate(value, nameof(ReleaseDate));
        }
        public string Language
        {
            get => language;
            set => language = ValidationHelper.ValidateString(value, nameof(Language));
        }
        public double Budget
        {
            get => budget;
            set => budget = ValidationHelper.ValidatePositive<double>(value, nameof(Budget), allowZero: true);
        }
        public double GrossWorldwide
        {
            get => grossWorldwide;
            set => grossWorldwide = ValidationHelper.ValidatePositive<double>(value, nameof(GrossWorldwide), allowZero: true);
        }
        public string Genres
        {
            get => genres;
            set => genres = ValidationHelper.ValidateString(value, nameof(Genres));
        }
        public bool IsAdult
        {
            get => isAdult;
            set => isAdult = value;
        }
        public int RuntimeMinutes
        {
            get => runtimeMinutes;
            set => runtimeMinutes = ValidationHelper.ValidatePositive<int>(value, nameof(RuntimeMinutes), allowZero: true);
        }
        public float AverageRating
        {
            get => averageRating;
            set => averageRating = ValidationHelper.ValidatePositive<float>(value, nameof(AverageRating), allowZero: true);
        }
        public int NumVotes
        {
            get => numVotes;
            set => numVotes = ValidationHelper.ValidatePositive<int>(value, nameof(NumVotes), allowZero: true);
        }

        public bool checkValidId(int id)
        {
            if (id < 1)
            {
                return false;
            }
            foreach (Movie movie in MoviesList)
            {
                if (movie.id == id)
                {
                    return false;
                }
            }
            return true;
        }

        public bool checkValidTitle(string title)
        {
            if (title == null)
            {
                return false;
            }
            foreach (Movie movie in MoviesList)
            {
                if (movie.primaryTitle == title)
                {
                    return false;
                }
            }
            return true;
        }

        public bool insert()
        {
            if (!checkValidId(this.id) || !checkValidTitle(this.primaryTitle))
            {
                return false;
            }
            try
            {
                MoviesList.Add(this);
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }

        static public List<Movie> Read()
        {
            return MoviesList;
        }

        static public List<Movie> GetByTitle(string title)
        {
            List<Movie> movies = new List<Movie>();
            foreach (Movie movie in MoviesList)
            {
                if (movie.primaryTitle.Contains(title, StringComparison.OrdinalIgnoreCase))
                {
                    movies.Add(movie);
                }
            }
            return movies;
        }

        static public List<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate)
        {
            List<Movie> movies = new List<Movie>();
            foreach (Movie movie in MoviesList)
            {
                if (movie.releaseDate >= startDate && movie.releaseDate <= endDate)
                {
                    movies.Add(movie);
                }
            }
            return movies;
        }

        public bool CreateTestMovies()
        {
            Movie movie1 = new Movie(1, "www.movie1.com", "Movie 1", "Description 1", "image1.jpg", 2021, new DateTime(2021, 1, 1), "English", 1000000, 5000000, "Action, Adventure", false, 120, 7.5f, 1000);
            Movie movie2 = new Movie(2, "www.movie2.com", "Movie 2", "Description 2", "image2.jpg", 2020, new DateTime(2020, 2, 2), "English", 2000000, 6000000, "Drama, Romance", false, 130, 8.0f, 2000);
            Movie movie3 = new Movie(3, "www.movie3.com", "Movie 3", "Description 3", "image3.jpg", 2019, new DateTime(2019, 3, 3), "Spanish", 3000000, 7000000, "Comedy, Family", false, 140, 6.5f, 3000);
            Movie movie4 = new Movie(4, "www.movie4.com", "Movie 4", "Description 4", "image4.jpg", 2018, new DateTime(2018, 4, 4), "French", 4000000, 8000000, "Horror, Thriller", true, 150, 7.0f, 4000);
            Movie movie5 = new Movie(5, "www.movie5.com", "Movie 5", "Description 5", "image5.jpg", 2017, new DateTime(2017, 5, 5), "German", 5000000, 9000000, "Sci-Fi, Fantasy", false, 160, 8.5f, 5000);

            MoviesList.Add(movie1);
            MoviesList.Add(movie2);
            MoviesList.Add(movie3);
            MoviesList.Add(movie4);
            MoviesList.Add(movie5);

            return true;
        }

    }
}
