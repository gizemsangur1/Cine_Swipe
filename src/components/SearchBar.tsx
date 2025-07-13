import { Input } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';

export default function SearchBar() {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.trim() === '') {
      setMovies([]);
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
            language: 'en-US',
            page: 1,
          }
        }
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input.Search
        placeholder="Search for movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={() => handleSearch(query)} 
        loading={loading} 
        enterButton
      />
      {movies.length > 0 && (
        <div style={{width:"100%", marginTop: '10px',position:"absolute",zIndex:999,backgroundColor:"white" }}>
          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                <a href={`/movie/${movie.id}`}  rel="noopener noreferrer">
                  {movie.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {movies.length === 0 && !loading && query && (
        <div>No results found for "{query}".</div>
      )}
    </div>
  );
}
