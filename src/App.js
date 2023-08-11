import { useEffect, useState } from "react";
import { Loader, ErrorMessage } from "./componets/Loader";
import { NavBar, Logo, Search, NumResult } from "./componets/NavBar";
import { Main, Box, MovieList, SelectedMovie } from "./componets/Main";
import { WatchedSummary, WatchedMovieList } from "./componets/WatchedSummary";
import { useLocalStorageState } from "./states/useLocalStorageState";

export const KEY = "665dc82a";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleWatched(movie) {
    setWatched((watched) => [
      ...watched,
      {
        ...movie,
        imdbRating: Number(movie.imdbRating),
        Runtime: Number(movie.Runtime.split(" ").at(0)),
      },
    ]);
    console.log(watched);
  }

  // console.log(localStorage.getItem("watched"));

  function onDeleteWatched(id) {
    setWatched((watched) => watched.filter((movies) => movies.imdbID !== id));
  }

  function handleSelect(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovie() {
      try {
        setError(false);
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw Error("Something whent wrong !");
        let data = await res.json();
        if (data.Response === "False") throw new Error("Movie Not Found");
        setMovies(data.Search ? data.Search : [data]);
        setError("");
      } catch (e) {
        console.error(e.message, e.name);
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (query.length < 3) {
      setError("");
      return;
    }
    fetchMovie();
    return () => controller.abort();
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
            <MovieList movies={movies} handleSelectId={handleSelect} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              handleWatched={handleWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={onDeleteWatched}
              />{" "}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
