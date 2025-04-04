using Microsoft.AspNetCore.Mvc;
using ServerSide_HW.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ServerSide_HW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        // GET: api/<MoviesController>
        [HttpGet]
        public IEnumerable<Movie> Get()
        {
            List<Movie> movies = Movie.Read();
            return movies;
        }

        // GET: api/<MoviesController>/exampleData
        [HttpGet("exampleData")]
        public IEnumerable<Movie> GetExampleData()
        {
            List<Movie> movies = new List<Movie>();
            Movie movie1 = new Movie(1, "www.movie1.com", "Movie 1", "Description 1", "image1.jpg", 2021, new DateTime(2021, 1, 1), "English", 1000000, 5000000, "Action, Adventure", false, 120, 7.5f, 1000);
            Movie movie2 = new Movie(2, "www.movie2.com", "Movie 2", "Description 2", "image2.jpg", 2020, new DateTime(2020, 2, 2), "English", 2000000, 6000000, "Drama, Romance", false, 130, 8.0f, 2000);
            Movie movie3 = new Movie(3, "www.movie3.com", "Movie 3", "Description 3", "image3.jpg", 2019, new DateTime(2019, 3, 3), "Spanish", 3000000, 7000000, "Comedy, Family", false, 140, 6.5f, 3000);
            Movie movie4 = new Movie(4, "www.movie4.com", "Movie 4", "Description 4", "image4.jpg", 2018, new DateTime(2018, 4, 4), "French", 4000000, 8000000, "Horror, Thriller", true, 150, 7.0f, 4000);
            Movie movie5 = new Movie(5, "www.movie5.com", "Movie 5", "Description 5", "image5.jpg", 2017, new DateTime(2017, 5, 5), "German", 5000000, 9000000, "Sci-Fi, Fantasy", false, 160, 8.5f, 5000);

            movies.Add(movie1);
            movie1.insert();

            movies.Add(movie2);
            movies.Add(movie3);
            movies.Add(movie4);
            movies.Add(movie5);
            movie2.insert();
            movie3.insert();
            movie4.insert();
            movie5.insert();
            movies = Movie.Read();
            return movies;
        }

        // GET api/<MoviesController>/5
        [HttpGet("(title)")]
        public List<Movie> GetByTitle(string title)
        {
            List<Movie> filterdMovies = Movie.GetByTitle(title);
            return filterdMovies;
        }


        // GET api/<MoviesController>/5
        [HttpGet("GetByReleaseDate/startDate/{startDate}/endDate/{endDate}")]
        public List<Movie> GetByReleaseDate(DateTime startDate,DateTime endDate)
        {
            List<Movie> filterdMovies = Movie.GetByReleaseDate(startDate, endDate);
            return filterdMovies;
        }
        // POST api/<MoviesController>
        [HttpPost]
        public bool Post([FromBody] Movie movie)
        {
            try { return movie.insert(); }
            catch (Exception e) { Console.WriteLine(e.Message); return false; }
            return true;
        }

        //// PUT api/<MoviesController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        // DELETE api/<MoviesController>/5
        [HttpDelete("{id}")]
        public bool Delete(int id)
        {
            return Movie.DeleteMovie(id);
        }
    }
}
