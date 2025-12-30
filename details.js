// 1. OBTENER EL ID DE LA URL
// window.location.search nos da "?id=12345"
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// 2. CONFIGURACIÓN API
const API_KEY = '58b9651f1037495de12585261637f052'; // <--- ¡PEGA TU API KEY AQUÍ DE NUEVO!
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'; // Calidad alta para detalles

// 3. SI NO HAY ID, VOLVEMOS AL INICIO (Seguridad)
if (!movieId) {
    window.location.href = 'index.html';
} else {
    // Si hay ID, buscamos los datos
    getMovieDetails(movieId);
}

async function getMovieDetails(id) {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`;
    
    const res = await fetch(url);
    const movie = await res.json();

    displayDetails(movie);
}

function displayDetails(movie) {
    const container = document.getElementById('movie-details');
    
    // Extraemos datos útiles
    // genres es un array de objetos, así que lo mapeamos para sacar solo los nombres
    const genres = movie.genres.map(genre => `<span>${genre.name}</span>`).join('');
    
    container.innerHTML = `
        <div class="details-container">
            <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/300x450'}" class="details-poster" alt="${movie.title}">
            
            <div class="details-info">
                <h1>${movie.title}</h1>
                <span class="tagline">${movie.tagline ? movie.tagline : ''}</span>
                
                <p><strong>Fecha de estreno:</strong> ${movie.release_date}</p>
                <p><strong>Calificación:</strong> ⭐ ${movie.vote_average.toFixed(1)} / 10</p>
                
                <div class="genres" style="margin: 15px 0;">
                    ${genres}
                </div>

                <h3>Sinopsis</h3>
                <p>${movie.overview}</p>
            </div>
        </div>
        
        <style>
            body {
                background-image: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('${IMG_PATH + movie.backdrop_path}');
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
            }
        </style>
    `;
}