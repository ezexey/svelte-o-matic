// +page.ts
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
  try {
    // Don't use no-cors mode!
    const response = await fetch('http://127.0.0.1:3042/movies/', {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status}`);
    }
    
    const movies = await response.json();
    console.log('Movies loaded:', movies); // Debug log
    return { movies };
  } catch (error) {
    console.error('Load error:', error);
    throw error;
  }
}

export const prerender = false;
export const csr = true;
export const ssr = true;