import { databases, ID } from "@/lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const WATCHLIST_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID!;

export async function addToWatchlist(userId: string, movie: any) {
  return await databases.createDocument(
    DATABASE_ID,
    WATCHLIST_COLLECTION_ID,
    ID.unique(),
    {
      user_id: userId,
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview?.slice(0, 500) ?? "",
      vote_average: movie.vote_average ?? 0,
    }
  );
}

export async function getWatchlist(userId: string) {
  const res = await databases.listDocuments(
    DATABASE_ID,
    WATCHLIST_COLLECTION_ID,
    [Query.equal("user_id", userId)]
  );
  return res.documents;
}

export async function removeFromWatchlist(docId: string) {
  return await databases.deleteDocument(
    DATABASE_ID,
    WATCHLIST_COLLECTION_ID,
    docId
  );
}
