const btn = document.getElementById("btn");
const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const loader = document.getElementById("loader");
const toggleView = document.getElementById("toggleView");

const API_KEY = "401b11f8";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showingFavorites = false;
let lastResults = []; // <-- guardamos últimos resultados

let currentPage = 1;
let totalPages = 1;
let lastQuery = "";

const pagination = document.getElementById("pagination");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// -------- Toggle favoritos / resultados --------
toggleView.addEventListener("click", () => {
  showingFavorites = !showingFavorites;

  if (showingFavorites) {
    toggleView.textContent = "Ver resultados";
    renderMovies(favorites);

    // 👇 OCULTAR PAGINACIÓN
    pagination.style.display = "none";
  } else {
    toggleView.textContent = "Ver favoritos";

    if (lastResults.length > 0) {
      renderMovies(lastResults);

      // 👇 MOSTRAR PAGINACIÓN SOLO EN RESULTADOS
      updatePaginationUI();
    } else {
      results.innerHTML = "<p style='color:#666;'>Realiza una búsqueda.</p>";

      // 👇 OCULTAR PAGINACIÓN SI NO HAY RESULTADOS
      pagination.style.display = "none";
    }
  }
});

// -------- Buscar con Enter --------
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btn.click();
});

// -------- Botón buscar --------
btn.addEventListener("click", async () => {
  const query = searchInput.value.trim();

  if (!query) {
    results.innerHTML =
      "<p style='color:#666;'>Escribe el nombre de una película.</p>";
    return;
  }

  loader.style.display = "block";
  results.innerHTML = "";

  const start = Date.now();
  const MIN_TIME = 300;

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      results.innerHTML =
        "<p style='color:#666;'>No se encontraron resultados.</p>";
      return;
    }

    lastResults = data.Search; // <-- guardamos resultados
    renderMovies(lastResults);
  } catch (error) {
    results.innerHTML =
      "<p style='color:red;'>Error al conectar con la API.</p>";
  } finally {
    const elapsed = Date.now() - start;
    const remaining = MIN_TIME - elapsed;

    if (remaining > 0) {
      setTimeout(() => (loader.style.display = "none"), remaining);
    } else {
      loader.style.display = "none";
    }
  }
});

// -------- Render de películas --------
function renderMovies(movies) {
  results.innerHTML = "";

  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className = "movie";

    const poster =
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "https://placehold.co/300x450?text=No+Image";

    const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);

    movieDiv.innerHTML = `
      <img 
        src="${poster}" 
        alt="${movie.Title}"
        onerror="this.onerror=null; this.src='https://placehold.co/300x450?text=No+Image';"
      />
      <h3>${movie.Title}</h3>
      <p>Año: ${movie.Year}</p>
      <button class="fav-btn">
        ${isFavorite ? "★ Quitar de favoritos" : "☆ Añadir a favoritos"}
      </button>
    `;

    const favBtn = movieDiv.querySelector(".fav-btn");

    favBtn.addEventListener("click", () => {
      const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);

      if (exists) {
        favorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
      } else {
        favorites.push(movie);
      }

      saveFavorites();

      // refrescamos la vista correcta
      renderMovies(showingFavorites ? favorites : movies);
    });

    results.appendChild(movieDiv);
  });
}

async function searchMovies(query, page = 1) {
  loader.style.display = "block";
  results.innerHTML = "";

  const start = Date.now();
  const MIN_TIME = 300;

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
    );

    const data = await response.json();

    if (data.Response === "False") {
      results.innerHTML =
        "<p style='color:#666;'>No se encontraron resultados.</p>";
      pagination.style.display = "none";
      return;
    }

    // guardar estado
    lastResults = data.Search;
    lastQuery = query;
    currentPage = page;
    totalPages = Math.ceil(data.totalResults / 10);

    renderMovies(lastResults);
    updatePaginationUI();
  } catch (error) {
    results.innerHTML =
      "<p style='color:red;'>Error al conectar con la API.</p>";
  } finally {
    const elapsed = Date.now() - start;
    const remaining = MIN_TIME - elapsed;

    if (remaining > 0) {
      setTimeout(() => (loader.style.display = "none"), remaining);
    } else {
      loader.style.display = "none";
    }
  }
}

btn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (!query) {
    results.innerHTML =
      "<p style='color:#666;'>Escribe el nombre de una película.</p>";
    return;
  }

  searchMovies(query, 1);
});

function updatePaginationUI() {
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  pagination.style.display = "flex";

  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
}

prevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    searchMovies(lastQuery, currentPage - 1);
  }
});

nextPage.addEventListener("click", () => {
  if (currentPage < totalPages) {
    searchMovies(lastQuery, currentPage + 1);
  }
});
