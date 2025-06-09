# Project Title

## Description

This project is an Angular application demonstrating various features, including a dashboard interface, simulated user authentication, navigation, and a utility for checking project library versions.

## Features

*   **Dashboard:** Main landing page with dynamic content.
*   **Navigation:** Sidebar menu with links to different sections.
*   **Simulated Authentication:** Basic login state simulation.
*   **Library Version Checker:** Displays project dependencies from `package.json` and checks for the latest versions from the npm registry.
*   **Dynamic Content Display:** Conditional rendering of UI elements based on state (e.g., login status, show more tiles).
*   **Video/Image Preview:** Modal dialog for viewing media items.

## Technologies Used

*   Angular (v19.x)
*   Angular Material
*   RxJS for state management (BehaviorSubjects, Observables)
*   Tailwind CSS (via PostCSS) for styling
*   ngx-translate for internationalization
*   Keycloak-js (intended for future full integration)
*   Shaka Player (for video playback)
*   Node.js (for build scripts)
*   npm (for package management)

## Setup

1.  **Prerequisites:** Make sure you have Node.js (v18 or higher recommended) and the Angular CLI installed globally.

    ```bash
    npm install -g @angular/cli
    ```

2.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

**Start the development server:** 

Run the following command to start the development server. This will automatically copy the package.json to assets and then serve the application with live reloading and the proxy for the library checker.

```bash
npm start
```

The application will be available at `http://localhost:4200/`. The browser should automatically open to this address.

**Note:** While you can run `ng serve` directly, using `npm start` is preferred as it ensures all necessary setup steps (like copying package.json) are completed first.

## Project Structure / Low-Level Design (LLD)

The project follows a standard Angular structure.

*   `src/app/`: Contains the main application code.
    *   `dashboard/`: Contains the `DashboardComponent` (main page, navigation, content display).
    *   `library-versions/`: Contains the `LibraryVersionsDialog` for displaying library info.
    *   `services/`: Contains shared services like `PackageService` for fetching package data.
    *   `shared/`: Potentially for shared modules, components, or directives.
    *   `app.config.ts`, `app.routes.ts`: Application configuration and routing.
*   `scripts/`: Contains helper scripts, e.g., `copy-package.js`.
*   `proxy.conf.json`: Proxy configuration for the development server.
*   `package.json`: Project dependencies and scripts.

**Key Components & Services:**

*   `DashboardComponent`: Manages the main layout, navigation state (simulated login, menu items), view modes, procedure data (using RxJS BehaviorSubjects), and handles interactions like tile clicks and selection.
*   `LibraryVersionsDialog`: A Material Design dialog component that displays a table of library versions fetched from `package.json` and checks for the latest versions via the `PackageService`.
*   `PackageService`: Handles reading `package.json` (from assets) and fetching latest package versions from the npm registry. It uses RxJS `HttpClient` and operators (`map`, `switchMap`, `forkJoin`, `catchError`).
*   **State Management:** The project uses a mix of Angular Signals (for UI state like `viewMode`) and RxJS BehaviorSubjects/Observables (for data streams like `procedures$`, `selectedItems$`) for managing application state.

**Component Interaction Diagram (Conceptual):**

```mermaid
graph TD;
    User --> DashboardComponent;
    DashboardComponent --Manages--> NavigationMenu;
    DashboardComponent --Manages--> MainContent;
    DashboardComponent --Provides Data To--> ProcedureListComponent;
    DashboardComponent --Handles Events From--> ProcedureListComponent;
    DashboardComponent --Provides Data To--> SearchControlsComponent;
    DashboardComponent --Handles Events From--> SearchControlsComponent;
    DashboardComponent --Opens Dialog--> LibraryVersionsDialog;
    LibraryVersionsDialog --Uses--> PackageService;
    PackageService --Reads--> package.json;
    PackageService --Fetches From--> npmRegistry (via Proxy in Dev);

    subgraph UI Components
        NavigationMenu
        ProcedureListComponent
        SearchControlsComponent
        LibraryVersionsDialog
        MainContent
    end

    subgraph Services
        PackageService
        % AuthService (Intended)
    end

    subgraph Data Sources
        package.json
        npmRegistry
    end

    Style NavigationMenu fill:#f9f,stroke:#333,stroke-width:2px;
    Style ProcedureListComponent fill:#ccf,stroke:#333,stroke-width:2px;
    Style SearchControlsComponent fill:#ccf,stroke:#333,stroke-width:2px;
    Style LibraryVersionsDialog fill:#cfc,stroke:#333,stroke-width:2px;
    Style MainContent fill:#f9f,stroke:#333,stroke-width:2px;
    Style DashboardComponent fill:#ff9,stroke:#333,stroke-width:2px;
    Style PackageService fill:#f9f,stroke:#333,stroke-width:2px;
    Style package.json fill:#eee,stroke:#333,stroke-width:1px;
    Style npmRegistry fill:#eee,stroke:#333,stroke-width:1px;
```

## Core Features Explained

### Environment Configuration

This project uses Angular's environment files located in `src/environments/`:

* `environment.ts` - Development environment configuration
* `environment.prod.ts` - Production environment configuration

**Key Environment Variables:**

* `production`: Boolean flag indicating production mode
* `keycloak`: Configuration object for Keycloak authentication
  * `url`: Keycloak server URL
  * `realm`: Keycloak realm name
  * `clientId`: Client ID for your application
  * `redirectUri`: OAuth callback URL
  * Additional endpoints and configuration options

To modify environment variables:

1. For development, edit `src/environments/environment.ts`
2. For production, edit `src/environments/environment.prod.ts`
3. After changes, rebuild the application:
   ```bash
   # For development
   ng serve

   # For production
   ng build --configuration=production
   ```

The environment files are imported in your application code using:
```typescript
import { environment } from '@env/environment';
```

**Note:** The `@env` path alias is configured in `tsconfig.json` for convenient imports.

### Login Flow (Simulated)

The current implementation simulates a login state using an `isLoggedIn` boolean property in `DashboardComponent`. This property is initially `false` and set to `true` after a short delay using `setTimeout` in `ngOnInit`. UI elements like the sidebar, toolbar, and main content are conditionally displayed based on this property using `*ngIf="isLoggedIn"` in the template.

**Intended Login Flow with Keycloak:**

The project structure includes hints towards using Keycloak for authentication. A full implementation would involve:

1.  **Keycloak Service:** A dedicated service to handle Keycloak initialization, login, logout, token management, and checking authentication status.
2.  **Route Guards:** Angular route guards (`CanActivate`) to protect routes and redirect unauthenticated users to the Keycloak login page.
3.  **HTTP Interceptor:** An interceptor to attach the Keycloak token to outgoing API requests for authorization.
4.  **Integration in `DashboardComponent`:** The `isLoggedIn` logic would be replaced by subscribing to the authentication status provided by the Keycloak service.

### Keycloak Integration (Intended)

Keycloak is intended to be used as the Identity and Access Management (IAM) solution. It would provide:

*   Centralized user authentication.
*   Authorization services (roles, permissions).
*   Single Sign-On (SSO).

Full integration requires setting up a Keycloak server and configuring the `keycloak-js` adapter in the Angular application, including initialization and handling authentication flows (e.g., authorization code flow).

### Navigation Menu

The main navigation menu is part of the `DashboardComponent`'s template, implemented using Angular Material's `mat-sidenav` and `mat-nav-list`. The menu items are currently defined in a simple array (`menuItems`) within the component. Each item includes a `text`, `icon`, `link` (for routing), and `position` (start/end, although not fully utilized in the current layout). The menu itself is hidden before the simulated login using `*ngIf="isLoggedIn"`.

### Library Version Checker

This feature, accessed via the "Libraries Used" menu item, opens a dialog (`LibraryVersionsDialog`) displaying a table of dependencies:

*   **Library Name:** The name of the package (e.g., `@angular/material`).
*   **Current Version:** The version specified in your project's `package.json`.
*   **Latest Version:** The version fetched from the npm registry.
*   **Status:** Indicates "Up to date", "Update Available", or "Unknown" (if the latest version couldn't be fetched).

The `PackageService` handles the data fetching:

1.  It reads the `package.json` file, which is copied to the `src/assets` folder by the `npm run copy-package` script.
2.  It makes HTTP requests to the npm registry to get the latest version for each tracked library.

**Handling Cross-Origin Requests (CORS):**

*   **Development (`ng serve`):** A proxy configured via `proxy.conf.json` and `angular.json` redirects requests from `/api/npm-registry/*` to `https://registry.npmjs.org/*`. This bypasses browser CORS restrictions during development.
*   **Production (`ng build`):** The `proxy.conf.json` is *not* used. To make the library checker work in production, you must configure your production web server (Nginx, Apache, etc.) or backend application to act as a reverse proxy for the `/api/npm-registry` path, forwarding requests to `https://registry.npmjs.org`.

## Deployment Notes

For deploying the production build (`ng build`), ensure you:

*   Run `npm run copy-package` before building.
*   Configure your production web server (e.g., Nginx, Apache) to serve the static files from the `dist/` folder.
*   Crucially, set up a reverse proxy on your production server/backend to forward requests from `/api/npm-registry/*` to `https://registry.npmjs.org/*` to enable the library version checker.
*   Full Keycloak integration in production will also require server-side configuration and potentially specific deployment steps for the Keycloak server itself.

## Future Enhancements

*   Full integration with Keycloak for robust authentication and authorization.
*   Implement route guards to protect application routes.
*   Implement an HTTP interceptor for attaching authentication tokens.
*   Dynamic menu item loading based on user roles/permissions from Keycloak.
*   Improved error handling and user feedback.
*   Ability to update library versions directly from the dialog (more advanced).
