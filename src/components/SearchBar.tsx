import { Input, Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const pageSize = 5;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setMovies([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            query: searchTerm,
            language: "en-US",
            page: 1,
          },
        }
      );
      setMovies(response.data.results || []);
      setCurrentPage(1);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMovies = movies.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(movies.length / pageSize);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <Input.Search
        placeholder="Search for movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={() => handleSearch(query)}
        loading={loading}
        enterButton
        style={{ width: "100%" }}
        onFocus={() => {
          if (movies.length > 0) setShowResults(true);
        }}
      />

      {showResults && paginatedMovies.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            position: "absolute",
            zIndex: 999,
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {paginatedMovies.map((movie) => (
              <li key={movie.id} style={{ padding: "6px 0" }}>
                <Link
                  href={`/movie/${movie.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    fontWeight: "500",
                    display: "block",
                  }}
                >
                  {movie.title}
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {movies.length === 0 && !loading && query && (
        <div style={{ marginTop: "8px", color: "#999" }}>
          No results found for &quot;{query}&quot;.
        </div>
      )}
    </div>
  );
}
