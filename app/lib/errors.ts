export class CloudflareAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Array<{ code: number; message: string }>
  ) {
    super(message);
    this.name = 'CloudflareAPIError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof CloudflareAPIError) {
    // Authentication errors
    if (error.status === 401) {
      return "Invalid API token. Please check your credentials and try again.\n\nMake sure you have created an API token with the following permissions:\n- Zone Analytics:Read\n- Zone:Read\n- DNS:Read";
    }
    if (error.status === 403) {
      return "You don't have permission to access this resource.\n\nPlease ensure your API token has the following permissions:\n- Zone Analytics:Read\n- Zone:Read\n- DNS:Read";
    }
    if (error.status === 429) {
      return "Rate limit exceeded. Please wait a moment before trying again.";
    }

    // If we have specific Cloudflare error messages, use those
    if (error.errors?.length) {
      const errorMessages = error.errors.map(e => {
        let message = e.message;
        switch (e.code) {
          case 7000:
            message = "Invalid API endpoint. Please try again or contact support if the issue persists.";
            break;
          case 7003:
            message = "Invalid request method. Please try again or contact support if the issue persists.";
            break;
          case 9103:
            message = "Invalid zone identifier. Please select a different zone or refresh the page.";
            break;
          case 9109:
            message = "Invalid hostname. Please select a different hostname or refresh the page.";
            break;
          case 9207:
            message = "Invalid date range. Please try again with a different date range.";
            break;
        }
        return `Error ${e.code}: ${message}`;
      });
      return errorMessages.join("\n\n");
    }

    return error.message;
  }
  
  if (error instanceof Error) {
    if (error.message.includes("Failed to fetch")) {
      return "Unable to connect to Cloudflare API. Please check your internet connection and try again.";
    }
    if (error.message.includes("NetworkError")) {
      return "Network error occurred. Please check your internet connection and try again.";
    }
    if (error.message.includes("TypeError")) {
      return "Invalid response from Cloudflare API. Please try again later.";
    }
    if (error.message.includes("AbortError")) {
      return "Request timed out. Please check your connection and try again.";
    }
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again later.";
}