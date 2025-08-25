"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Movie } from "@/types/Movie";

import {
  TextField,
  IconButton,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Typography,
  Button,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getImageUrl } from "@/lib/tmdb";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
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
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*   console.log(paginatedMovies);
   */
  return (
    <Box ref={containerRef} sx={{ position: "relative", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (movies.length > 0) setShowResults(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(query);
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleSearch(query)} edge="end">
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#C5172E" }} />
                ) : (
                  <SearchIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            ),
          }}
          sx={{
            input: {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "55px",
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#C5172E",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#C5172E",
            },
          }}
        />
      </Box>

      {showResults && paginatedMovies.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            mt: 1,
            position: "absolute",
            zIndex: 999,
            width: "100%",
            borderRadius: 2,
            maxHeight: 350,
            overflowY: "auto",
          }}
        >
          <List>
            {paginatedMovies.map((movie, index) => (
              <React.Fragment key={movie.id}>
                <ListItem
                  component={Link}
                  href={`/movie/${movie.id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      sx={{ width: 56, height: 56, borderRadius: "8px" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ marginLeft: "10px" }}
                    primary={movie.title}
                    secondary={
                      movie.release_date
                        ? new Date(movie.release_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Unknown"
                    }
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "1rem",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.85rem",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
                {index < paginatedMovies.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1.5,
            }}
          >
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              sx={{
                color: "#C5172E",
                borderRadius: "15px",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#C5172E",
                  opacity: 0.8,
                },
              }}
            >
              Previous
            </Button>
            <Typography variant="body2">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              sx={{
                color: "#C5172E",
                borderRadius: "15px",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#C5172E",
                  opacity: 0.8,
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Paper>
      )}

      {movies.length === 0 && !loading && query && (
        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          No results found for &quot;{query}&quot;.
        </Typography>
      )}
    </Box>
  );
}
