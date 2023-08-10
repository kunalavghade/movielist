import { useState } from "react";

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
export function MovieList({ movies, setSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} setSelectedId={setSelectedId} />
      ))}
    </ul>
  );
}
function Movie({ movie, setSelectedId }) {
  return (
    <li key={movie.imdbID} onClick={() => setSelectedId(movie.imdbID)}>
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

export function SelectedMovie({ selectedId, setSelectedId }) {
  return (
    <div className="detailts">
      <button className="btn-back" onClick={() => setSelectedId(null)}></button>
      {selectedId}
    </div>
  );
}
