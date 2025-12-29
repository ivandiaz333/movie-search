const btn = document.getElementById("btn");
const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const loader = document.getElementById("loader");

const API_KEY = "401b11f8";

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

btn.addEventListener("click", async () => {
  const query = searchInput.value.trim();

  if (!query) {
    results.textContent =
      "<p style='color:#666;'>Escribe el nombre de una película.</p>";
    return;
  }

  // Mostrar loader
  loader.style.display = "block";
  results.innerHTML = "";

  const start = Date.now(); // <-- guardamos el tiempo de inicio
  const MIN_TIME = 300; // <-- 300 ms mínimo

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await response.json();

    if (data.response === "False") {
      results.textContent =
        "<p style='color:#666;'>No se encontraron resultados.</p>";
      return;
    }

    renderMovies(data.Search);
  } catch (error) {
    results.textContent =
      "<p style='color:red;'>Error al conectar con la API.</p>";
  } finally {
    const elapsed = Date.now() - start; // tiempo transcurrido
    const remaining = MIN_TIME - elapsed; // cuánto falta hasta 500 ms

    if (remaining > 0) {
      setTimeout(() => {
        loader.style.display = "none";
      }, remaining);
    } else {
      loader.style.display = "none";
    }
  }
});

function renderMovies(movies) {
  results.innerHTML = "";

  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className = "movie";

    const poster =
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "https://placehold.co/300x450?text=No+Image";

    movieDiv.innerHTML = `
      <img 
        src="${poster}" 
        alt="${movie.Title}"
        onerror="this.onerror=null; this.src='https://placehold.co/300x450?text=No+Image';"
      />
      <h3>${movie.Title}</h3>
      <p>Año: ${movie.Year}</p>
    `;

    results.appendChild(movieDiv);
  });
}
