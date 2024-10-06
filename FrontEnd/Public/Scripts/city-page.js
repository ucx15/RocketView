
// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const cityName = urlParams.get('name');

if  (!cityName) {
    window.location.replace('/home.html');
}


// API
const apiURL = `http://localhost:5000/api/city/${cityName}`;


// DOM elements
const imageGallery = document.getElementById('image-gallery');



// Render city name
document.getElementById('city-name').textContent = cityName.toUpperCase();


// OSM maps
function getCoordinates(city, callback) {
    // Function to fetch latitude and longitude from a city name using Nominatim

    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                var lat = parseFloat(data[0].lat);
                var lon = parseFloat(data[0].lon);
                callback(lat, lon);
            }
        })
        .catch(error => console.error('Error:', error));
}
function initializeMap(lat, lon) {
    // Function to initialize the map at specific coordinates
    var map = new ol.Map({
        target: 'OSM-map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM() // OpenStreetMap tiles
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([lon, lat]), // Center at the obtained coordinates
            zoom: 11 // Zoom level
        })
    });
}

fetch(`${apiURL}/data`)
    .then(response => response.status === 404 ? Promise.reject('City not found') : response.json())
    .then(cityData => {

        // Populate about section
        document.getElementById('about-city').textContent = cityData.about;

        // Populate places to visit
        const placesList = document.getElementById('places-to-visit');
        cityData.placesToVisit.forEach(place => {
            const li = document.createElement('li');
            li.textContent = place;
            placesList.appendChild(li);
        });

        // Populate hotels
        const hotelsList = document.getElementById('hotels-list');
        cityData.hotels.forEach(hotel => {
            const li = document.createElement('li');
            li.textContent = hotel;
            hotelsList.appendChild(li);
        });

        // Populate restaurants
        const restaurantsList = document.getElementById('restaurants-list');
        cityData.restaurants.forEach(restaurant => {
            const li = document.createElement('li');
            li.textContent = restaurant;
            restaurantsList.appendChild(li);
        });

        // Populate how to reach section
        document.getElementById('how-to-reach').textContent = cityData.howToReach;

        // Populate visitor reviews
        const reviewsDiv = document.getElementById('reviews');
        cityData.reviews.forEach(review => {
            const p = document.createElement('p');
            p.textContent = review;
            reviewsDiv.appendChild(p);
        });

        // Populate images
        fetch(`${apiURL}/images`).
            then(response => response.json()).
            then(resp => resp.nImages).
            then(nImages => {

                for (let i = 1; i <= nImages; i++) {
                    fetch(`${apiURL}/images/${i}`)
                        .then(response => response.status === 404 ? Promise.reject('Image not found') : response.blob())
                        .then(imageBlob => {
                            const img = document.createElement('img');

                            img.loading = 'lazy';
                            img.alt = `Image ${i}`;
                            img.src = URL.createObjectURL(imageBlob);

                            imageGallery.appendChild(img);
                        })
                        .catch(error => {
                            console.error('Error fetching image:', error);
                        });
                }
            })



    })

    .catch(error => {
        console.error('Error fetching city data:', error);
    })
    .finally(() => {
        // maps
        getCoordinates(cityName, (lat, lon) => {
            initializeMap(lat, lon);
        });
    });
