# Funk Library

## core/Client.ts

``` ts
import { Client } from "./client";
import type { Api } from "../index";

// ============================================
// SETUP
// ============================================

// Get singleton instance
const client = Client.I;

// Configure base URL
client.setBaseUrl("https://api.example.com");

// Set authentication token
client.setAuthBearer("your-auth-token-here");

// ============================================
// GET EXAMPLES
// ============================================

// GET /movies - Get all movies
async function getAllMovies() {
  const response = await client.get({
    endpoint: "/movies",
    request: {
      // Add query parameters if needed (based on Api.GetMoviesRequest type)
      page: 1,
      limit: 20,
      genre: "action"
    }
  });
  
  console.log("Movies:", response);
  return response;
}

// GET /movies/:id - Get specific movie
async function getMovieById(id: string) {
  const response = await client.get({
    endpoint: "/movies/:id",
    request: {
      id: id,
      // Add other params if Api.GetMovieByIdRequest requires them
    }
  });
  
  console.log("Movie details:", response);
  return response;
}

// GET /example - Simple get request
async function getExample() {
  const response = await client.get({
    endpoint: "/example",
    request: {
      // Parameters based on Api.GetExampleRequest
    }
  });
  
  console.log("Example response:", response);
  return response;
}

// ============================================
// POST EXAMPLES
// ============================================

// POST /movies - Create a new movie
async function createMovie(movieData: any) {
  const response = await client.post({
    endpoint: "/movies",
    request: {
      // Query parameters if needed
    },
    options: {
      body: {
        title: "Inception",
        director: "Christopher Nolan",
        year: 2010,
        genre: "Sci-Fi",
        ...movieData
      },
      headers: {
        "X-Custom-Header": "custom-value"
      },
      timeout: 5000 // 5 second timeout
    }
  });
  
  console.log("Created movie:", response);
  return response;
}

// ============================================
// PUT EXAMPLES
// ============================================

// PUT /movies - Update multiple movies
async function updateMultipleMovies(updates: any[]) {
  const response = await client.put({
    endpoint: "/movies",
    request: {
      // Query parameters for batch update
      ids: ["movie1", "movie2", "movie3"]
    },
    options: {
      body: {
        updates: updates
      }
    }
  });
  
  console.log("Updated movies:", response);
  return response;
}

// PUT /movies/:id - Update specific movie
async function updateMovie(id: string, movieData: any) {
  const response = await client.put({
    endpoint: "/movies/:id",
    request: {
      id: id
    },
    options: {
      body: {
        title: movieData.title,
        director: movieData.director,
        year: movieData.year,
        // ... other movie fields
      },
      timeout: 3000
    }
  });
  
  console.log("Updated movie:", response);
  return response;
}

// ============================================
// DELETE EXAMPLES
// ============================================

// DELETE /movies/:id - Delete a movie
async function deleteMovie(id: string) {
  const response = await client.delete({
    endpoint: "/movies/:id",
    request: {
      id: id,
      // Add soft delete flag if needed
      soft: true
    },
    options: {
      headers: {
        "X-Confirm-Delete": "true"
      }
    }
  });
  
  console.log("Deleted movie:", response);
  return response;
}

// ============================================
// ADVANCED EXAMPLES
// ============================================

// Using custom fetcher (e.g., for testing)
async function getMoviesWithCustomFetcher() {
  const customFetch: typeof fetch = async (input, init) => {
    console.log("Custom fetch interceptor:", input, init);
    return fetch(input, init);
  };

  const response = await client.get({
    endpoint: "/movies",
    request: {
      page: 1
    },
    fetcher: customFetch
  });
  
  return response;
}

// Error handling example
async function safeGetMovie(id: string) {
  try {
    const movie = await client.get({
      endpoint: "/movies/:id",
      request: { id }
    });
    return { success: true, data: movie };
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    return { success: false, error: error.message };
  }
}

// Batch operations example
async function batchMovieOperations() {
  // Create multiple movies
  const createPromises = [
    { title: "Movie 1", year: 2023 },
    { title: "Movie 2", year: 2024 },
    { title: "Movie 3", year: 2025 }
  ].map(movie => 
    client.post({
      endpoint: "/movies",
      options: { body: movie }
    })
  );

  const createdMovies = await Promise.all(createPromises);
  console.log("Created movies:", createdMovies);

  // Update all created movies
  const updatePromises = createdMovies.map((movie, index) =>
    client.put({
      endpoint: "/movies/:id",
      request: { id: movie.id },
      options: {
        body: { watched: true }
      }
    })
  );

  const updatedMovies = await Promise.all(updatePromises);
  console.log("Updated movies:", updatedMovies);
}

// ============================================
// USAGE
// ============================================

async function main() {
  // Get all movies
  await getAllMovies();

  // Get specific movie
  await getMovieById("movie-123");

  // Create a new movie
  await createMovie({
    title: "The Matrix",
    director: "Wachowski Sisters",
    year: 1999
  });

  // Update a movie
  await updateMovie("movie-123", {
    title: "The Matrix Reloaded",
    year: 2003
  });

  // Delete a movie
  await deleteMovie("movie-456");

  // Batch operations
  await batchMovieOperations();
}

// Run examples
main().catch(console.error);
```