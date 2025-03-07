# Biblioteca Francisco de Miranda

Este es un buscador de libros que utiliza la API de Google Books para encontrar información sobre libros. La aplicación permite a los usuarios buscar libros por título y muestra los resultados en la página.

## Estructura del Proyecto

- `index.html`: Contiene la estructura HTML de la aplicación.
- `app.js`: Contiene el código JavaScript que maneja la lógica de búsqueda y muestra los resultados.
- `styles.css`: Contiene los estilos CSS para la aplicación.
- `img/unnamed.png`: Imagen utilizada en la cabecera de la página.

## Cómo usar

1. Abre el archivo `index.html` en tu navegador.
2. Escribe el nombre del libro que deseas buscar en el campo de texto.
3. Haz clic en el botón "Buscar".
4. Los resultados de la búsqueda se mostrarán debajo del botón de búsqueda.

## Descripción del Código

### `index.html`

- Contiene un campo de texto para ingresar el nombre del libro y un botón para iniciar la búsqueda.
- Incluye un contenedor (`div`) para mostrar los resultados de la búsqueda.

### `app.js`

- Agrega un evento de clic al botón de búsqueda.
- Obtiene el valor del campo de texto y llama a la función `searchBooks`.
- La función `searchBooks` hace una solicitud a la API de Google Books con el término de búsqueda.
- Muestra los resultados de la búsqueda en el contenedor de resultados.

### `styles.css`

- Define los estilos para la apariencia de la aplicación.

## Requisitos

- Un navegador web moderno.
- Conexión a Internet para acceder a la API de Google Books.

## Créditos

- La API de Google Books es proporcionada por Google.
- La imagen utilizada en la cabecera es propiedad de sus respectivos dueños.

## Licencia

Este proyecto está bajo la Licencia MIT. Puedes ver más detalles en el archivo LICENSE.
