import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load .env file from the server directory, assuming drizzle.config.ts is in the project root
dotenv.config({ path: './server/.env' });

if (!process.env.DATABASE_URL) {
	console.warn(
		"DATABASE_URL environment variable is not set. Drizzle Kit might not be able to connect to the database unless it's passed directly via CLI arguments or the .env file is correctly loaded.",
	);
}

export default {
	schema: './shared/schema.ts',
	out: './server/drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
} satisfies Config;
