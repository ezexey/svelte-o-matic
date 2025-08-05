import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { a, b } = await request.json();
	return json(a + b);
};

// This handler will respond to PUT, PATCH, DELETE, etc.
export const fallback: RequestHandler = async ({ request }) => {
	return text(`I caught your ${request.method} request!`);
};