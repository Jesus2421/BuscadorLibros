// La API_KEY viene de config.js (cargado antes que este archivo en index.html)
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
let isSearching = false; // evita peticiones duplicadas

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, maxRetries = 2) {
  let lastError = null;

  for (let intento = 0; intento <= maxRetries; intento++) {
    try {
      const response = await fetch(url);

      // 503 = servicio temporalmente no disponible, vale la pena reintentar
      if (response.status === 503 && intento < maxRetries) {
        console.warn(`503 recibido, reintentando... (intento ${intento + 1}/${maxRetries})`);
        await delay(1000 * (intento + 1)); // espera creciente: 1s, 2s...
        continue;
      }

      return response; // devuelve la respuesta (ok o con otro tipo de error)

    } catch (err) {
      lastError = err;
      if (intento < maxRetries) {
        await delay(1000 * (intento + 1));
        continue;
      }
    }
  }

  throw lastError; // si todos los reintentos fallaron por error de red
}

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
    const url = `${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`;
    const response = await fetchWithRetry(url, 2);

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
      } else if (response.status === 503) {
        resultsContainer.innerHTML = `
          <p style="color:red;">
            ⚠️ El servicio de Google Books no está disponible en este momento.
            Ya lo intentamos varias veces — prueba de nuevo en unos minutos.
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
    // Error de red, CORS, etc. (tras agotar los reintentos)
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