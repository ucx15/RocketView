function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
 }


const searchInput = document.getElementById('city-search');
const cityList = document.getElementById('city-list');


function displayCities(filteredCities) {
    cityList.innerHTML = '';

    filteredCities.forEach(city => {
        const li = document.createElement('li');

        li.addEventListener('click', () => {
            window.location.href = `city.html?name=${encodeURIComponent(city)}`;
        });

        li.textContent = titleCase(city);
        li.classList.add('city-card');

        cityList.appendChild(li);
    });
}


// List of cities
const cities = fetch('http://localhost:5000/api/cities')
    .then(response => response.json())
    .then(cities => {

        // Function to filter cities based on search query
        function filterCities() {
            const query = searchInput.value.toLowerCase();
            const filteredCities = cities.filter(city => city.toLowerCase().includes(query));
            displayCities(filteredCities);
        }

        searchInput.addEventListener('input', filterCities);
        displayCities(cities);

    })
    .catch(error => {
        console.error('Error fetching cities:', error);
    });
