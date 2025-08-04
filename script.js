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

    // OpenStreetMap.HOT style
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

    L.marker(coordinates).addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();
};

/** Callback function invoked upon failing retrieving geolocation coordinates. */
function error(){
    alert("Could not get your position");
};