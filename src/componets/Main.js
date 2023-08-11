import { useEffect, useState } from "react";
import { KEY } from "../App";
import StarRating from "./StartRating";
import { Loader } from "./Loader";
import { useKey } from "../states/useKey";

export function Main({ children }) {
  return <main className="main">{children}</main>;
}
export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
export function MovieList({ movies, handleSelectId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          handleSelectId={handleSelectId}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, handleSelectId }) {
  return (
    <li key={movie.imdbID} onClick={() => handleSelectId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

export function SelectedMovie({
  selectedId,
  setSelectedId,
  handleWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isWatched, setWatched] = useState(false);

  useEffect(() => {
    if (!movie.Title) return;
    document.title = `Movie | ${movie.Title}`;
    return () => {
      document.title = `Movie`;
    };
  }, [movie.Title]);

  useKey("Escape", () => setSelectedId(null));

  useEffect(() => {
    async function getMovieDetails() {
      setLoading(true);
      // console.log("called");
      const res = await fetch(
        `http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`
      );
      const data = await res.json();
      setMovie(data);
      // await console.log(selectedId, data);
      setWatched(watched.map((d) => d.imdbID).includes(selectedId));
      setLoading(false);
    }
    if (selectedId) getMovieDetails();
  }, [selectedId, watched]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => setSelectedId(null)}>
              &larr;
            </button>

            <img src={movie.Poster} alt={`Poster of ${movie.Title}`}></img>

            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span> {movie.imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched && (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    setUserRating={setUserRating}
                  />
                  {userRating > 3 && (
                    <button
                      className="btn-add"
                      onClick={() => {
                        handleWatched({ ...movie, userRating });
                        setWatched(true);
                      }}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              )}
              {isWatched && <p>You Allready Rated this Movie</p>}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starrig {movie.Actors}</p>
            <p>Directed By {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
