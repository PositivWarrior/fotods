import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';
import path from 'path';

const app = express();

// CORS configuration for production
app.use((req, res, next) => {
	const allowedOrigins = [
		'http://localhost:5173', // Vite dev server
		'http://localhost:5000', // Local production
		'https://fotods.no', // Your production domain
		'https://www.fotods.no', // Your production domain with www
	];

	const origin = req.headers.origin;

	// Always set CORS headers
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, OPTIONS',
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, X-Requested-With',
	);
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	// Set origin if it's in allowed list, otherwise allow fotods.no as fallback
	if (allowedOrigins.includes(origin as string)) {
		res.setHeader('Access-Control-Allow-Origin', origin as string);
	} else if (origin && origin.includes('fotods.no')) {
		res.setHeader('Access-Control-Allow-Origin', origin as string);
	} else {
		res.setHeader('Access-Control-Allow-Origin', 'https://fotods.no');
	}

	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
		return;
	}

	next();
});

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
