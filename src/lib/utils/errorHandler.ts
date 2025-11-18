type ErrorLevel = "debug" | "info" | "warn" | "error";
type ErrorContext = Record<string, any>;

interface ErrorLog {
  timestamp: string;
  level: ErrorLevel;
  message: string;
  error?: Error | null;
  context?: ErrorContext;
  stack?: string;
}

const isDevelopment = process.env.NODE_ENV === "development";

const errorLogs: ErrorLog[] = [];
const MAX_LOGS = 100;

export const logError = (
  message: string,
  error?: Error | unknown,
  context?: ErrorContext,
  level: ErrorLevel = "error"
) => {
  const errorObj = error instanceof Error ? error : null;
  const stack = errorObj?.stack;

  const log: ErrorLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    error: errorObj,
    context,
    stack,
  };

  // Store in memory for debugging
  errorLogs.push(log);
  if (errorLogs.length > MAX_LOGS) {
    errorLogs.shift();
  }

  // Log to console based on level
  const consoleMethod = level === "error" ? console.error : console[level];
  if (isDevelopment) {
    consoleMethod(`[${level.toUpperCase()}] ${message}`, {
      error: errorObj?.message || error,
      context,
      stack,
    });
  } else {
    consoleMethod(`[${level.toUpperCase()}] ${message}`);
  }
};

export const getUserFriendlyError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes("fetch") || message.includes("network")) {
      return "Network connection failed. Please check your internet connection.";
    }

    // Authentication errors
    if (
      message.includes("unauthorized") ||
      message.includes("authentication") ||
      message.includes("credentials")
    ) {
      return "Authentication failed. Please sign in again.";
    }

    // Timeout errors
    if (
      message.includes("timeout") ||
      message.includes("timed out") ||
      message.includes("deadline")
    ) {
      return "Request took too long. Please try again.";
    }

    // Not found errors
    if (message.includes("not found") || message.includes("404")) {
      return "The requested item was not found.";
    }

    // Server errors
    if (message.includes("500") || message.includes("server")) {
      return "Server error. Please try again later.";
    }

    // Permission errors
    if (message.includes("permission") || message.includes("forbidden")) {
      return "You don't have permission to perform this action.";
    }

    // Rate limiting
    if (message.includes("rate") || message.includes("too many")) {
      return "Too many requests. Please wait a moment and try again.";
    }

    // Return original message if it's short and meaningful
    if (error.message.length < 100 && error.message.length > 5) {
      return error.message;
    }
  }

  return "Something went wrong. Please try again.";
};

export const getErrorLogs = (): ErrorLog[] => {
  return [...errorLogs];
};

export const clearErrorLogs = () => {
  errorLogs.length = 0;
};

export const handleApiError = (
  error: unknown,
  context?: ErrorContext
): string => {
  const message = getUserFriendlyError(error);
  logError(message, error, context, "error");
  return message;
};

export const handleAsyncError = async <T>(
  fn: () => Promise<T>,
  context?: ErrorContext,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    const message = getUserFriendlyError(error);
    logError(message, error, context, "error");
    return fallback;
  }
};

export const createErrorBoundaryErrorMessage = (error: Error): string => {
  const isDev = isDevelopment;
  return isDev ? error.message : "An unexpected error occurred";
};
