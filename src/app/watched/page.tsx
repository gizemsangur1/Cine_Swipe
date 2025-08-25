"use client";

import { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Spin, Button } from "antd";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/Typography/PageHeader";

type Movie = {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  vote_average?: number;
};

export default function Watched() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (session?.user && !user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: (session.user as any).name || "",
        surname: (session.user as any).surname || "",
        username: (session.user as any).username || "",
        avatar_url: (session.user as any).avatar_url || "",
      });
    }
  }, [session, user, setUser]);

  useEffect(() => {
    const fetchWatchedList = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`/api/watched?userId=${user.id}`);
        const watchedlist = await res.json();

        if (!res.ok) {
          console.error("Watchedlist fetch failed:", watchedlist?.error);
          return;
        }

        const tmdbDetails = await Promise.all(
          watchedlist.map(async (entry: { movie_id: number }) => {
            const tmdbRes = await fetch(
              `https://api.themoviedb.org/3/movie/${entry.movie_id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            return await tmdbRes.json();
          })
        );

        setMovies(tmdbDetails);
      } catch (err) {
        console.error("Watchedlist fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedList();
  }, [user?.id]);

  const handleDelete = async (movieId: number) => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `/api/watched?userId=${user.id}&movieId=${movieId}`,
        { method: "DELETE" }
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
    <div style={{ padding: "40px",marginTop:"15px" }}>
       <PageHeader pageTitle="Watched Movies"/>
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
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
