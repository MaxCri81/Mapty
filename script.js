'use strict';
/***************************************************************************** Declarations ****************************************************************************/
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
// Leaflet popup object
const leafletObj = {
    maxWidth: 250,
    minWidth: 100,
    autoClose: false,
    closeOnClick: false,
    className: "running-popup",
};
let map, mapEvent;
/**************************************************************************** Event handlers ************************************************************************/
// Geolocation coordinates
if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success, error);
// attach an event listener when submitting the form (the enter key is pressed)
form.addEventListener("submit", leafletMarker);
// attach an event listener when changing an option from the form selector 
inputType.addEventListener("change", function(){
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
})
/********************************************************************************* Functions ***************************************************************************/
/** Callback function invoked upon failing retrieving geolocation coordinates. */
function error(){
    alert("Could not get your position");
};

/**
 * Callback function invoked upon successfully retrieving geolocation coordinates.
 * Print the latitude, longitude and a google map link with these coordinates.
 * @param {Object} position - GeolocationPosition returned from geolocation API
 */
function success(position) {
    // Object destructuring
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    const coordinates = [latitude, longitude];

    // Leaflet library
    map = L.map('map').setView(coordinates, 13); // 13: zoom level

    // OpenStreetMap.HOT map style
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

    // map.on("click", leafletMarker.bind(map));
    // Attach a Leaflet event listener to the map object
    map.on("click", (event)=>{
        mapEvent = event;
        displayForm();
    });
};

function leafletMarker(event) { 
    // Prevent the default behaviour
    event.preventDefault();
    clearForm();
    const {lat, lng} = mapEvent.latlng;
  
    // Add a marker when clicking on the map
    L.marker([lat, lng])
        .addTo(map) // add the marker on the map
        .bindPopup(L.popup(leafletObj)) // on clicking to the map binds leafletObj 
        .setPopupContent("Workout") // set the popup content
        .openPopup();
};

function displayForm() {
    // Display the form
    form.classList.remove("hidden");
    // Move the focus on the input distance field
    inputDistance.focus();
};

function clearForm() {
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
};