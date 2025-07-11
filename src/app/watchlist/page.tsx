"use client";

import { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Spin, Button } from "antd";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/lib/supabaseClient";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  vote_average?: number;
};

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const restoreUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session?.user && data.session?.access_token) {
        setUser({
          email: data.session.user.email!,
          id: data.session.user.id,
          token: data.session.access_token,
        });
      } else {
        console.warn("Session ya da access token eksik");
      }
    };

    if (!user) {
      restoreUser();
    }
  }, [user]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user?.id || !user?.token) return;

      try {
        const res = await fetch(`/api/watchlist?userId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const watchlist = await res.json();

        if (!res.ok) {
          console.error("Watchlist fetch failed:", watchlist?.error);
          return;
        }

        const tmdbDetails = await Promise.all(
          watchlist.map(async (entry: { movie_id: number }) => {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/movie/${entry.movie_id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            return await tmdbRes.json();
          })
        );

        setMovies(tmdbDetails);
      } catch (err) {
        console.error("Watchlist fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user?.id, user?.token]);

  const handleDelete = async (movieId: number) => {
    if (!user?.id || !user?.token) return;

    try {
      const res = await fetch(
        `/api/watchlist?userId=${user.id}&movieId=${movieId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m.id !== movieId));
      } else {
        const errorData = await res.json();
        console.error("Delete failed:", errorData?.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
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
    <div style={{ padding: "40px" }}>
      <Typography.Title level={2}>Your Watchlist 🎬</Typography.Title>
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
                description={movie.overview?.slice(0, 100) + "..."}
              />
              {movie.vote_average && (
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
                <Button style={{ width: "45%" }}>Watched</Button>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
