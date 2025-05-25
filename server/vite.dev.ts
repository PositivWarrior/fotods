import type { Express } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer, createLogger } from 'vite';
import type { Server } from 'http';
import viteConfig from '../vite.config'; // Path relative to server/ directory
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viteLogger = createLogger();

export async function setupVite(app: Express, server: Server) {
	const serverOptions = {
		middlewareMode: true,
		hmr: { server },
		// allowedHosts: true as true, // This might not be needed or correct for vite.config.js
	};

	const vite = await createViteServer({
		...viteConfig, // Spread your existing vite.config.ts content
		configFile: false, // We are passing the config directly
		customLogger: {
			...viteLogger,
			error: (msg, options) => {
				viteLogger.error(msg, options);
				// process.exit(1); // Exiting on error might be too aggressive for dev
			},
		},
		server: serverOptions,
		appType: 'custom',
	});

	app.use(vite.middlewares);
	app.use('*', async (req, res, next) => {
		const url = req.originalUrl;

		try {
			// Path relative to the project root for client/index.html
			// Assuming this vite.dev.ts is in server/, client/ is ../client/
			const clientTemplate = path.resolve(
				__dirname,
				'..',
				'client',
				'index.html',
			);

			let template = await fs.promises.readFile(clientTemplate, 'utf-8');
			// Invalidate cache for main.tsx - useful for HMR
			template = template.replace(
				`src="/src/main.tsx"`,
				`src="/src/main.tsx?v=${nanoid()}"`,
			);
			const page = await vite.transformIndexHtml(url, template);
			res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
		} catch (e) {
			vite.ssrFixStacktrace(e as Error);
			next(e);
		}
	});
}
