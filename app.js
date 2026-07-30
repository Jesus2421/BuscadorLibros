const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
let isSearching = false; // evita peticiones duplicadas

async function searchBooks(query) {
  const resultsContainer = document.getElementById("bookResults");

  if (!query || query.trim() === "") {
    resultsContainer.innerHTML = "<p>Escribe un título para buscar.</p>";
    return;
  }

  if (isSearching) return; // evita spam de clics
  isSearching = true;

  resultsContainer.innerHTML = "<p>Buscando...</p>";

  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`
    );

    // Si la respuesta no es OK, leemos el mensaje de error de Google
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const mensaje = errorData?.error?.message || `Error ${response.status}`;

      if (response.status === 429) {
        resultsContainer.innerHTML = `
          <p style="color:red;">
            ⚠️ Se ha superado el límite de peticiones a Google Books API.
            Espera unos minutos e inténtalo de nuevo.
          </p>`;
      } else if (response.status === 400 || response.status === 403) {
        resultsContainer.innerHTML = `
          <p style="color:red;">
            ⚠️ Problema con la API key: ${mensaje}
          </p>`;
      } else {
        resultsContainer.innerHTML = `<p style="color:red;">Error: ${mensaje}</p>`;
      }
      console.error("Google Books API error:", response.status, mensaje);
      return;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
      return;
    }

    renderBooks(data.items, resultsContainer);

  } catch (err) {
    // Error de red, CORS, etc.
    resultsContainer.innerHTML = `<p style="color:red;">Error de conexión: ${err.message}</p>`;
    console.error("Fetch error:", err);
  } finally {
    isSearching = false;
  }
}

function renderBooks(items, container) {
  container.innerHTML = items.map(book => {
    const info = book.volumeInfo;
    const titulo = info.title || "Sin título";
    const autores = info.authors ? info.authors.join(", ") : "Autor desconocido";
    const imagen = info.imageLinks?.thumbnail || "";
    return `
      <div class="libro">
        ${imagen ? `<img src="${imagen}" alt="${titulo}">` : ""}
        <h3>${titulo}</h3>
        <p>${autores}</p>
      </div>
    `;
  }).join("");
}

// ---- Conexión del botón y el input ----
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput"); // ← ajusta este id si no coincide

searchButton.addEventListener("click", () => {
  const query = searchInput.value;
  searchBooks(query);
});

// Permitir buscar también con la tecla Enter
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value;
    searchBooks(query);
  }
});