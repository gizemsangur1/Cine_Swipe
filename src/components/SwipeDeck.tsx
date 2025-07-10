"use client";
import React, { useState } from "react";
import BadOmens from "../../public/badomens.jpg";
import type { StaticImageData } from "next/image";
import SwipeCard from "./SwipeCards";
import { useUserStore } from "@/store/useUserStore";
import toast from "react-hot-toast";

interface Movie {
  id: number;
  image: StaticImageData;
  title: string;
  description: string;
  imdb: number;
}

const initialMovies: Movie[] = [
  { id: 1, image: BadOmens, title: "Bad Omens", description: "Metalcore Vibes", imdb: 7.5 },
  { id: 2, image: BadOmens, title: "Another Movie", description: "Alt Description", imdb: 8.1 },
  { id: 3, image: BadOmens, title: "Third Movie", description: "Rock n roll", imdb: 6.9 },
];

export default function SwipeDeck() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const user = useUserStore((state) => state.user);
  const notify = () => toast('First login.');

  const handleSwipe = (direction: "left" | "right") => {
    const swipedMovie = movies[0];
	user?  notify()
	:
    console.log(
      direction === "right"
        ? `Added to watchlist: ${swipedMovie.title}`
        : `Skipped: ${swipedMovie.title}`
    );

    setMovies((prev) => prev.slice(1));
  };

  return (
    <div style={{ position: "relative", width: 250, height: 350 }}>
      {movies
        .slice(0)
        .reverse()
        .map((movie, index) => (
          <SwipeCard
            key={movie.id}
            image={movie.image}
            title={movie.title}
            description={movie.description}
            imdb={movie.imdb}
            onSwipe={handleSwipe}
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
