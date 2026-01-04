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


export const fetchMovies = async ({ query }: { query: string }) => {
  console.log("Fetching movies with query:", query);
  const endpoint =
    query
      ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  // If TMDB sends an error, parse the JSON body FIRST
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `TMDB Error ${errorData.status_code}: ${errorData.status_message}`
    );
  }

  const data = await response.json();
  return data.results;
};

export const fetchKidsCartoons = async () => {
  console.log("Fetching kids cartoons...");

  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?` +
    `certification_country=US&` +
    `certification.lte=G&` +
    `with_genres=16&` + // 🎨 Animation
    `sort_by=popularity.desc`;

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
    console.log("Movie genre clicked:", data.genres[1].name);
    return data;
  } catch (error) {
    console.log("Error fetching movie details:", error);
    throw error;
    
  }
}

export const fetchMovieTrailer = async (movieId: string) => {
  console.log("TMDB API KEY",TMDB_CONFIG.API_KEY);
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`,
  );
  
  const data = await response.json();

  const trailer = data.results.find(
    (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
  );

  return trailer ? trailer.key : null;
};