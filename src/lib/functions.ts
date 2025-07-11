import { supabase } from "@/lib/supabaseClient";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
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

  const { data, error } = await supabase.from("watchlist").insert({
    user_id: userId,
    title: title,
  });

  if (error) {
    console.error("Failed to insert to watchlist", error);
    throw error;
  }

  return data;
}
