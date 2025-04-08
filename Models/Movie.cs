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
            set => id = value;
        }
        public string Url
        {
            get => url;
            set => url = value;
        }
        public string PrimaryTitle
        {
            get => primaryTitle;
            set => primaryTitle = value;
        }
        public string Description
        {
            get => description;
            set => description = value;
        }
        public string PrimaryImage
        {
            get => primaryImage;
            set => primaryImage = value;
        }
        public int Year
        {
            get => year;
            set => year = value;
        }
        public DateTime ReleaseDate
        {
            get => releaseDate;
            set => releaseDate = value;
        }
        public string Language
        {
            get => language;
            set => language = value;
        }
        public double Budget
        {
            get => budget;
            set => budget = value;
        }
        public double GrossWorldwide
        {
            get => grossWorldwide;
            set => grossWorldwide = value;
        }
        public string Genres
        {
            get => genres;
            set => genres = value;
        }
        public bool IsAdult
        {
            get => isAdult;
            set => isAdult = value;
        }
        public int RuntimeMinutes
        {
            get => runtimeMinutes;
            set => runtimeMinutes = value;
        }
        public float AverageRating
        {
            get => averageRating;
            set => averageRating = value;
        }
        public int NumVotes
        {
            get => numVotes;
            set => numVotes = value;
        }

        public bool ValidateMovie()
        {
            if (!checkValidId(this.id) || !checkValidTitle(this.primaryTitle))
            {
                throw new Exception($"Validation failed: id or primary title error");
                return false;
            }
            try
            {
                ValidationHelper.ValidatePositive<int>(this.id, nameof(Id), allowZero: false);
                ValidationHelper.ValidateString(this.url, nameof(Url));
                ValidationHelper.ValidateString(this.primaryTitle, nameof(PrimaryTitle));
                ValidationHelper.ValidateString(this.description, nameof(Description));
                ValidationHelper.ValidateString(this.primaryImage, nameof(PrimaryImage));
                ValidationHelper.ValidatePositive<int>(this.year, nameof(Year), allowZero: true);
                ValidationHelper.ValidateDate(this.releaseDate, nameof(ReleaseDate));
                ValidationHelper.ValidateString(this.language, nameof(Language));
                ValidationHelper.ValidatePositive<double>(this.budget, nameof(Budget), allowZero: true);
                ValidationHelper.ValidatePositive<double>(this.grossWorldwide, nameof(GrossWorldwide), allowZero: true);
                ValidationHelper.ValidateString(this.genres, nameof(Genres));
                ValidationHelper.ValidatePositive<int>(this.runtimeMinutes, nameof(RuntimeMinutes), allowZero: true);
                ValidationHelper.ValidatePositive<float>(this.averageRating, nameof(AverageRating), allowZero: true);
                ValidationHelper.ValidatePositive<int>(this.numVotes, nameof(NumVotes), allowZero: true);
                //return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Validation failed: {ex.Message}");
                //return false;
            }
            return true;
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

        public bool Insert()
        {
            
            try
            {
                this.ValidateMovie();
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

        static public bool DeleteMovie(int id)
        {
            if (id < 1)
            {
                return false;
            }
            if(MoviesList.Count == 0)
            {
                return false;
            }

            Movie movieToDelete = MoviesList.FirstOrDefault(m => m.id == id);
            if (movieToDelete != null)
            {
                MoviesList.Remove(movieToDelete);
                return true;
            }
            return false;
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
