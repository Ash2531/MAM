# Installation and Running Guide

Follow these steps to install and run the application:

1. **Install Keycloak Server**  
  - Download and install the Keycloak server from the [official website](https://www.keycloak.org/).
  - Configure the Keycloak server in your system.

2. **Create a User in Keycloak**  
  - Access the Keycloak admin console.
  - Create a new user for login purposes.

3. **Install Application Dependencies**  
  - Navigate to the application directory.
  - Run the following command to install dependencies:
    ```bash
    npm install
    ```

4. **Start the Application**  
  - Use the following command to start the application:
    ```bash
    ng serve
    ```
  - The application will start and redirect you to the Keycloak authentication page.

5. **Login and Access the Application**  
  - Log in using the credentials of the user created in Keycloak.
  - After successful login, you will be redirected to `http://localhost:4200`.
