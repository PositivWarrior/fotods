import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
// import dotenv from 'dotenv'; // dotenv should be initialized in the main server entry point
import * as schema from '../shared/schema'; // Adjust path if your schema is elsewhere

// dotenv.config(); // Assuming .env is loaded at application startup

// Debug: Check what environment variables are available when db.ts is loaded
console.log('[DEBUG db.ts] Environment variables when db.ts is loaded:');
console.log(
	'[DEBUG db.ts] DATABASE_URL:',
	process.env.DATABASE_URL ? 'SET' : 'NOT SET',
);
console.log(
	'[DEBUG db.ts] SUPABASE_URL:',
	process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(
		'DATABASE_URL not found. Make sure it is set in your .env file and loaded at server startup.',
	);
}

const pool = new Pool({
	connectionString: databaseUrl,
	// ssl: { rejectUnauthorized: false }, // Add this if you encounter SSL issues with Supabase, but usually not needed with their direct connection string.
});

// Export the Drizzle instance with the schema
export const db = drizzle(pool, { schema });
