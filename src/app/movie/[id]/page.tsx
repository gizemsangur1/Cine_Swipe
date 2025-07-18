"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

type Genre = {
  id: number;
  name: string;
};

type MovieDetails = {
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string;
  poster_path: string;
  genres: Genre[];
};

export default function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
              language: "en-US",
            },
          }
        );
        setMovie(response.data);
      } catch (err) {
        setError("Failed to fetch movie details");
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div className="centered">Loading...</div>;
  if (error) return <div className="centered error">{error}</div>;
  if (!movie) return null;

  return (
    <div
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "white",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
        }}
      ></div>

      <div
        style={{
          position: "relative",
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          zIndex: 1,
        }}
      >
        <Image
          width={300}
          height={300}
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          style={{
            width: "300px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          }}
        />
        <div style={{ maxWidth: "600px" }}>
          <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
            {movie.title}
          </h1>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "20px",
              color: "#dddddd",
            }}
          >
            {movie.overview}
          </p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}
          </p>
          <p>
            <strong>Genres:</strong> {movie.genres.map((g) => g.name).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
