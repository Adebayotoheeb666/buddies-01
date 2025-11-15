import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials");
}

// Custom fetch wrapper to handle "body stream already read" errors
// This occurs when proxies or middleware consume the response body before the client
const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  let lastError: Error | null = null;

  // Try up to 3 times for body stream errors
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(input, init);

      // Clone the response to allow multiple reads
      const clonedResponse = response.clone();

      // Try to read the body to ensure it's valid
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        // Pre-validate JSON responses
        try {
          await response.clone().json();
        } catch (e) {
          // If we can't parse JSON, it might be a stream issue
          const error = e as Error;
          if (error.message?.includes("body stream already read")) {
            lastError = error;
            // Wait and retry
            if (attempt < 2) {
              await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
              continue;
            }
          }
          throw e;
        }
      }

      return clonedResponse;
    } catch (error) {
      lastError = error as Error;
      const errorMessage = (error as any).message || String(error);

      // Only retry on body stream errors
      if (errorMessage.includes("body stream already read") && attempt < 2) {
        // Wait with exponential backoff before retrying
        await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
        continue;
      }

      throw error;
    }
  }

  // If all retries failed with body stream error, throw the last error
  if (lastError) {
    throw lastError;
  }

  // Fallback - should not reach here
  return fetch(input, init);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
  },
});
