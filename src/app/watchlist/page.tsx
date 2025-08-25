"use client";

import { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Spin, Button } from "antd";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { useSession } from "next-auth/react";
import { addToWatchedlist } from "@/lib/functions";
import PageHeader from "@/components/Typography/PageHeader";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  vote_average?: number;
};

type WatchlistEntry = {
  movie_id: number;
};

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (session?.user && !user) {
      const u = session.user as Record<string, unknown>;
      setUser({
        id: (u.id as string) ?? "",
        email: (u.email as string) ?? "",
        name: (u.name as string) ?? "",
        surname: (u.surname as string) ?? "",
        username: (u.username as string) ?? "",
        avatar_url: (u.avatar_url as string) ?? "",
      });
    }
  }, [session, user, setUser]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`/api/watchlist?userId=${user.id}`);
        const watchlist: WatchlistEntry[] | { error: string } = await res.json();

        if (!res.ok || "error" in watchlist) {
          console.error("Watchlist fetch failed:", (watchlist as { error: string })?.error);
          return;
        }

        const tmdbDetails: Movie[] = await Promise.all(
          (watchlist as WatchlistEntry[]).map(async (entry) => {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/movie/${entry.movie_id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            return (await tmdbRes.json()) as Movie;
          })
        );

        setMovies(tmdbDetails);
      } catch (err) {
        const error = err as Error;
        console.error("Watchlist fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user?.id]);

  const handleDelete = async (movieId: number) => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `/api/watchlist?userId=${user.id}&movieId=${movieId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m.id !== movieId));
      } else {
        const errorData = (await res.json()) as { error?: string };
        console.error("Delete failed:", errorData?.error);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Delete error:", error.message);
    }
  };

  const handleWatchedMovie = async (id: number) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    try {
      await addToWatchedlist({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || "",
        overview: movie.overview || "",
        vote_average: movie.vote_average || 0,
      });

      await handleDelete(movie.id);
    } catch (err) {
      const error = err as Error;
      console.error("Failed to add to watchedlist:", error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", marginTop: "15px" }}>
      <PageHeader pageTitle="Your Watchlist" />
      <Row gutter={[16, 16]}>
        {movies.map((movie) => (
          <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
            <Card
              hoverable
              cover={
                movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={250}
                    height={350}
                    style={{ objectFit: "cover" }}
                  />
                ) : null
              }
            >
              <Card.Meta
                title={movie.title}
                description={
                  movie.overview ? movie.overview.slice(0, 100) + "..." : ""
                }
              />
              {movie.vote_average !== undefined && (
                <Typography.Text>⭐ {movie.vote_average}</Typography.Text>
              )}
              <Row
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  marginTop: "15px",
                }}
              >
                <Button
                  style={{ width: "45%" }}
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </Button>
                <Button
                  style={{ width: "45%" }}
                  onClick={() => handleWatchedMovie(movie.id)}
                >
                  Watched
                </Button>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
