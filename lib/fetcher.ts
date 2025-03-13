import axios from "axios";

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

export async function fetcher<T>(
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
    const response = await axios({
      method,
      url: fullUrl,
      headers: requestHeaders,
      data: body,
    });

    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data?.message || "An error occurred",
        error.response?.status || 500,
        error.response?.data
      );
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An error occurred",
      500
    );
  }
}
