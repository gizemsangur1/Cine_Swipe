import { NextResponse } from "next/server";
import { adminDatabases, Query, ID } from "@/lib/appwriteAdmin";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const WATCHED_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_WATCHED_COLLECTION_ID!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const docs = await adminDatabases.listDocuments(
      DATABASE_ID,
      WATCHED_COLLECTION_ID,
      [Query.equal("user_id", userId)]
    );

    return NextResponse.json(docs.documents);
  } catch (error: any) {
    console.error("Watched GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, movie } = body;

  if (!userId || !movie) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const doc = await adminDatabases.createDocument(
      DATABASE_ID,
      WATCHED_COLLECTION_ID,
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

    return NextResponse.json(doc);
  } catch (error: any) {
    console.error("Watched POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const movieId = searchParams.get("movieId");

  if (!userId || !movieId) {
    return NextResponse.json({ error: "Missing userId or movieId" }, { status: 400 });
  }

  try {
    const docs = await adminDatabases.listDocuments(
      DATABASE_ID,
      WATCHED_COLLECTION_ID,
      [
        Query.equal("user_id", userId),
        Query.equal("movie_id", parseInt(movieId)),
      ]
    );

    if (docs.total > 0) {
      await adminDatabases.deleteDocument(
        DATABASE_ID,
        WATCHED_COLLECTION_ID,
        docs.documents[0].$id
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Watched DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
