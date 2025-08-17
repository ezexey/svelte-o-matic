import type { Api } from "./index";

interface ApiTypeRegistry {
  "/movies": {
    GET: { request: Api.GetMoviesRequest; response: Api.GetMoviesResponses };
    POST: { request: Api.CreateMovieRequest; response: Api.CreateMovieResponses };
    PUT: { request: Api.UpdateMoviesRequest; response: Api.UpdateMoviesResponses };
  };
  "/movies/:id": {
    GET: { request: Api.GetMovieByIdRequest; response: Api.GetMovieByIdResponses };
    PUT: { request: Api.UpdateMovieRequest; response: Api.UpdateMovieResponses };
    DELETE: { request: Api.DeleteMoviesRequest; response: Api.DeleteMoviesResponses };
  };
  "/example": {
    GET: { request: Api.GetExampleRequest; response: Api.GetExampleResponses };
  };
}

// Define HTTP methods as a type to avoid repetition
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Simplified type extractors
type GetApi<E extends keyof ApiTypeRegistry, M extends HttpMethod> = M extends keyof ApiTypeRegistry[E]
  ? ApiTypeRegistry[E][M]
  : never;

type GetRequest<E extends keyof ApiTypeRegistry, M extends HttpMethod> = GetApi<E, M> extends {
  request: infer R;
}
  ? R
  : never;

type GetResponse<E extends keyof ApiTypeRegistry, M extends HttpMethod> = GetApi<E, M> extends {
  response: infer R;
}
  ? R
  : never;

export interface Opts<T> {
  endpoint: string;
  request?: T;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  fetcher?: typeof fetch;
}

export class Client {
  private static instance?: Client;
  private url = '';
  private init: RequestInit = {};
  private headers: Record<string, string> = { "Content-type": "application/json; charset=utf-8" };
  private constructor() {}

  static get I(): Client {
    return (Client.instance ??= new Client());
  }

  setUrl(url: string) {
    this.url = url;
  }

  setInit(init: RequestInit) {
    this.init = init;
  }

  setAuthBearer(token: string) {
    this.headers["Authorization"] = `Bearer ${token}`;
  }

  setHeaders(headers: Record<string, string>, override = false) {
    this.headers = override ? headers : { ...this.headers, ...headers };
  }


  async request<T>(input: RequestInfo | URL, fetcher: typeof fetch, init?: RequestInit): Promise<T> {
    const response = await fetcher(input, init);
    if (!response.ok) throw new Error(`HTTP error! status: ${JSON.stringify(response)}`);
    return await response.json();
  }

  // Generic method builder to reduce repetition
  private call<M extends HttpMethod>(method: M) {
    return <E extends keyof ApiTypeRegistry>(
      opts: M extends keyof ApiTypeRegistry[E]
        ? Omit<Opts<GetRequest<E, M>>, "method"> & { endpoint: E }
        : never
    ): Promise<GetResponse<E, M>> => {
      const query = new URLSearchParams();
      Object.entries(opts.request || {}).forEach(([key, value]) => {
        if (!value) return;
        if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
        else query.append(key, value.toString());
      });

      return this.request<GetResponse<E, M>>(
        new URL(`${opts.endpoint}/?${query}`, this.url),
        opts.fetcher || fetch,
        {
          method: method,
          headers: { ...this.headers, ...opts.headers },
          body: opts.body ? JSON.stringify(opts.body) : undefined,
          signal: opts.timeout ? AbortSignal.timeout(opts.timeout) : undefined,
          ...this.init
        }
      );
    };
  }

  // HTTP method implementations using the builder
  get = this.call("GET");
  post = this.call("POST");
  put = this.call("PUT");
  delete = this.call("DELETE");
}