import { Extension } from "./Extension";

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class Client {
  private static instance: Client | null = null;
  private baseURL: string = "";
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  static get I(): Client {
    if (!Client.instance) {
      Client.instance = new Client();
    }
    return Client.instance;
  }
  setBaseURL(url: string): void {
    this.baseURL = url.endsWith("/") ? url.slice(0, -1) : url;
  }
  setAuthToken(token: string): void {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  async request<T>(endpoint: string, fetcher = fetch, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeout = config.timeout || 30000;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetcher(url, {
        method: config.method || "GET",
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  get<T>(endpoint: string, fetcher = fetch, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, fetcher, { ...config, method: "GET" });
  }

  post<T>(endpoint: string, fetcher = fetch, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, fetcher, { ...config, method: "POST", body });
  }

  put<T>(endpoint: string, fetcher = fetch, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, fetcher, { ...config, method: "PUT", body });
  }

  delete<T>(endpoint: string, fetcher = fetch, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, fetcher, { ...config, method: "DELETE" });
  }
}
