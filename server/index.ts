import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express, { type Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Import the cors package
import { registerRoutes } from './routes';
import path from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const app = express();

// Explicit health check endpoint
app.get('/health', (_req, res) => {
	res.status(200).send('OK');
});

// CORS configuration using the cors package
const allowedOrigins = [
	'http://localhost:5173', // Vite dev server
	'http://localhost:5000', // For any direct access if needed, though Vite proxy is preferred
	'https://fotods.no', // Your production domain
	'https://www.fotods.no', // Your production domain with www
	'https://fotods-production.up.railway.app', // Your Railway production domain
];

app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				const msg =
					'The CORS policy for this site does not allow access from the specified Origin.';
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	}),
);

// Add this new block to log OPTIONS requests
app.options('*', (req, res, next) => {
	const origin = req.header('Origin');
	log(`Received OPTIONS request for ${req.path} from origin: ${origin}`);
	// The cors() middleware should have already handled sending the
	// appropriate headers. If this explicit handler is reached and the
	// cors() middleware is configured correctly, it might indicate an issue
	// with the cors middleware not terminating the OPTIONS request chain.
	// However, Express's cors middleware usually sends a 204 response
	// itself for OPTIONS requests.
	// We let it fall through to see if other handlers or the main cors
	// middleware sends the response. If issues persist, we might add res.sendStatus(204) here.
	next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dynamic import for the log function from static.ts (or define it locally if preferred)
let log = (message: string) => console.log(`[server] ${message}`);
import('./static.js')
	.then((staticModule) => {
		if (staticModule.log) {
			log = staticModule.log;
		}
	})
	.catch((err) =>
		console.error('Failed to load static.js for log function', err),
	);

app.use((req, _res, next) => {
	const start = Date.now();

	const oldSend = _res.send;
	_res.send = function (data) {
		const duration = Date.now() - start;
		log(`${req.method} ${req.path} ${_res.statusCode} in ${duration}ms`);
		// @ts-ignore
		return oldSend.apply(this, arguments as any);
	};

	next();
});

(async () => {
	const server = createServer(app); // Create server instance for the API

	// Register API routes. These should be available in both dev and prod.
	await registerRoutes(app);

	if (process.env.NODE_ENV !== 'development') {
		// Production-specific setup: serve static frontend files
		const { serveStatic } = await import('./static.js');
		serveStatic(app); // Serve static files (CSS, JS, images)

		// AFTER other routes, including API routes, add the catch-all for SPA index.html in production
		const distPublicPath = path.resolve(
			path.dirname(fileURLToPath(import.meta.url)),
			'public', // This should point to your Vite build output directory (client/dist or similar)
		);
		app.get('*', (_req, res) => {
			const indexPath = path.resolve(distPublicPath, 'index.html');
			if (fs.existsSync(indexPath)) {
				res.sendFile(indexPath);
			} else {
				log(
					`Warning: Frontend entry point (index.html) not found at ${indexPath}`,
				);
				res.status(404).send(
					'Frontend entry point (index.html) not found.',
				);
			}
		});
	}

	// Error handling middleware (should be after API routes and SPA catch-all if any)
	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const status = err.status || err.statusCode || 500;
		const message = err.message || 'Internal Server Error';
		log(
			`Error: ${status} - ${message} - URL: ${_req.originalUrl} - Method: ${_req.method}`,
		);
		if (err.stack) {
			log(err.stack);
		}
		res.status(status).json({ message });
		// Removed throw err; as it might terminate the process. Logging is usually sufficient.
	});

	const port = process.env.PORT || 5000;
	server.listen(
		{
			port: Number(port),
			host: '0.0.0.0',
			// reusePort: true, // reusePort can be problematic, let's remove it to be safe
		},
		() => {
			log(`Backend server serving API on port ${port}`);
		},
	);
})();

// Get the API base URL from environment or default to Railway backend
const API_BASE_URL =
	import.meta.env.VITE_API_URL || 'https://fotods-production.up.railway.app';
