type FetcherOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
};

export class ApiError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetcher<T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, requireAuth = true } = options;

  // Get the base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const fullUrl = `${baseUrl}${url}`;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add authorization header if required
  if (requireAuth) {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      throw new ApiError("Unauthorized: No token found", 401);
    }
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Parse the response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || "An error occurred",
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      // If it's already an ApiError, rethrow it
      throw error;
    }

    // If it's a network error or other type of error
    throw new ApiError(
      error instanceof Error ? error.message : "An error occurred",
      500
    );
  }
}
