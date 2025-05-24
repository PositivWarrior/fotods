import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// import dotenv from 'dotenv'; // dotenv should be initialized in the main server entry point

// Load environment variables at the application's entry point or ensure they are globally available.
// If not already loaded globally, you might need: dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// However, it's better if .env is loaded once at the start of your application.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
	throw new Error(
		'Supabase URL not found. Make sure SUPABASE_URL is set in your .env file and loaded at server startup.',
	);
}

if (!supabaseServiceKey) {
	throw new Error(
		'Supabase service key not found. Make sure SUPABASE_SERVICE_ROLE_KEY is set in your .env file and loaded at server startup.',
	);
}

// Create a single Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		// It's recommended to persist sessions for server-side client usage if needed,
		// but for simple storage operations, it might not be strictly necessary.
		// autoRefreshToken: true, // Default
		// persistSession: true, // Default
		// detectSessionInUrl: false, // Usually for client-side auth flows
	},
});

// Helper function to extract file path from Supabase URL for deletion
export function getPathFromSupabaseUrl(url: string): string | null {
	try {
		const urlObject = new URL(url);
		// Example URL: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket-name>/<file-path>
		// The path starts after '/object/public/<bucket-name>/' or '/object/authenticated/<bucket-name>/'
		// Adjust the splitting logic if your URL structure is different or if it might contain '/public/' or '/authenticated/' in the file path itself.

		const pathSegments = urlObject.pathname.split('/');
		// Assuming path is like /storage/v1/object/public/bucket_name/path/to/file.jpg
		// Find the index of 'public' or 'authenticated', then the bucket name, then the rest is the path.
		const objectMarkerIndex = pathSegments.findIndex(
			(segment) => segment === 'object',
		);
		if (
			objectMarkerIndex === -1 ||
			objectMarkerIndex + 3 >= pathSegments.length
		) {
			console.error(
				'Could not determine file path from Supabase URL:',
				url,
			);
			return null;
		}
		// Skips /storage/v1/object/public (or authenticated)/<bucket-name>/
		const filePath = pathSegments.slice(objectMarkerIndex + 3).join('/');
		return filePath;
	} catch (error) {
		console.error('Error parsing Supabase URL:', url, error);
		return null;
	}
}
