import { supabase } from "@/lib/supabaseClient";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  vote_average?: number;
};

export async function addToWatchlist(title: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("User not logged in");
  }

  const userId = session.user.id;

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

  const { error } = await supabase.from("watchlist").insert({
    user_id: userId,
    movie_id: id,
    title: movieTitle,
    poster_path,
    overview,
    vote_average,
  });

  if (error) {
    console.error("Failed to insert to watchlist", error);
    throw error;
  }

  return { success: true };
}

export async function addToWatchedlist(movie: Movie) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("User not logged in");
  }

  const { id, title, poster_path, overview, vote_average } = movie;

  const { error } = await supabase.from("watched").insert({
    user_id: session.user.id,
    movie_id: id,
    title,
    poster_path,
    overview,
    vote_average,
  });

  if (error) {
    console.error("Failed to insert to watched list", error);
    throw error;
  }

  return { success: true };
}

