import React, { useMemo, useState } from "react";
import { List, type RowComponentProps } from "react-window";

interface Movie {
  id: number;
  title: string;
  rating: number;
  genre: string;
}

interface Challenge4Props {
  initialCount?: number;
}

const ROW_HEIGHT = 40;
const LIST_HEIGHT = 500;

const generateMovies = (count: number): Movie[] => {
  const genres = ["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Romance"];
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    title: `Movie ${index + 1}`,
    rating: parseFloat((Math.random() * 5).toFixed(1)),
    genre: genres[Math.floor(Math.random() * genres.length)],
  }));
};

function MovieRow({
  index,
  style,
  movies,
}: RowComponentProps<{
  movies: Movie[];
}>) {
  const movie = movies[index];
  if (!movie) return null;

  return (
    <div
      style={{
        ...style,
        padding: "8px 12px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
      }}
      data-testid={`movie-row-${index}`}
    >
      <div>
        <strong>{movie.title}</strong> · {movie.genre}
      </div>
      <div>{movie.rating.toFixed(1)} ★</div>
    </div>
  );
}

const Challenge4: React.FC<Challenge4Props> = ({ initialCount = 100000 }) => {
  const [movies] = useState<Movie[]>(() => generateMovies(initialCount));
  const [search, setSearch] = useState("");

  const filteredMovies = useMemo(() => {
    const q = search.toLowerCase();
    return movies.filter((m) => {
      if (q === "") return true;
      const inTitle = m.title.toLowerCase().includes(q);
      const inGenre = m.genre.toLowerCase().includes(q);
      return inTitle || inGenre;
    });
  }, [movies, search]);

  return (
    <div style={{ padding: 20 }} data-testid="challenge4-root">
      <h1 data-testid="challenge4-title">
        Challenge 4: Filtered Virtualized Movies
      </h1>

      <p data-testid="challenge4-description">
        This list renders <strong>{initialCount.toLocaleString()}</strong>{" "}
        movies using a virtualized <code>List</code>. Use the search box and
        observe that scrolling stays smooth.
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Notice the lag when rendering a large list.</li>
          <li>Implement list virtualization using react-window.</li>
          <li>
            Observe the improved performance and scrolling after optimization.
          </li>
        </ol>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 16,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
        data-testid="challenge4-controls"
      >
        <label
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
          data-testid="challenge4-search-label"
        >
          Search by title or genre
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Movie 123 or Action"
            style={{ padding: "6px 8px", minWidth: 200 }}
            data-testid="challenge4-search-input"
          />
        </label>

        <div style={{ fontSize: 14 }} data-testid="challenge4-count">
          Showing <strong>{filteredMovies.length.toLocaleString()}</strong>{" "}
          movies
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontStyle: "italic",
          }}
          data-testid="challenge4-empty"
        >
          No movies match your filters.
        </div>
      ) : (
        <div
          className="list-wrapper"
          style={{ height: LIST_HEIGHT, border: "1px solid #ddd" }}
          data-testid="challenge4-list-wrapper"
        >
          <List
            rowComponent={MovieRow}
            rowCount={filteredMovies.length}
            rowHeight={ROW_HEIGHT}
            rowProps={{
              movies: filteredMovies,
            }}
            data-testid="challenge4-virtual-list"
          />
        </div>

        //         <ul>
        //   {filteredProducts.map((product) => (
        //     <li key={product.id}>
        //       {product.name} - ${product.price.toFixed(2)} - {product.category}
        //     </li>
        //   ))}
        // </ul>
      )}
    </div>
  );
};

export default Challenge4;
