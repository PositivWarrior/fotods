import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express, { type Request, Response, NextFunction } from 'express';
import cors from 'cors'; // Import the cors package
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';
import path from 'path';

const app = express();

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

// We now use Supabase Storage for file uploads

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
	const server = await registerRoutes(app);

	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const status = err.status || err.statusCode || 500;
		const message = err.message || 'Internal Server Error';

		res.status(status).json({ message });
		throw err;
	});

	// importantly only setup vite in development and after
	// setting up all the other routes so the catch-all route
	// doesn't interfere with the other routes
	if (app.get('env') === 'development') {
		await setupVite(app, server);
	} else {
		serveStatic(app);
	}

	// ALWAYS serve the app on port 5000
	// this serves both the API and the client.
	// It is the only port that is not firewalled.
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
