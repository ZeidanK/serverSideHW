# ServerSideHW

This is a .NET 6.0 project designed to handle server-side functionality. It includes JWT authentication, routing, and other features. Below are the instructions for setting up and running the project, including the backend, frontend, and database.


## Home page
https://proj.ruppin.ac.il/cgroup4/test2/tar3/ClientSide/html/index.html

## Admin page No Auth 
https://proj.ruppin.ac.il/cgroup4/test2/tar3/ClientSide/admin/index.html

## Swagger API
https://proj.ruppin.ac.il/cgroup4/test2/tar1/swagger/index.html
---

## Prerequisites

1. **.NET SDK 6.0**  
   Install the .NET 6.0 SDK on your machine.  
   [Download .NET 6.0](https://dotnet.microsoft.com/download/dotnet/6.0)

   Install .NET 6 via Microsoft Package Repository

   First, add the Microsoft package signing key:
   bash

wget <https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb> -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

Then install the SDK:
bash

sudo apt-get update
sudo apt-get install -y dotnet-sdk-6.0

2. **SQL Database**  
   Ensure you have a SQL Server or compatible database installed and running.

3. **Node.js (for frontend live server)**  
   Install Node.js for running a live server for the frontend.  
   [Download Node.js](https://nodejs.org/)

---

## Running the Backend

1. **Restore Dependencies**  
   Navigate to the project directory and restore the required NuGet packages:

   ```bash
   dotnet restore
   ```

2. **Build the Project**  
   Build the project to ensure everything compiles correctly:

   ```bash
   dotnet build
   ```

3. **Run the Project**  
   Run the project using the following command:

   ```bash
   dotnet run
   ```

4. **Access Swagger**  
   Once the project is running, Swagger UI will be available at:

   - `https://localhost:7026/swagger`
   - `http://localhost:5099/swagger`

   Open the URL in your browser to test the API endpoints.

---

## Running the Frontend

1. **Navigate to the Frontend Directory**  
   Go to the directory where your frontend files are located:

   ```bash
   cd FrontEnd
   ```

2. **Install Dependencies**  
   If your frontend uses Node.js, install the required dependencies:

   ```bash
   npm install -g http-server
   ```

3. **Start a Live Server**  
   Start a live server to serve the frontend:

   ```bash
   http-server -p 3000
   ```

4. **Access the Frontend**  
   Open your browser and navigate to the URL provided by the live server (e.g., `http://localhost:3000`).

---

## Setting Up the SQL Database

1. **Install Azure Data Studio**  
   Since the project uses a remote SQL server, you can use Azure Data Studio as an alternative. Follow the instructions to install Azure Data Studio for Linux:  
   [Install Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio?tabs=linux-install%2Cwin-user-install%2Cubuntu-install%2Clinux-uninstall%2Cubuntu-uninstall)

2. **Create the Database**  
   Use Azure Data Studio to connect to your Azure SQL Server and create a new database for the project.

3. **Update Connection String**  
   Update the `appsettings.json` file with your Azure SQL database connection string:

   ```json
   "ConnectionStrings": {
       "DefaultConnection": "Server=tcp:YOUR_AZURE_SERVER.database.windows.net,1433;Database=YOUR_DATABASE;User Id=YOUR_USER@YOUR_AZURE_SERVER;Password=YOUR_PASSWORD;"
   }
   ```

4. **Apply Migrations**  
   Run the following command to apply migrations and set up the database schema:

   ```bash
   dotnet ef database update
   ```

---

## Additional Notes

- **Linux-Specific Commands**  
   If running on Linux, ensure you have the correct permissions and use the `ASPNETCORE_URLS` environment variable to specify the port:

  ```bash
  ASPNETCORE_URLS="http://localhost:5000" dotnet run
  ```

- **Swagger on Linux**  
   Access Swagger UI at the specified URL after running the project.

---

## Technologies Used

- **Backend**: .NET 6.0
- **Frontend**: Node.js (or other framework)
- **Database**: SQL Server

Feel free to contribute or raise issues if you encounter any problems!

```

```
