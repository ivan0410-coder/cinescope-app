// 1. CONFIGURACIÓN DE LA API
const API_KEY = '58b9651f1037495de12585261637f052'; 

const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=es-ES`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}&query="`;

// 2. SELECCIÓN DE ELEMENTOS DEL DOM
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// 3. FUNCIÓN INICIAL: Obtener películas populares al cargar
getMovies(API_URL);

// Función asíncrona para conectar a la API
async function getMovies(url) {
    showSkeleton(); // <--- AGREGAR ESTA LÍNEA AL PRINCIPIO
    
    // Simulamos un pequeño retraso para que alcances a ver el efecto (Opcional, solo para probar)
    // await new Promise(resolve => setTimeout(resolve, 500)); 

    const res = await fetch(url);
    const data = await res.json();

    // Cuando llegan los datos reales, showMovies borra los esqueletos y pone las pelis
    showMovies(data.results);
}

// 4. RENDERIZADO EN PANTALLA
function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview, id } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        // Verificamos si esta peli YA estaba en favoritos
        const isFavorite = checkIfFavorite(id);

        movieEl.innerHTML = `
            <img src="${poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/300x450'}" alt="${title}" onclick="goToDetails(${id})">
            
            <div class="movie-info">
                <h3>${title}</h3>
                
                <button class="fav-btn-card ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${id}, '${title.replace(/'/g, "\\'")}', '${poster_path}', ${vote_average})">
                    ♥
                </button>

                <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
        `;

        main.appendChild(movieEl);
    });
}

// 5. FUNCIÓN DE COLORES (Esta era la que faltaba)
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// 6. EL BUSCADOR "EN VIVO"
search.addEventListener('input', (e) => {
    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
    } else {
        window.location.reload();
    }
});

// 7. HELPER PARA IR A DETALLES
function goToDetails(id) {
    window.location.href = `details.html?id=${id}`;
}

// 8. LÓGICA DE FAVORITOS (LocalStorage)
function toggleFavorite(id, title, poster_path, vote_average) {
    let favorites = JSON.parse(localStorage.getItem('cinescope_favorites')) || [];
    const existingIndex = favorites.findIndex(movie => movie.id === id);

    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        // alert(`❌ Eliminada de favoritos`); // Opcional: quitar alerta si molesta
    } else {
        const movieObj = { id, title, poster_path, vote_average };
        favorites.push(movieObj);
        // alert(`❤️ Añadida a favoritos`); // Opcional
    }

    localStorage.setItem('cinescope_favorites', JSON.stringify(favorites));

    // Actualizar visualmente el corazón
    const btn = event.target; 
    btn.classList.toggle('active');
}

function checkIfFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('cinescope_favorites')) || [];
    return favorites.some(movie => movie.id === id);
}

// 9. VER LISTA DE FAVORITOS
document.getElementById('fav-btn').addEventListener('click', () => {
    const favorites = JSON.parse(localStorage.getItem('cinescope_favorites')) || [];
    
    if (favorites.length === 0) {
        main.innerHTML = '<h2 style="color:white; text-align:center; width:100%; margin-top:20px;">No tienes favoritos aún 💔</h2>';
    } else {
        showMovies(favorites);
        main.insertAdjacentHTML('afterbegin', '<h2 style="color:white; text-align:center; width:100%; margin-top:20px;">Tus Películas Favoritas ❤️</h2>');
    }
});
// FUNCIÓN SKELETON: Muestra cajas grises mientras carga
function showSkeleton() {
    main.innerHTML = ''; // Limpiamos lo que haya
    
    // Creamos 12 tarjetas vacías (fantasmas)
    for(let i = 0; i < 12; i++) {
        const skeletonEl = document.createElement('div');
        skeletonEl.classList.add('movie', 'skeleton'); // Usamos la clase nueva
        
        // Estructura interna simple (simulamos imagen y texto)
        skeletonEl.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-info-block"></div>
            <div class="skeleton-info-block" style="width: 50%"></div>
        `;
        
        main.appendChild(skeletonEl);
    }
}