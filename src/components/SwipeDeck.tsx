"use client";
import React from "react";
import SwipeCard from "./SwipeCards";
import { useUserStore } from "@/store/useUserStore";
import toast from "react-hot-toast";
import { Movie } from "@/types/Movie"; 



interface SwipeDeckProps {
  movies: Movie[];
  onSwipe: (id: number, direction: "left" | "right") => void;
}

export default function SwipeDeck({ movies, onSwipe }: SwipeDeckProps) {
  const user = useUserStore((state) => state.user);

  return (
    <div style={{ position: "relative", width: 250, height: 350 }}>
      {movies
        .slice(0)
        .reverse()
        .map((movie) => (
          <SwipeCard
            key={movie.id}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            title={movie.title}
            description={movie.overview}
            imdb={movie.vote_average}
            onSwipe={(direction) => {
              if (!user) toast("First login.");
              onSwipe(movie.id, direction);
            }}
          />
        ))}
      {movies.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <p>No more movies to swipe 🎬</p>
        </div>
      )}
    </div>
  );
}
