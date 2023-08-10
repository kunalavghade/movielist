import { useEffect, useState } from "react";
import { Loader, ErrorMessage } from "./componets/Loader";
import { NavBar, Logo, Search, NumResult } from "./componets/NavBar";
import { Main, Box, MovieList, SelectedMovie } from "./componets/Main";
import { WatchedSummary, WatchedMovieList } from "./componets/WatchedSummary";

const KEY = "665dc82a";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(() => console.log(query), [query]);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setError(false);
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`
        );

        if (!res.ok) throw Error("Something whent wrong !");
        let data = await res.json();
        if (data.Response === "False") throw new Error("Movie Not Found");
        // console.log(data.Search ? data.Search : []);
        setMovies(data.Search ? data.Search : [data]);
      } catch (e) {
        console.error(e.message);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (query.length > 3) fetchMovie();
  }, [query]);

  return (
    <>
      <NavBar movies={movies}>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box movies={movies}>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} setSelectedId={setSelectedId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />{" "}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
