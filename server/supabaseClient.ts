import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv'; // dotenv should be initialized in the main server entry point

// dotenv.config(); // Load environment variables from .env file - should be done at app entry point

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
	throw new Error(
		'Supabase URL not found. Make sure SUPABASE_URL is set in your .env file and loaded at server startup.',
	);
}

if (!supabaseServiceRoleKey) {
	throw new Error(
		'Supabase service role key not found. Make sure SUPABASE_SERVICE_ROLE_KEY is set in your .env file and loaded at server startup.',
	);
}

// Create a single Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: {
		// It's common to store and manage auth sessions client-side with Supabase.
		// For server-to-server interactions using the service_role key, session management is often not needed in this way.
		// If you were using this for user-specific RLS from the server (less common with service_role), you might handle sessions differently.
		autoRefreshToken: false,
		persistSession: false,
		detectSessionInUrl: false,
	},
});
