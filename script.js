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
/**************************************************************************** Class App ******************************************************************************/
/**
 * A class that monitors and manages application methods and event handlers.
 * @version 05/08/25
 */
class App {
    // Private Class fields
    #map;
    #mapEvent;
    // Constructor, initialize instance methods and handlers.
    constructor() {
        // Geolocation coordinates
        this._getPosition();
        // Attach an event listener when submitting the form (the enter key is pressed)
        form.addEventListener("submit", this._newWorkout.bind(this)); // bind the current object to "this", otherwise it will point to the form
        // Attach an event listener when changing an option from the form selector
        inputType.addEventListener("change", this._toggleEvelationField);
    }

    /** Get the user current coordinates */
    _getPosition() {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), this.error); // bind the current object to "this"
    }

    /** Callback function invoked upon failing retrieving geolocation coordinates. */
    error() {
        alert("Could not get your position");
    }

    /**
     * Callback function invoked upon successfully retrieving geolocation coordinates.
     * Create a map with the coordinates and attach a click event listener to the map. 
     * @param {Object} position - GeolocationPosition returned from geolocation API
     */
    _loadMap(position) {
        // Object destructuring
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        const coordinates = [latitude, longitude];
        // Leaflet library
        this.#map = L.map('map').setView(coordinates, 13); // 13: zoom level
        // OpenStreetMap.HOT map style
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }).addTo(this.#map);
        // Attach a Leaflet event listener to the map object
        this.#map.on("click", this._showForm.bind(this));
    }

    /**
     * Callback function triggered when the map is clicked.
     * Display the Mapty form.
     * @param {Object} event - PointerEvent returned from the map listener "on"
     */
    _showForm(event) {
        // Store the event
        this.#mapEvent = event;
        // Display the form
        form.classList.remove("hidden");
        // Move the focus on the input distance field
        inputDistance.focus();
    }
    
    /** Displays the input field associated with the selected form option */
    _toggleEvelationField() {
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    }

    /**
     * Add a custom marker at the location where the user clicked on the map
     * @param {Object} event - SubmitEvent returned from the form listener.
     */
    _newWorkout(event) {
        // Prevent the default behaviour
        event.preventDefault();
        // Clear the form
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
        const {lat, lng} = this.#mapEvent.latlng;
        // Add a marker when clicking on the map
        L.marker([lat, lng])
            .addTo(this.#map) // add the marker on the map
            .bindPopup(L.popup(leafletObj)) // on clicking to the map binds leafletObj 
            .setPopupContent("Workout") // set the popup content
            .openPopup();
    }
};
const app = new App();