import { account, databases } from "@/lib/appwrite";
import { ID } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const WATCHLIST_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID!;
const WATCHED_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_WATCHED_COLLECTION_ID!;

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  vote_average?: number;
};

export async function addToWatchlist(title: string) {
  const user = await account.get();
  if (!user) throw new Error("User not logged in");

  // TMDB'den film bul
  const tmdbSearchRes = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}`
  );

  const searchData = await tmdbSearchRes.json();
  const movie = searchData.results?.[0];

  if (!movie) {
    throw new Error("Movie not found on TMDB");
  }

  const { id, title: movieTitle, poster_path, overview, vote_average } = movie;

  await databases.createDocument(
    DATABASE_ID,
    WATCHLIST_COLLECTION_ID,
    ID.unique(),
    {
      user_id: user.$id,
      movie_id: id,
      title: movieTitle,
      poster_path,
      overview,
      vote_average,
    }
  );

  return { success: true };
}

export async function addToWatchedlist(movie: Movie) {
  const user = await account.get();
  if (!user) throw new Error("User not logged in");

  const { id, title, poster_path, overview, vote_average } = movie;

  await databases.createDocument(
    DATABASE_ID,
    WATCHED_COLLECTION_ID,
    ID.unique(),
    {
      user_id: user.$id,
      movie_id: id,
      title,
      poster_path,
      overview,
      vote_average,
    }
  );

  return { success: true };
}
