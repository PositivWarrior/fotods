# FotoDS - Dawid Siedlec Photographer Portfolio Website

## Overview

FotoDS is the official website for Dawid Siedlec Fotografi, a professional photographer specializing in property, wedding, portrait, and family photography. The website serves as a portfolio to showcase Dawid's work, provide information about services and pricing, and allow potential clients to get in touch.

The project is built with a modern tech stack, focusing on performance, accessibility, and user experience.

**Live Site:** [fotods.no](https://fotods.no)

## Key Features

-   **Portfolio Showcase:** Displays high-quality images of the photographer's work.
-   **Service Information:** Detailed descriptions of photography services offered (e.g., property, events).
-   **Pricing Packages:** Clear and structured pricing for various photography packages.
-   **About Section:** Information about the photographer, Dawid Siedlec.
-   **Contact Form:** Allows users to easily send inquiries.
-   **Responsive Design:** Optimized for viewing on various devices (desktops, tablets, mobiles).
-   **Performance Optimized:** Focus on fast loading times, optimized images (WebP format, responsive images using `<picture>`), lazy loading, and code splitting.
-   **Accessibility Conscious:** Implemented with ARIA attributes and best practices for accessibility.
-   **Secure:** Uses HTTPS and considerations for modern security headers.

## Tech Stack

### Frontend (`client/`)

-   **Framework/Library:** React (with Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Routing:** Wouter
-   **Animations:** Framer Motion
-   **Meta Management:** React Helmet
-   **Linting/Formatting:** ESLint, Prettier (assumed standard setup)

### Backend (`server/`)

-   **Framework:** Express.js (Node.js)
-   **Language:** TypeScript
-   **API:** RESTful API for user authentication and data (e.g., photos).
-   **Middleware:**
    -   `compression` for gzipping API responses.
    -   Likely `cors`, `body-parser` (standard for Express APIs).

## Project Structure

```
fotods/
├── client/         # Frontend React application (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   └── ... (other shared components)
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── __mocks__/ # Jest mocks
│   │   │   └── fileMock.js
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── jest.setup.ts # Jest setup
│   ├── index.html
│   └── vite.config.ts # Note: Main tsconfig.json is at root
│
├── server/         # Backend Express.js application
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/ (if applicable)
│   │   └── index.ts
│   └── .env          # Server environment variables (example)
│
├── public/           # Vite public assets (served from root by Vite)
├── node_modules/
├── dist/             # Production build output
├── .env              # Root .env for server in dev (if applicable for `dotenv-cli`)
├── package.json      # Project (root) dependencies and scripts
├── package-lock.json
├── tsconfig.json     # Root TypeScript configuration
├── tailwind.config.ts
├── vite.config.ts    # Root Vite configuration (for client)
├── jest.config.js    # Jest configuration
└── README.md
```

## Setup and Installation

### Prerequisites

-   Node.js (version compatible with project dependencies, e.g., >=18.x.x)
-   npm or yarn

### Running the Application

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the project root directory:**
    ```bash
    cd fotods
    ```
3.  **Install dependencies** (this will install dependencies for both client and server as defined in the root `package.json`):
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Environment Variables:**

    -   **Server:** Create a `server/.env` file. You might want to copy from an example if one exists (e.g., `server/.env.example`). Populate it with necessary environment variables (e.g., `PORT`, `DATABASE_URL`, `JWT_SECRET`).
    -   **Client (Vite):** If your client needs specific environment variables (e.g., `VITE_API_BASE_URL`), they are typically placed in a `.env` file in the `client` directory (e.g., `client/.env`) or in the root `.env` file, prefixed with `VITE_`. Refer to Vite's documentation on environment variables. The `dev:client` script uses `vite`, which will automatically load these.

5.  **Start the development servers** (this command from the root `package.json` runs both client and server concurrently):
    ```bash
    npm run dev
    ```
    This typically involves:
    -   **Backend server** (Express.js) running on a port like `3001` (controlled by `server/.env`).
    -   **Frontend Vite development server** running on a port like `5173`.

## Available Scripts

All scripts are run from the **project root directory**.

-   `npm run dev`: Starts both the backend server and frontend Vite development server concurrently.
-   `npm run dev:server`: Starts the backend Express server in development mode (using `tsx` and `dotenv`).
-   `npm run dev:client`: Starts the frontend Vite development server.
-   `npm run build`: Builds both the frontend and backend for production.
    -   Frontend: Uses `vite build`.
    -   Backend: Uses `esbuild`.
-   `npm run build:frontend`: Builds only the frontend application.
-   `npm run start`: Starts the production Node.js server (expects a prior build).
-   `npm run check`: Runs TypeScript checks.
-   `npm run test`: Runs Jest tests for the client-side components.
-   `npm run test:watch`: Runs Jest tests in watch mode.
-   `npm run db:push`: Pushes Drizzle ORM schema changes.
-   `npm run db:generate-migration`: Generates Drizzle ORM migrations.
-   `npm run db:migrate`: Applies Drizzle ORM migrations.

## Testing

The frontend React components are tested using **Jest** and **React Testing Library**.

### Setup

-   **Jest Configuration:** `jest.config.js` in the project root.
    -   Uses `ts-jest` for TypeScript.
    -   Environment is `jsdom`.
    -   Tests are located in `client/src`.
    -   Handles static asset imports and the `@/` path alias.
-   **Jest Setup File:** `client/jest.setup.ts` imports `@testing-library/jest-dom` for extended DOM matchers.
-   **Mocking:** Static files (images, etc.) are mocked using `client/__mocks__/fileMock.js`. CSS imports can be mocked using `identity-obj-proxy` (install if needed: `npm install --save-dev identity-obj-proxy`).

### Running Tests

-   To run all tests once:
    ```bash
    npm test
    ```
-   To run tests in interactive watch mode:
    `bash
npm run test:watch
`
    Test files are typically named `*.test.tsx` or `*.spec.tsx` within the `client/src` directory, often co-located with the components they test.

## Deployment

The application is hosted on [Railway](https.railway.app/). The deployment process typically involves:

1.  Connecting the GitHub repository to Railway.
2.  Configuring build commands and start commands for both the `client` and `server` services within Railway.
3.  Setting up environment variables in the Railway dashboard.

Railway handles building the Docker images (or using Nixpacks) and deploying the services.

## Lighthouse & Performance

Continuous monitoring with Lighthouse has been a key part of development, focusing on:

-   **Largest Contentful Paint (LCP):** Optimized by compressing and resizing hero images, using WebP format, and `loading="eager"` for critical images.
-   **JavaScript Execution Time:** Reduced by code splitting (route-based lazy loading), minification, and tree-shaking via Vite's production build.
-   **Image Optimization:** Serving appropriately sized images in modern formats like WebP.
-   **Text Compression:** Enabled on the backend API responses using the `compression` middleware.
-   **Accessibility:** Addressing issues like color contrast, accessible names for interactive elements, and viewport scalability.

## Future Considerations & Potential Improvements

-   **Advanced About Page Layout:** Implement the planned complex layout for the "About" section when the hero image is displayed.
-   **Comprehensive Security Headers:** Implement Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), Cross-Origin Opener Policy (COOP), and X-Frame-Options (XFO) on the server-side for enhanced security.
-   **Admin Panel:** A dedicated admin interface for managing portfolio images, content, and bookings.
-   **Automated Image Optimization Pipeline:** Integrate an automated process for image resizing, compression, and format conversion during the build or upload process.
-   **End-to-End Testing:** Implement E2E tests using tools like Cypress or Playwright.
-   **CI/CD Enhancements:** Further automate testing and deployment workflows.

---

