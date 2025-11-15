import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials");
}

// Custom fetch wrapper to handle "body stream already read" errors
// This occurs when proxies or middleware consume the response body before the client.
// The solution is to retry the entire request with exponential backoff.
const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create a fresh request each time (don't reuse body for POST/PUT)
      let requestBody = init?.body;

      // If body is a string or we're retrying, we need to clone it
      if (attempt > 0 && init?.body && typeof init.body === "string") {
        requestBody = init.body;
      }

      const response = await fetch(input, {
        ...init,
        body: requestBody,
      });

      return response;
    } catch (error) {
      lastError = error as Error;
      const errorMessage = (error as any).message || String(error);

      // Only retry on body stream errors and network errors
      const isRetryable =
        errorMessage.includes("body stream already read") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError");

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const delayMs = 100 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
  },
});
