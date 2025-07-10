"use client";
import { Button, Input, Row } from "antd";
import React, { useState } from "react";

export default function AiRecommend() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.log("AI önerileri:", titles);

      const movieDetails = await getMoviesFromTitles(titles);
      console.log("TMDB detaylı filmler:", movieDetails);
    } catch (err) {
      console.error("Bir hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
