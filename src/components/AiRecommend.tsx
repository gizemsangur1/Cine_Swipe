"use client";
import {  Input, Row } from "antd";
import React, { useState } from "react";
import SwipeDeck from "./SwipeDeck";
import { addToWatchlist } from "@/lib/functions";
import { Movie } from "@/types/Movie";
import SubmitButton from "./Buttons/Submit/SubmitButton";

export default function AiRecommend() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovieDetailsFromTMDB = async (title: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&query=${encodeURIComponent(title)}`
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

  const handleSwipe = async (id: number, direction: "left" | "right") => {
    const swipedMovie = movies.find((m) => m.id === id);
    if (direction === "right" && swipedMovie?.title) {
      await addToWatchlist(swipedMovie.title);
    } else {
      console.log(`Skipped: ${swipedMovie?.title}`);
    }
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <>
      <Row style={{ width: "100%" ,justifyContent:"center",display:"center"}}>
        <Input
          style={{
            width: "80%",
            backgroundColor: "transparent",
            color: "whitesmoke",
            border: "none",
            borderBottom: "2px solid white",
            borderRadius: 0,
            boxShadow: "none",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. romantic period drama with strong female lead"
          disabled={loading}
          className="custom-input"
        />
        <SubmitButton title="FIND" loading={loading} onClick={handleFind} />
      </Row>

      <Row
        style={{ width: "100%", justifyContent: "center", marginTop: "30px" }}
      >
        <SwipeDeck movies={movies} onSwipe={handleSwipe} />
      </Row>
    </>
  );
}
