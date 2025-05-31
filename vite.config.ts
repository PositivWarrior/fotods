import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		react(),
		runtimeErrorOverlay(),
		...(process.env.NODE_ENV !== 'production' &&
		process.env.REPL_ID !== undefined
			? [
					await import('@replit/vite-plugin-cartographer').then((m) =>
						m.cartographer(),
					),
			  ]
			: []),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'client', 'src'),
			'@shared': path.resolve(__dirname, 'shared'),
			'@assets': path.resolve(__dirname, 'attached_assets'),
		},
	},
	root: path.resolve(__dirname, 'client'),
	build: {
		outDir: path.resolve(__dirname, 'dist/public'),
		emptyOutDir: true,
		sourcemap: true,
	},
	server: {
		port: 5173, // Ensure Vite runs on a different port
		proxy: {
			'/api': {
				target: 'http://localhost:3001', // Your backend server - corrected port
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
