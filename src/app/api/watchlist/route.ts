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
		`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/watchlist?user_id=eq.${userId}`,
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

