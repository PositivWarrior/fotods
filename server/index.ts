import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express, { type Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Import the cors package
import { registerRoutes } from './routes';
import path from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();

// Explicit health check endpoint
app.get('/health', (_req, res) => {
	res.status(200).send('OK');
});

// CORS configuration using the cors package
const allowedOrigins = [
	'http://localhost:5173', // Vite dev server
	'http://localhost:5000', // Local production
	'https://fotods.no', // Your production domain
	'https://www.fotods.no', // Your production domain with www
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
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	}),
);

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
		return oldSend.apply(this, arguments as any);
	};

	next();
});

(async () => {
	const server = createServer(app); // Create server instance early for ws

	if (process.env.NODE_ENV === 'development') {
		const { setupVite } = await import('./vite.dev.js');
		await setupVite(app, server);
	} else {
		const { serveStatic } = await import('./static.js');
		serveStatic(app); // 1. Serve static files (CSS, JS, images)
	}

	// 2. Register API routes AFTER static file serving is set up
	await registerRoutes(app);

	// 3. Error handling middleware (should be after API routes)
	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const status = err.status || err.statusCode || 500;
		const message = err.message || 'Internal Server Error';

		res.status(status).json({ message });
		throw err;
	});

	// AFTER other routes, including API routes, add the catch-all for SPA index.html
	if (process.env.NODE_ENV !== 'development') {
		const distPublicPath = path.resolve(
			path.dirname(fileURLToPath(import.meta.url)),
			'public',
		);
		app.get('*', (_req, res) => {
			// Check if distPublicPath and index.html exist to avoid errors if build is incomplete
			const indexPath = path.resolve(distPublicPath, 'index.html');
			if (fs.existsSync(indexPath)) {
				res.sendFile(indexPath);
			} else {
				res.status(404).send(
					'Frontend entry point (index.html) not found.',
				);
			}
		});
	}

	const port = process.env.PORT || 5000;
	server.listen(
		{
			port: Number(port),
			host: '0.0.0.0',
			reusePort: true,
		},
		() => {
			log(`serving on port ${port}`);
		},
	);
})();
