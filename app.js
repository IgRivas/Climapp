//Esperamoms que se cargue el dom para empezar
document.addEventListener('DOMContentLoaded', function () {
    const autocompleteInput = document.getElementById('cityInput');
    const matchList = document.getElementById('match-list');
    const temperaturaVarlor = document.getElementById('temperatura-valor');
    const temperaturaDescripcion = document.getElementById('temperatura-descripcion');
    const ubicacion = document.getElementById('ubicacion');
    const iconoAnimado = document.getElementById('icono-animado');
    const vientoVelocidad = document.getElementById('viento-velocidad');
  
    autocompleteInput.addEventListener('input', function () {
      const inputValue = autocompleteInput.value.toLowerCase();
      fetchCities(inputValue);
    });
  
    cargarPrincipal();
  
    function cargarPrincipal() {
      obtenerUbicacionActual();
    }
  
    function obtenerUbicacionActual() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
          const lon = posicion.coords.longitude;
          const lat = posicion.coords.latitude;
          obtenerClimaPorUbicacion(lat, lon);
        });
      }
    }
  
    function obtenerClimaPorUbicacion(lat, lon) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=359f4eb1804694c7e4a88200c1039b68`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => mostrarDatosClimaticos(data));
    }
  
    function fetchCities(inputValue) {
      fetch('city.list.json')
        .then(response => response.json())
        .then(ciudades => {
          const filteredCities = ciudades.filter(
            ciudad => ciudad.name.toLowerCase().startsWith(inputValue)
          );
  
          displayMatches(filteredCities.slice(0, 3));
        })
        .catch(error => console.error('Error fetching cities:', error));
    }
  
    function buscarClima(ciudad) {
      const urlByCity = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&lang=es&units=metric&appid=359f4eb1804694c7e4a88200c1039b68`;
  
      fetch(urlByCity)
        .then(response => response.json())
        .then(data => mostrarDatosClimaticos(data))
        .catch(error => console.error('Error fetching weather:', error));
    }
  
    function mostrarDatosClimaticos(data) {
      const temp = Math.round(data.main.temp);
      temperaturaVarlor.textContent = `${temp} °C`;
      const desc = data.weather[0].description;
      temperaturaDescripcion.textContent = desc.toUpperCase();
      ubicacion.textContent = data.name;
      vientoVelocidad.textContent = `${data.wind.speed} K/s`;
  
      switch (data.weather[0].main) {
        case 'Thunderstorm':
          iconoAnimado.src = 'animated/thunder.svg';
          break;
        case 'Drizzle':
          iconoAnimado.src = 'animated/rainy-2.svg';
          break;
        case 'Rain':
          iconoAnimado.src = 'animated/rainy-7.svg';
          break;
        case 'Snow':
          iconoAnimado.src = 'animated/snowy-6.svg';
          break;
        case 'Clear':
          iconoAnimado.src = 'animated/day.svg';
          break;
        case 'Atmosphere':
          iconoAnimado.src = 'animated/weather.svg';
          break;
        case 'Clouds':
          iconoAnimado.src = 'animated/cloudy-day-1.svg';
          break;
        default:
          iconoAnimado.src = 'animated/cloudy-day-1.svg';
      }
    }
  
    function displayMatches(matches) {
        // Crea un string HTML para cada ciudad en el array 'matches'
        const html = matches.map(city => `<div class='ciudad-lista'>${city.name + ', ' + city.country}</div>`).join('');
        matchList.innerHTML = html;
      
        // Agrega un event listener a cada 'div' creado
        matchList.querySelectorAll('div').forEach(item => {
          // Cuando se hace clic en un 'div', establece el valor del 'autocompleteInput' como el texto del 'div'
          item.addEventListener('click', () => {
            autocompleteInput.value = item.textContent;
            buscarClima(autocompleteInput.value);
            //Vaciamos matchlist
            matchList.innerHTML = '';
          });
        });
      }
  });
  