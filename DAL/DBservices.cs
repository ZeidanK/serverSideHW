using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using ServerSide_HW.Models;
using System.ComponentModel.Design;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservices
{
    

    public DBservices()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the appsettings.json 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("myProjDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }
    //--------------------------------------------------------------------------------------------------
    // This method rents a movie for the user 
    //--------------------------------------------------------------------------------------------------
    public int RentMovie(int userId, int movieId,DateOnly rentStart,DateOnly rentEnd,int totalPrice)
    {
        SqlConnection con;
        SqlCommand cmd;
        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@userId", userId);
        paramDic.Add("@movieId", movieId);
        paramDic.Add("@rentStart", rentStart);
        paramDic.Add("@rentEnd", rentEnd);
        paramDic.Add("@totalPrice", totalPrice);
        cmd = CreateCommandWithStoredProcedureGeneral("SP_Movies2025_RentMovie", con, paramDic);         // create the command
        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }


    //--------------------------------------------------------------------------------------------------
    // This method inserts a movie into the movies table 
    //--------------------------------------------------------------------------------------------------
    public int Insert(User user)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@email", user.Email);
        paramDic.Add("@userName", user.Name);
        paramDic.Add("@password", user.Password);
        paramDic.Add("@active", true);
        



        cmd = CreateCommandWithStoredProcedureGeneral("SP_Users2025_Insert", con, paramDic);         // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    //--------------------------------------------------------------------------------------------------
    // This method inserts a movie into the movies table 
    //--------------------------------------------------------------------------------------------------
    public int Insert(Movie movie)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@primaryTitle", movie.PrimaryTitle);
        paramDic.Add("@description", movie.Description);
        paramDic.Add("@primaryImage", movie.PrimaryImage);
        paramDic.Add("@url", movie.Url);
        paramDic.Add("@userId", movie.UserId);
        paramDic.Add("@year", movie.Year);
        paramDic.Add("@releaseDate", movie.ReleaseDate);
        paramDic.Add("@language", movie.Language);
        paramDic.Add("@budget", movie.Budget);
        paramDic.Add("@grossWorldwide", movie.GrossWorldwide);
        paramDic.Add("@genres", movie.Genres);
        paramDic.Add("@isAdult", movie.IsAdult);
        paramDic.Add("@runtimeMinutes", movie.RuntimeMinutes);
        paramDic.Add("@averageRating", movie.AverageRating);
        paramDic.Add("@numVotes", movie.NumVotes);


        cmd = CreateCommandWithStoredProcedureGeneral("SP_Movies2025_Insert", con, paramDic);         // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //---------------------------------------------------------------------------------
    // get all movies with filters
    //---------------------------------------------------------------------------------








    //---------------------------------------------------------------------------------
    // Create the SqlCommand
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, SqlConnection con, Dictionary<string, object> paramDic)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        if (paramDic != null)
            foreach (KeyValuePair<string, object> param in paramDic)
            {
                cmd.Parameters.AddWithValue(param.Key, param.Value);

            }


        return cmd;
    }
    public int ChangeUserSatus(int id)
    {
        SqlConnection con;
        SqlCommand cmd;
        SqlDataReader reader= null;
        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedureGeneral("sp_Users2025_Get", con, null); // create the command



        return 0;
    }
    public (List<User>, int) GetAllUsers()
    {
        SqlConnection con;
        SqlCommand cmd;
        SqlDataReader reader = null;
        List<User> users = new List<User>();
        int totalCount = 0;
        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        
        cmd = CreateCommandWithStoredProcedureGeneral("sp_Users2025_Get", con,null); // create the command
        try
        {
            reader = cmd.ExecuteReader();
            // Read users
            while (reader.Read())
            {
                User user = new User
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Name = reader["userName"].ToString(),
                    Email = reader["email"].ToString(),
                    Password = reader["password"].ToString(),
                    Active = reader["active"] != DBNull.Value && Convert.ToBoolean(reader["active"])
                };
                users.Add(user);
            }
            // Move to the next result set to get the total count
            if (reader.NextResult() && reader.Read())
            {
                totalCount = Convert.ToInt32(reader["totalCount"]);
            }
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (reader != null)
            {
                reader.Close();
            }
            if (con != null)
            {
                con.Close();
            }
        }
        return (users, totalCount);
    }
    //--------------------------------------------------------------------------------------------------
    // This method searches for movies with filters and pagination
    //--------------------------------------------------------------------------------------------------
    public (List<Movie>, int) SearchMovies(string searchTerm, DateTime? releaseDateFrom, DateTime? releaseDateTo, int pageNumber, int pageSize)
    {
        SqlConnection con;
        SqlCommand cmd;
        SqlDataReader reader = null;
        List<Movie> movies = new List<Movie>();
        int totalCount = 0;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>
        {
            { "@searchTerm", string.IsNullOrEmpty(searchTerm) ? DBNull.Value : searchTerm },
            { "@releaseDateFrom", releaseDateFrom.HasValue ? releaseDateFrom.Value : DBNull.Value },
            { "@releaseDateTo", releaseDateTo.HasValue ? releaseDateTo.Value : DBNull.Value },
            { "@pageNumber", pageNumber },
            { "@pageSize", pageSize }
        };

        cmd = CreateCommandWithStoredProcedureGeneral("sp_Movies2025_Search", con, paramDic); // create the command

        try
        {
            reader = cmd.ExecuteReader();

            // Read movies
            while (reader.Read())
            {
                Movie movie = new Movie
                {
                    Id = Convert.ToInt32(reader["id"]),
                    PrimaryTitle = reader["primaryTitle"].ToString(),
                    Description = reader["description"].ToString(),
                    PrimaryImage = reader["primaryImage"].ToString(),
                    Url = reader["url"].ToString(),
                    Year = Convert.ToInt32(reader["year"]),
                    ReleaseDate = Convert.ToDateTime(reader["releaseDate"]),
                    Language = reader["language"].ToString(),
                    Budget = Convert.ToDouble(reader["budget"]),
                    GrossWorldwide = Convert.ToDouble(reader["grossWorldwide"]),
                    Genres = reader["genres"].ToString(),
                    IsAdult = Convert.ToBoolean(reader["isAdult"]),
                    RuntimeMinutes = Convert.ToInt32(reader["runtimeMinutes"]),
                    AverageRating = Convert.ToSingle(reader["averageRating"]),
                    NumVotes = Convert.ToInt32(reader["numVotes"]),
                    UserId = Convert.ToInt32(reader["userId"]),
                    PriceToRent = Convert.ToInt32(reader["priceToRent"]),
                    RentalCount = Convert.ToInt32(reader["rentalCount"])
                };
                movies.Add(movie);
            }

            // Move to the next result set to get the total count
            if (reader.NextResult() && reader.Read())
            {
                totalCount = Convert.ToInt32(reader["totalCount"]);
            }
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (reader != null)
            {
                reader.Close();
            }
            if (con != null)
            {
                con.Close();
            }
        }

        return (movies, totalCount);
    }

    //--------------------------------------------------------------------------------------------------  
    // This method retrieves user information based on email, id, or username  
    //--------------------------------------------------------------------------------------------------  
    public User GetUser(string email = null, int? id = null, string userName = null)
    {
        SqlConnection con;
        SqlCommand cmd;
        SqlDataReader reader = null;
        User user = null;

        try
        {
            con = connect("myProjDB"); // create the connection  
        }
        catch (Exception ex)
        {
            // write to log  
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>
       {
           { "@id", id.HasValue ? id.Value : DBNull.Value },
           { "@userName", string.IsNullOrEmpty(userName) ? DBNull.Value : userName },
           { "@Email", string.IsNullOrEmpty(email) ? DBNull.Value : email }
           
       };

        cmd = CreateCommandWithStoredProcedureGeneral("sp_Users2025_Get", con, paramDic); // create the command  

        try
        {
            reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                user = new User
                {
                    Id = Convert.ToInt32(reader["id"]),
                    Name = reader["userName"].ToString(),
                    Email = reader["email"].ToString(),
                    Password = reader["password"].ToString(),
                    Active = Convert.ToBoolean(reader["active"]),
                };
            }
        }
        catch (Exception ex)
        {
            // write to log  
            throw (ex);
        }
        finally
        {
            if (reader != null)
            {
                reader.Close();
            }
            if (con != null)
            {
                con.Close();
            }
        }

        return user;
    }

    //--------------------------------------------------------------------------------------------------  
    // This method updates a user's profile in the database  
    //--------------------------------------------------------------------------------------------------  
    public int UpdateUser(User user)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection  
        }
        catch (Exception ex)
        {
            // write to log  
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>
       {
           { "@id", user.Id },
           { "@email", user.Email },
           { "@userName", user.Name },
           { "@firstName", DBNull.Value }, // Assuming firstName is not part of the User class  
           { "@lastName", DBNull.Value },  // Assuming lastName is not part of the User class  
           { "@password", string.IsNullOrEmpty(user.Password) ? DBNull.Value : user.Password },
           { "@birthDate", DBNull.Value },  // Assuming birthDate is not part of the User class
           { "@active", user.Active }
       };

        cmd = CreateCommandWithStoredProcedureGeneral("sp_Users2025_Update", con, paramDic); // create the command  

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command  
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log  
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // close the db connection  
                con.Close();
            }
        }
    }


    //--------------------------------------------------------------------
    // TODO Build the FLight Delete  method
    // DeleteFlight(int id)
    //--------------------------------------------------------------------

}
