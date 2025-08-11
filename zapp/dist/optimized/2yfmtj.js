import "../chunks/event-state.js";
import "@sveltejs/kit";
import { q } from "../chunks/query.js";
import "../chunks/false.js";
import "../chunks/paths.js";
let baseUrl = "";
let defaultHeaders = {};
let defaultFetchParams = {};
function sanitizeUrl(url) {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  } else {
    return url;
  }
}
const setBaseUrl = (newUrl) => {
  baseUrl = sanitizeUrl(newUrl);
};
const setDefaultHeaders = (headers) => {
  defaultHeaders = headers;
};
const setDefaultFetchParams = (fetchParams) => {
  defaultFetchParams = fetchParams;
};
const _getMovies = async (url, request) => {
  const queryParameters = ["limit", "offset", "totalCount", "cursor", "startAfter", "endBefore", "fields", "where.id.eq", "where.id.neq", "where.id.gt", "where.id.gte", "where.id.lt", "where.id.lte", "where.id.like", "where.id.ilike", "where.id.in", "where.id.nin", "where.id.contains", "where.id.contained", "where.id.overlaps", "where.title.eq", "where.title.neq", "where.title.gt", "where.title.gte", "where.title.lt", "where.title.lte", "where.title.like", "where.title.ilike", "where.title.in", "where.title.nin", "where.title.contains", "where.title.contained", "where.title.overlaps", "where.or", "orderby.id", "orderby.title"];
  const searchParams = new URLSearchParams();
  if (request) {
    queryParameters.forEach((qp) => {
      const queryValue = request?.[qp];
      if (queryValue) {
        if (Array.isArray(queryValue)) {
          queryValue.forEach((p) => searchParams.append(qp, p));
        } else {
          searchParams.append(qp, queryValue.toString());
        }
      }
      delete request?.[qp];
    });
  }
  const headers = {
    ...defaultHeaders
  };
  const response = await fetch(`${url}/movies/?${searchParams.toString()}`, {
    headers,
    ...defaultFetchParams
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
};
const getMovies = async (request) => {
  return await _getMovies(baseUrl, request);
};
setBaseUrl("http://127.0.0.1:3042");
setDefaultHeaders({ Accept: "*/*" });
setDefaultFetchParams({ mode: "no-cors" });
const daMovies = q(async () => {
  const movies = await getMovies({ limit: 100, offset: 0 });
  console.log(movies);
  return movies;
});
for (const [name, fn] of Object.entries({ daMovies })) {
  fn.__.id = "2yfmtj/" + name;
  fn.__.name = name;
}
export {
  daMovies
};
