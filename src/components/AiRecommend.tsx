"use client";
import { Button, Input, Row } from "antd";
import React, { useState } from "react";
import SwipeDeck from "./SwipeDeck";

export default function AiRecommend() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);

  const fetchMovieDetailsFromTMDB = async (title: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return data.results?.[0] || null;
  };

  const getMoviesFromTitles = async (titles: string[]) => {
    const movies = await Promise.all(titles.map(fetchMovieDetailsFromTMDB));
    return movies.filter(Boolean);
  };

  const handleFind = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        body: JSON.stringify({ prompt: input }),
      });
      const titles = await res.json();
      const movieDetails = await getMoviesFromTitles(titles);
      setMovies(movieDetails);
    } catch (err) {
      console.error("Bir hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (id: number, direction: "left" | "right") => {
    const swipedMovie = movies.find((m) => m.id === id);
    console.log(
      direction === "right"
        ? `Added to watchlist: ${swipedMovie.title}`
        : `Skipped: ${swipedMovie.title}`
    );
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Input
          style={{ width: "85%" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. romantic period drama with strong female lead"
          disabled={loading}
        />
        <Button onClick={handleFind} loading={loading}>
          FIND
        </Button>
      </Row>

      <Row style={{ width: "100%", justifyContent: "center", marginTop: "30px" }}>
        <SwipeDeck movies={movies} onSwipe={handleSwipe} />
      </Row>
    </>
  );
}
