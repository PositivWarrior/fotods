import express, { type Express } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message: string, source = 'express') {
	const formattedTime = new Date().toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});

	console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
	// Adjusted path assuming 'dist/public' is relative to project root after esbuild
	// and this file (static.ts) will be in 'dist' alongside 'index.js'
	const distPublicPath = path.resolve(__dirname, 'public');

	if (!fs.existsSync(distPublicPath)) {
		console.error(
			`Error: Static files directory not found at ${distPublicPath}`,
		);
		// In production, if these files don't exist, something is very wrong with the build.
		// We might want to throw an error or handle it gracefully depending on desired behavior.
		// For now, let's log and prevent server crash if path is incorrect.
		// A more robust solution would ensure the build process always creates this path.
		app.use('*', (_req, res) => {
			res.status(500).send(
				'Server configuration error: Static assets not found.',
			);
		});
		return;
	}

	log(`Serving static files from ${distPublicPath}`);
	app.use(express.static(distPublicPath));

	// Fall through to index.html if the file doesn't exist
	// app.use('*', (_req, res) => {
	// 	res.sendFile(path.resolve(distPublicPath, 'index.html'));
	// });
}
