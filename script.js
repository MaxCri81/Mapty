'use strict';

// prettier-ignore
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

// Geolocation coordinates
if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success, error);

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
    const map = L.map('map').setView(coordinates, 13); // 13: zoom level

    // OpenStreetMap.HOT map style
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

    // Attach a Leaflet event listener to the map object
    // map.on("click", (mapEvent)=> {
    //     console.log(mapEvent);
        
    //     const {lat, lng} = mapEvent.latlng;

    //     // Add a marker when clicking on the map
    //     L.marker([lat, lng])
    //         .addTo(map) // add the marker
    //         .bindPopup(L.popup(leafletObj)) // on clicking to the map binds leafletObj 
    //         .setPopupContent("Workout") // set the popup content
    //         .openPopup();
    // });
    map.on("click", leafletMarker.bind(map));
};

/** Callback function invoked upon failing retrieving geolocation coordinates. */
function error(){
    alert("Could not get your position");
};


function leafletMarker(mapEvent) {
    const {lat, lng} = mapEvent.latlng;
  
    // Add a marker when clicking on the map
    L.marker([lat, lng])
        .addTo(this) // add the marker to the map (I binded the map to "this")
        .bindPopup(L.popup(leafletObj)) // on clicking to the map binds leafletObj 
        .setPopupContent("Workout") // set the popup content
        .openPopup();
};