import type { Api as Api } from "../index";

export interface ApiTypeRegistry {
  "/movies/": {
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

export interface Opts {
  headers?: Record<string, string>;
  timeout?: number;
  fetcher?: typeof fetch;
}

class Client {
  url = "";
  init: RequestInit = {};
  headers: Record<string, string> = {};
  constructor() {}

  setAuthBearer(token: string) {
    this.headers["Authorization"] = `Bearer ${token}`;
  }

  async request<T>(input: URL | RequestInfo, fetcher = fetch, init?: RequestInit): Promise<T> {
    const response = await fetcher(input, init);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} ${await response.text()}`);
    return await response.json();
  }

  // Generic method builder to reduce repetition
  private call<M extends HttpMethod>(method: M) {
    return <E extends keyof ApiTypeRegistry & string>(endpoint: E, req?: GetRequest<E, M>, opts?: Opts) => {
      // Process path parameters
      let request = req as Record<string, any>;

      endpoint
        .match(/:(\w+)/g)
        ?.map((match) => match.substring(1))
        .forEach((param) => {
          if (request[param] === undefined) return;
          // Replace :param with actual value
          endpoint = endpoint.replace(`:${param}`, encodeURIComponent(request[param])) as E;
          // Remove from remaining params so it's not added to query string
          delete request[param];
        });

      // Build query string from remaining parameters
      const query = new URLSearchParams();
      Object.entries(request).forEach(([key, value]) => {
        if (!value) return;
        if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
        else query.append(key, value.toString());
      });

      // Build final URL
      return this.request<GetResponse<E, M>>(
        new URL(`${endpoint}${method == "POST" ? "" : "?" + query}`, this.url),
        opts?.fetcher,
        {
          ...this.init,
          method,
          headers: { ...this.headers, ...(opts?.headers || {}) },
          body: method === "GET" ? undefined : JSON.stringify(req),
          signal: opts?.timeout ? AbortSignal.timeout(opts.timeout) : undefined,
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

export default function (
  url: string,
  headers: Record<string, string> = { "Content-type": "application/json; charset=utf-8" }
) {
  const client = new Client();
  client.url = url;
  client.headers = headers;
  return client;
}
