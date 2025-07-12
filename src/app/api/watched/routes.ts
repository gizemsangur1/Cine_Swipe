import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies as getCookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	const authHeader = request.headers.get("Authorization");

	if (!userId || !authHeader) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/watched?user_id=eq.${userId}`,
		{
			headers: {
				apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
				Authorization: authHeader,
			},
		}
	);

	const data = await res.json();
	return NextResponse.json(data);
}


export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const userId = searchParams.get("userId");
  const authHeader = request.headers.get("Authorization");

  if (!movieId || !userId || !authHeader) {
	return NextResponse.json({ error: "Unauthorized or missing params" }, { status: 401 });
  }

  const res = await fetch(
	`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/watched?user_id=eq.${userId}&movie_id=eq.${movieId}`,
	{
	  method: "DELETE",
	  headers: {
		apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		Authorization: authHeader,
	  },
	}
  );

  if (!res.ok) {
	const error = await res.json();
	return NextResponse.json({ error }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}