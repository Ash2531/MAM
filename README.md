# Installation and Running Guide
 
Follow these steps to install and run the application:
 
1. **Install Keycloak Server**  
   - Download Keycloak from the [official website](https://www.keycloak.org/downloads)
   - Extract the downloaded file to your preferred location
   - Navigate to the Keycloak bin directory
   - Start the server:
     ```bash
     # For Windows
     bin/kc.[sh|bat] start-dev
     
     # For Linux/Mac
     bin/kc.[sh|bat] start-dev
     ```
   - Access the Keycloak admin console at `http://localhost:8080`
   - Click on "Administration Console"
   - Create your admin account (e.g., Username: admin, Password: Admin@2531)
 
2. **Configure Keycloak Realm and Client**  
   - Log in to the admin console
   - Create a new realm:
     - Click "Add realm"
     - Enter a realm name (e.g., "my-app")
     - Click "Create"
   - Create a new client:
     - Go to "Clients" → "Create client"
     - Set Client ID (e.g., "my-app-client")
     - Set Client Protocol to "openid-connect"
     - Set Root URL to "http://localhost:4200"
     - Set Valid Redirect URIs to "http://localhost:4200/*"
     - Click "Save"
 
3. **Create a User in Keycloak**  
   - Go to "Users" → "Add user"
   - Fill in the required information
   - Go to "Credentials" tab
   - Set a password and disable "Temporary"
   - Click "Set Password"
 
4. **Install Application Dependencies**  
   - Navigate to the application directory
   - Run the following command to install dependencies:
     ```bash
     npm install
     ```
 
5. **Start the Application**  
   - Use the following command to start the application:
     ```bash
     ng serve
     ```
   - The application will start and redirect you to the Keycloak authentication page
   - Access the application at `http://localhost:4200`
 
6. **Login and Access the Application**  
   - Log in using the credentials of the user created in Keycloak
   - After successful login, you will be redirected to the application dashboard
