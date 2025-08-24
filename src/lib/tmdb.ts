import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key:  process.env.TMDB_API_KEY,
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    return [];
  }
};

export function getImageUrl(path?: string, size: string = "w200"): string {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

