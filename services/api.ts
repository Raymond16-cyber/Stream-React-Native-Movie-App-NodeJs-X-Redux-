import Constants from "expo-constants"

// expo doesnt load env files on bundling so creating an app.config.js, and customizing works
const TMDB_TOKEN = Constants.expoConfig?.extra?.movieToken;
const TMDB_API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;


// tmdb object config
export const TMDB_CONFIG = {
    BASE_URL:"https://api.themoviedb.org/3",
    ACCESS_TOKEN: TMDB_TOKEN,
    API_KEY: TMDB_API_KEY,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }

  }


export const fetchMovies = async ({
  query,
  id,
}: {
  query?: string;
  id?: number;
}) => {

  let endpoint = "";

  if (query && query.trim().length > 0) {
    endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
  } 
  else if (id !== undefined) {
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&with_genres=${id}`;
  } 
  else {
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });
  

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `TMDB Error ${errorData.status_code}: ${errorData.status_message}`
    );
  }

  const data = await response.json();
  const movies = data.results.slice(0, 18);
  return  movies;

 
};

export const fetchMovieRecommendations = async (isKid?:boolean) => {
  let endpoint = "";
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc` + (isKid ? `&certification_country=US&certification.lte=G&with_genres=16&`  : "");
  

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });
  

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `TMDB Error ${errorData.status_code}: ${errorData.status_message}`
    );
  }
  const data = await response.json();
  const random18movies = data.results
    .sort(() => 0.5 - Math.random())
    .slice(0, 18);
  return  random18movies;

 
};


export const fetchKidsCartoons = async ({ query }: { query?: string }) => {
  let endpoint = "";

  const baseFilters =
    "certification_country=US&certification.lte=G&with_genres=16";

  if (query && query.trim().length > 0) {
    // TMDB's `search/movie` doesn't reliably accept discover-style filters like
    // `with_genres` or `certification.*`. For a filtered search we call the
    // search endpoint and then filter the results client-side by `adult` and
    // `genre_ids` (Animation genre id 16).
    endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}`;
  } else {
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?${baseFilters}`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `TMDB Error ${errorData.status_code}: ${errorData.status_message}`
    );
  }

  const data = await response.json();
  // If we used the search endpoint, filter results to ensure they are kids
  // cartoons (non-adult and include Animation genre id 16). Discover already
  // applied the correct filters server-side so we can return results directly.
  if (query && query.trim().length > 0) {
    const filtered = (data.results || []).filter((r: any) => {
      const isAdult = Boolean(r.adult);
      const hasAnimationGenre = Array.isArray(r.genre_ids) && r.genre_ids.includes(16);
      return !isAdult && hasAnimationGenre;
    });
    return filtered;
  }

  return data.results;
};


export const fetchmovieDetails = async (movie_id: string):Promise<MovieDetails> => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movie_id}?api_key=${TMDB_CONFIG.ACCESS_TOKEN}`, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `TMDB Error ${errorData.status_code}: ${errorData.status_message}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching movie details:", error);
    throw error;
    
  }
}

export const fetchMovieTrailer = async (movieId: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
  );
  
  const data = await response.json();

  const trailer = data.results.find(
    (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
  );

  return trailer ? trailer.key : null;
};