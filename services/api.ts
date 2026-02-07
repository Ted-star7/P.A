
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pergola-monolothic.onrender.com/api";

// Helper to get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// Create headers
const createHeaders = (
  token: string | null,
  isFormData: boolean = false,
): HeadersInit => {
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// Helper to parse error response
const parseErrorResponse = async (response: Response): Promise<string> => {
  // Clone the response to read it without consuming the body
  const responseClone = response.clone();

  try {
    const errorData = await responseClone.json();
    return (
      errorData.message ||
      errorData.error ||
      `HTTP ${response.status}: ${response.statusText}`
    );
  } catch {
    try {
      const errorText = await response.text();
      return errorText || `HTTP ${response.status}: ${response.statusText}`;
    } catch {
      return `HTTP ${response.status}: ${response.statusText}`;
    }
  }
};

// POST request with JSON data
export const postRequest = async <T = any>(
  endpoint: string,
  data: any,
  token: string | null = getToken(),
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(token);

  console.log("Making POST request to:", url);
  console.log("With data:", data);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    console.error("POST request failed:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const result = await response.json();
    console.log("POST request succeeded:", result);
    return result;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Invalid JSON response from server");
  }
};

// GET request
export const getRequest = async <T = any>(
  endpoint: string,
  token: string | null = getToken(),
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(token);

  console.log("Making GET request to:", url);

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    console.error("GET request failed:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const result = await response.json();
    console.log("GET request succeeded:", result);
    return result;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Invalid JSON response from server");
  }
};

// DELETE request
export const deleteRequest = async <T = any>(
  endpoint: string,
  token: string | null = getToken(),
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(token);

  console.log("Making DELETE request to:", url);

  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    console.error("DELETE request failed:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const result = await response.json();
    console.log("DELETE request succeeded:", result);
    return result;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Invalid JSON response from server");
  }
};

// POST FormData (for file uploads)
export const postFormData = async <T = any>(
  endpoint: string,
  formData: FormData,
  token: string | null = getToken(),
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(token, true);

  console.log("Making POST FormData request to:", url);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    console.error("POST FormData request failed:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const result = await response.json();
    console.log("POST FormData request succeeded:", result);
    return result;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Invalid JSON response from server");
  }
};

// PUT request
export const putRequest = async <T = any>(
  endpoint: string,
  data: any,
  token: string | null = getToken(),
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(token);

  console.log("Making PUT request to:", url);
  console.log("With data:", data);

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    console.error("PUT request failed:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const result = await response.json();
    console.log("PUT request succeeded:", result);
    return result;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("Invalid JSON response from server");
  }
};

// Export as an object for convenience
export const api = {
  post: postRequest,
  get: getRequest,
  delete: deleteRequest,
  postFormData,
  put: putRequest,
  getToken,
  baseUrl: API_BASE_URL,
};

// Default export
export default api;
