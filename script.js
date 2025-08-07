'use strict';
/***************************************************************************** Declarations ****************************************************************************/
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
/************************************************************************ Parent Class - Workout **********************************************************************/
/**
 * A class that keep tracks of the workouts
 * @version 06/08/25
 */
class Workout {
    // Class fields
    date = new Date();
    id = (Date.now() + "").slice(-10); // id = the last 10 numers of a date timestamp
    /**
     * Initialize instance fields
     * @param {Array} coordinates - latitude and longitude
     * @param {number} distance in km/h
     * @param {number} duration  in minutes
     */
    constructor(coordinates, distance, duration) {
        this.coordinates = coordinates;
        this.distance = distance;
        this.duration = duration;
    }

    _setDescription() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.title = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
};
/************************************************************************ Child Class - Running **********************************************************************/
class Running extends Workout {
    // Class field
    type = "running";
    /**
     * Initialize instance fields
     * @param {Array} coordinates - latitude and longitude
     * @param {number} distance km/h
     * @param {number} duration minutes
     * @param {number} cadence steps/minute
     */
    constructor(coordinates, distance, duration, cadence) {
        super(coordinates, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    /**
     * Calculate the time taken to travel one kilometer, representing the pace
     * @returns the pace in minutes.
     */
    calcPace() {
        this.pace = this.duration / this.distance; 
        return this.pace;
    }
};
/************************************************************************ Child Class - Cycling **********************************************************************/
class Cycling extends Workout {
    // Class field
    type = "cycling";
    /**
     * Initialize instance fields
     * @param {Array} coordinates - latitude and longitude
     * @param {number} distance km/h
     * @param {number} duration minutes
     * @param {number} elevationGain meters
     */
    constructor(coordinates, distance, duration, elevationGain) {
        super(coordinates, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }

    /**
     * Calculate the distance covered in one hour, representing the travel speed 
     * @returns the speed in hour
     */
    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
};
/**************************************************************************** Class App ******************************************************************************/
/**
 * A class that monitors and manages the user interface.
 * @version 06/08/25
 */
class App {
    // Private Class fields
    #map; // Leaflet map object
    #mapEvent; // Leaflet map event
    #mapZoomLevel = 13; // Leaflet map zoom level
    #workouts = []; // Array of workout objects 
    // Constructor, initialize instance methods and handlers.
    constructor() {
        // Geolocation coordinates
        this._getPosition();
        // Attach an event listener when submitting the form (the enter key is pressed)
        form.addEventListener("submit", this._newWorkout.bind(this)); // bind the current object to "this", otherwise it will point to the form
        // Attach an event listener when changing an option from the form selector
        inputType.addEventListener("change", this._toggleEvelationField);
        // Attach an event listener when clicking a workout from the form list
        containerWorkouts.addEventListener("click", this._moveToPopup.bind(this)); // bind the current object to "this", otherwise it will point to containerWorkouts
    }

    /** Get the user current coordinates */
    _getPosition() {
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), this._error); // bind the current object to "this"
    }

    /** Callback function invoked upon failing retrieving geolocation coordinates. */
    _error() {
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
        // Leaflet library (coordinates, map zoom level)
        this.#map = L.map('map').setView(coordinates, this.#mapZoomLevel); 
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

    /** Hide the form */
    _hideForm() {
        // Clear the form
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
        // To avoid showing the form transition effect of 1ms
        form.style.display = "none";
        // Hide the form
        form.classList.add("hidden");
        // Restores the form display layout after the transition ended
        setTimeout(()=> form.style.display = "grid", 1000);
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
        // Latitude and longitude
        const {lat, lng} = this.#mapEvent.latlng;
        // Get data from the form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const cadenceElevation = type === "running" ? +inputCadence.value : +inputElevation.value;
        // Show an alert window if the inputs in the form are not positive numbers (excluding the cadence)
        if (!this._validInput(distance, duration, cadenceElevation, type)) return alert("Inputs must be positive numbers!");
        // Create the object
        const workout = type === "running" ? new Running([lat, lng], distance, duration, cadenceElevation) : new Cycling([lat, lng], distance, duration, cadenceElevation);
        // Add the object to the list
        this.#workouts.push(workout);
        // Render the marker in the map
        this._renderMarker(workout);
        // Render the workout in the form
        this._renderWorkout(workout);
        // Hide the form
        this._hideForm();
    }

    /**
     * Returns true if every input in the array is a number and a positive number, otherwise false.
     * The check for a positive number is only applied on the first 2 elements, if type is "cycling".
     * @param  {...any} inputs to be checked. All numbers with the last element being a string, the "type". 
     * @returns true if every input in the array is a number and a positive number, otherwise false
     */
    _validInput(...inputs) {
        // the last element in inputs can be "running" or "cycling"
        const type = inputs.pop();
        // Check for positive number
        const condition = (input) => input > 0;
        return inputs.every(input => Number.isFinite(input)) && // chech that input is a number
            type === "running" ? inputs.every(condition) : inputs.slice(0, -1).every(condition); // condition not applied on the last element if type is "cycling"
    }

    /**
     * Render the marker at the location where the user clicked on the map
     * @param {Object} workout - Workout object created from one of the child classes
     */
    _renderMarker(workout) {
        // Leaflet popup object
        const leafletObj = {
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`, // custom class
        };

        // Add the marker on the map
        L.marker(workout.coordinates)
            .addTo(this.#map) // add the marker on the map
            .bindPopup(L.popup(leafletObj)) // on clicking to the map binds leafletObj 
            .setPopupContent(`${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.title}`) // set the popup content
            .openPopup();
    }

    /**
     * Add an HTML elemtent in the form for the workout 
     * @param {Object} workout - Workout object created from one of the child classes
     */
    _renderWorkout(workout) {
        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.title}</h2>
                <div class="workout__details">
                    <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
        `;
        if (workout.type === "running") {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.pace.toFixed(1)}</span>
                    <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">spm</span>
                </div>
            </li>
            `;
        } 
        else {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.speed.toFixed(1)}</span>
                    <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${workout.elevationGain}</span>
                    <span class="workout__unit">m</span>
                </div>
            </li>
            `;
        }
        form.insertAdjacentHTML("afterend", html);
    }

    /**
     * Center the map on the marker corresponding to the selected workout in the form.
     * @param {Object} event - ObjectEvent returned from the containerWorkouts listener.
     * @returns null
     */
    _moveToPopup(event) {
        // Select the closest element having class "workout" when clicking on the "ul" parent having class "workouts"
        const workoutElement = event.target.closest(".workout");
        if (!workoutElement) return;
        // Find the workout with the id equal to the element data-id
        const selectedWorkout = this.#workouts.find(element => element.id === workoutElement.dataset.id);
        // Move the map
        this.#map.setView(selectedWorkout.coordinates, this.#mapZoomLevel, {
            // Object of options
            animate: true,
            pan: {
                duration: 1
            }
        });
    }
};
const app = new App();
