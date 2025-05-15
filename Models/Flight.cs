namespace ServerSide_HW.Models
{
    public class Flight
    {
        public int Id { get; set; } 
        public string From { get; set; }
        public string To { get; set; }
        public double Price { get; set; }
        public int Insert()
        {
            DBservices dbs = new DBservices();
            return 1;
                 
            //return dbs.InsertFlight(this);
        }

        // TODO Implement the flight delete method

        static public List<Flight> Read() { 
        
            DBservices dbs = new DBservices();
            return dbs.ReadFlights();
        
        }


    }
}
