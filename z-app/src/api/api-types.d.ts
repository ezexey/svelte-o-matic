export interface FullResponse<T, U extends number> {
  'statusCode': U;
  'headers': object;
  'body': T;
}

export type GetMoviesRequest = {
  /**
   * Limit will be applied by default if not passed. If the provided value exceeds the maximum allowed value a validation error will be thrown
   */
  'limit'?: number;
  'offset'?: number;
  'totalCount'?: boolean;
  /**
   * Include cursor headers in response. Cursor keys built from orderBy clause
   */
  'cursor'?: boolean;
  /**
   * Cursor for forward pagination. List objects after this cursor position
   */
  'startAfter'?: string;
  /**
   * Cursor for backward pagination. List objects before this cursor position
   */
  'endBefore'?: string;
  'fields'?: Array<'id' | 'title'>;
  'where.id.eq'?: number;
  'where.id.neq'?: number;
  'where.id.gt'?: number;
  'where.id.gte'?: number;
  'where.id.lt'?: number;
  'where.id.lte'?: number;
  'where.id.like'?: number;
  'where.id.ilike'?: number;
  'where.id.in'?: string;
  'where.id.nin'?: string;
  'where.id.contains'?: string;
  'where.id.contained'?: string;
  'where.id.overlaps'?: string;
  'where.title.eq'?: string;
  'where.title.neq'?: string;
  'where.title.gt'?: string;
  'where.title.gte'?: string;
  'where.title.lt'?: string;
  'where.title.lte'?: string;
  'where.title.like'?: string;
  'where.title.ilike'?: string;
  'where.title.in'?: string;
  'where.title.nin'?: string;
  'where.title.contains'?: string;
  'where.title.contained'?: string;
  'where.title.overlaps'?: string;
  'where.or'?: Array<string>;
  'orderby.id'?: 'asc' | 'desc';
  'orderby.title'?: 'asc' | 'desc';
}

/**
 * Default Response
 */
export type GetMoviesResponseOK = Array<{ 'id'?: number | null; 'title'?: string | null }>
export type GetMoviesResponses =
  GetMoviesResponseOK

export type CreateMovieRequest = {
  'id'?: number;
  'title': string;
}

/**
 * A Movie
 */
export type CreateMovieResponseOK = { 'id'?: number | null; 'title'?: string | null }
export type CreateMovieResponses =
  CreateMovieResponseOK

export type UpdateMoviesRequest = {
  'fields'?: Array<'id' | 'title'>;
  'where.id.eq'?: number;
  'where.id.neq'?: number;
  'where.id.gt'?: number;
  'where.id.gte'?: number;
  'where.id.lt'?: number;
  'where.id.lte'?: number;
  'where.id.like'?: number;
  'where.id.ilike'?: number;
  'where.id.in'?: string;
  'where.id.nin'?: string;
  'where.id.contains'?: string;
  'where.id.contained'?: string;
  'where.id.overlaps'?: string;
  'where.title.eq'?: string;
  'where.title.neq'?: string;
  'where.title.gt'?: string;
  'where.title.gte'?: string;
  'where.title.lt'?: string;
  'where.title.lte'?: string;
  'where.title.like'?: string;
  'where.title.ilike'?: string;
  'where.title.in'?: string;
  'where.title.nin'?: string;
  'where.title.contains'?: string;
  'where.title.contained'?: string;
  'where.title.overlaps'?: string;
  'where.or'?: Array<string>;
  'id'?: number;
  'title': string;
}

/**
 * Default Response
 */
export type UpdateMoviesResponseOK = Array<{ 'id'?: number | null; 'title'?: string | null }>
export type UpdateMoviesResponses =
  UpdateMoviesResponseOK

export type GetMovieByIdRequest = {
  'fields'?: Array<'id' | 'title'>;
  'id': number;
}

/**
 * A Movie
 */
export type GetMovieByIdResponseOK = { 'id'?: number | null; 'title'?: string | null }
export type GetMovieByIdResponses =
  GetMovieByIdResponseOK

export type UpdateMovieRequest = {
  'fields'?: Array<'id' | 'title'>;
  'id': number;
  'title': string;
}

/**
 * A Movie
 */
export type UpdateMovieResponseOK = { 'id'?: number | null; 'title'?: string | null }
export type UpdateMovieResponses =
  UpdateMovieResponseOK

export type DeleteMoviesRequest = {
  'fields'?: Array<'id' | 'title'>;
  'id': number;
}

/**
 * A Movie
 */
export type DeleteMoviesResponseOK = { 'id'?: number | null; 'title'?: string | null }
export type DeleteMoviesResponses =
  DeleteMoviesResponseOK

export type GetExampleRequest = {
  
}

export type GetExampleResponseOK = unknown
export type GetExampleResponses =
  FullResponse<GetExampleResponseOK, 200>



export interface Api {
  setBaseUrl(newUrl: string): void;
  setDefaultHeaders(headers: object): void;
  setDefaultFetchParams(fetchParams: RequestInit): void;
  /**
   * Get movies.
   *
   * Fetch movies from the database.
   * @param req - request parameters object
   * @returns the API response body
   */
  getMovies(req: GetMoviesRequest): Promise<GetMoviesResponses>;
  /**
   * Create movie.
   *
   * Add new movie to the database.
   * @param req - request parameters object
   * @returns the API response body
   */
  createMovie(req: CreateMovieRequest): Promise<CreateMovieResponses>;
  /**
   * Update movies.
   *
   * Update one or more movies in the database.
   * @param req - request parameters object
   * @returns the API response body
   */
  updateMovies(req: UpdateMoviesRequest): Promise<UpdateMoviesResponses>;
  /**
   * Get Movie by id.
   *
   * Fetch Movie using its id from the database.
   * @param req - request parameters object
   * @returns the API response body
   */
  getMovieById(req: GetMovieByIdRequest): Promise<GetMovieByIdResponses>;
  /**
   * Update movie.
   *
   * Update movie in the database.
   * @param req - request parameters object
   * @returns the API response body
   */
  updateMovie(req: UpdateMovieRequest): Promise<UpdateMovieResponses>;
  /**
   * Delete movies.
   *
   * Delete one or more movies from the Database.
   * @param req - request parameters object
   * @returns the API response body
   */
  deleteMovies(req: DeleteMoviesRequest): Promise<DeleteMoviesResponses>;
  /**
   * @param req - request parameters object
   * @returns the API response body
   */
  getExample(req: GetExampleRequest): Promise<GetExampleResponses>;
}
type PlatformaticFrontendClient = Omit<Api, 'setBaseUrl'>
type BuildOptions = {
  headers?: object
}
export default function build(url: string, options?: BuildOptions): PlatformaticFrontendClient
