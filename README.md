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
│   │   ├── assets/
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   └── ... (other shared components)
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/         # Backend Express.js application
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/ (if applicable)
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

## Setup and Installation

### Prerequisites

-   Node.js (version compatible with project dependencies, e.g., >=18.x.x)
-   npm or yarn

### Backend (`server/`)

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file based on `.env.example` (if one exists) and populate it with necessary environment variables (e.g., `PORT`, `DATABASE_URL`, `JWT_SECRET`).
4.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The backend server will typically run on a port like `3001` (check your `server/.env` or `server/index.ts`).

### Frontend (`client/`)

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file if needed, especially for `VITE_API_BASE_URL` to point to your backend server (e.g., `VITE_API_BASE_URL=http://localhost:3001/api`).
4.  Start the Vite development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend development server will typically run on `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

### Client (`client/package.json`)

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the production-ready static assets into the `dist` folder.
-   `npm run preview`: Serves the production build locally to preview.
-   `npm run lint`: Runs ESLint (if configured).

### Server (`server/package.json`)

-   `npm run dev`: Starts the Express server with a watcher (e.g., using `nodemon` or `ts-node-dev`).
-   `npm run build`: Compiles TypeScript to JavaScript (typically into a `dist` folder).
-   `npm run start`: Runs the compiled JavaScript application (for production).
-   `npm run lint`: Runs ESLint (if configured).

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

This README provides a professional overview of the FotoDS project. Remember to keep it updated as the project evolves.
