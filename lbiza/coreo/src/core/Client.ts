export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export interface Options {
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}
export interface Opts<T> {
  endpoint: string;
  request?: T;
  method?: Methods;
  options?: Options;
  fetcher?: typeof fetch;
}

export class Client {
  private static instance?: Client;
  private baseUrl?: string;
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.defaultHeaders = { "Content-type": "application/json; charset=utf-8" };
  }
  static get I(): Client {
    return (Client.instance ??= new Client());
  }

  setBaseUrl(input: string) {
    this.baseUrl = input;
  }

  setAuthBearer(token: string): void {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  async request<T>(input: RequestInfo | URL, fetcher: typeof fetch, init?: RequestInit): Promise<T> {
    const response = await fetcher(input, init);
    if (!response.ok) throw new Error(`HTTP error! status: ${JSON.stringify(response)}`);
    return await response.json();
  }

  private call<T, TT>(opts: Opts<TT>): Promise<T> {
    const query = new URLSearchParams();
    Object.entries(opts.request || {}).forEach(([key, value]) => {
      if (!value) return;
      if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
      else query.append(key, value.toString());
    });

    return this.request<T>(new URL(`${opts.endpoint}?${query}`, this.baseUrl), opts.fetcher || fetch, {
      method: opts.method,
      headers: {
        ...this.defaultHeaders,
        ...opts.options?.headers,
      },
      body: opts.options?.body ? JSON.stringify(opts.options.body) : undefined,
      signal: opts.options?.timeout ? AbortSignal.timeout(opts.options.timeout) : undefined,
    });
  }

  // Convenience methods for common HTTP methods
  get<T, TT>(opts: Opts<TT>) {
    return this.call<T, TT>({ method: "GET", ...opts });
  }

  post<T, TT>(opts: Opts<TT>) {
    return this.call<T, TT>({ method: "POST", ...opts });
  }

  put<T, TT>(opts: Opts<TT>) {
    return this.call<T, TT>({ method: "PUT", ...opts });
  }

  delete<T, TT>(opts: Opts<TT>) {
    return this.call<T, TT>({ method: "DELETE", ...opts });
  }
}
