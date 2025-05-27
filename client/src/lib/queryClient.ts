import { QueryClient, QueryFunction } from '@tanstack/react-query';

// Get the API base URL from environment or use proxy in dev mode
const API_BASE_URL =
	import.meta.env.VITE_API_URL ||
	(import.meta.env.DEV ? '' : 'https://fotods-production.up.railway.app');

async function throwIfResNotOk(res: Response) {
	if (!res.ok) {
		const text = (await res.text()) || res.statusText;
		throw new Error(`${res.status}: ${text}`);
	}
}

export async function apiRequest(
	method: string,
	url: string,
	data?: unknown | FormData | undefined,
): Promise<Response> {
	const fullUrl = `${API_BASE_URL}${url}`;

	let headers: HeadersInit = {};
	let body: BodyInit | undefined = undefined;

	if (data instanceof FormData) {
		// For FormData, do not set Content-Type; browser will do it with boundary.
		headers = {}; // Reset to empty or only include other necessary headers like Authorization
		body = data;
	} else if (data) {
		headers = { 'Content-Type': 'application/json' };
		body = JSON.stringify(data);
	}

	const res = await fetch(fullUrl, {
		method,
		headers, // Use the dynamically set headers
		body, // Use the dynamically set body
		credentials: 'include',
	});

	await throwIfResNotOk(res);
	return res;
}

type UnauthorizedBehavior = 'throw' | 'returnNull';

export const getQueryFn: <T>(options: {
	on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
	({ on401: unauthorizedBehavior }) =>
	async ({ queryKey }) => {
		const fullUrl = `${API_BASE_URL}${queryKey[0] as string}`;
		const res = await fetch(fullUrl, {
			credentials: 'include',
		});

		if (unauthorizedBehavior === 'returnNull' && res.status === 401) {
			return null;
		}

		await throwIfResNotOk(res);
		return await res.json();
	};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: getQueryFn({ on401: 'throw' }),
			refetchInterval: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
			retry: false,
		},
		mutations: {
			retry: false,
		},
	},
});
