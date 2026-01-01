# Buscador de películas 🎬

Aplicación web desarrollada con **HTML, CSS y JavaScript** que permite buscar películas utilizando la API pública de **OMDb**.

El usuario puede introducir el nombre de una película y obtener una lista de resultados con:

- Póster
- Título
- Año de lanzamiento
- Botón para marcar como favorita ⭐

Además, la aplicación gestiona estados de carga, errores, paginación y favoritos guardados localmente para ofrecer una experiencia de usuario fluida y moderna.

---

## 🚀 Demo

Disponible en producción en Netlify:

👉 https://movie-search-ivan.netlify.app/

---

## 🛠 Tecnologías utilizadas

- **HTML5**
- **CSS3 (Masonry Layout con column-count)**
- **JavaScript (ES6+)**
- **Fetch API**
- **OMDb API**
- **LocalStorage**
- **Netlify (deploy)**

---

## ✨ Funcionalidades

✔ Búsqueda de películas por título  
✔ Renderizado dinámico de resultados  
✔ Loader animado durante la búsqueda  
✔ Placeholder cuando no existe póster  
✔ Manejo de errores y estados vacíos  
✔ Soporte para pulsar **Enter** al buscar  
✔ **Sistema de favoritos con persistencia en LocalStorage**  
✔ **Vista independiente de favoritos**  
✔ **Paginación entre resultados**  
✔ **Diseño responsive con layout tipo masonry**  
✔ UI sencilla y limpia

---

## 📄 Paginación

La aplicación permite navegar entre los resultados mediante:

Anterior | Página X de Y | Siguiente

Las peticiones se realizan a la API de OMDb y el estado de página se mantiene mientras el usuario navega.

---

## ⭐ Favoritos

Las películas marcadas como favoritas:

- Se guardan en `localStorage`
- Se muestran en una vista independiente
- Se pueden eliminar en cualquier momento
- Se mantienen aunque cierres el navegador

---

## 📦 Instalación y uso en local

1. Clonar el repositorio

```bash
git clone https://github.com/ivandiaz333/movie-search.git
```
