var app_id = "";
var route_id = "";

function setAppId(id) {
    app_id = id;
}

function setRouteId(id) {
    route_id = id;
}

/**
 * https://aframe.io/docs/1.2.0/core/systems.html
 */
 AFRAME.registerComponent("logger", {

    schema: {
        interval: {
            type: "number",
            default: 2000,
        },
        batched: {
            type: "boolean",
            default: true,
        },
        batchSize: {
            type: "number",
            default: 60, // e.g. 1 post every 2 minutes?
        },
    },

    is_logging: false,
    ssid: null,
    active_route_id: null,

    orientation: {
        absolute: null,
        alpha: null,
        beta: null,
        gamma: null
    },

    position: {
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        latitude: null,
        longitude: null,
    },

    logger_collection: {
        ssid: null,
        app_id : null,
        route_id: null,
        start: null,
        end: null,
        measurements: [],
    },

    init: function () {
        
        // Initialise the session id
        this.ssid = init_session();
        console.debug("[logger]: ssid =", this.ssid);

        // State
        this.interval = this.data.interval;
        this.batched = this.data.batched;
        this.batch_size = this.data.batchSize;
        this.current_batch = 0;

        // Get the toggle button
        this.button = document.querySelector("#btn-toggle-logging");

        // Validation
        if (!this.button) {
            console.error("[logger]: toggle logging button missing");
            return;
        }

        // Position update handler
        this.update_position_listener = (evt) => {
            const { accuracy, altitude, altitudeAccuracy, latitude, longitude } = evt.detail.position;

            this.position = {
                accuracy: accuracy,
                altitude: altitude,
                altitudeAccuracy: altitudeAccuracy,
                latitude: latitude,
                longitude: longitude,
            };
        };

        // Device orientation handler
        this.device_orientation_listener = (evt) => {
            const { absolute, alpha, beta, gamma } = evt;

            this.orientation = {
                absolute: absolute,
                alpha: alpha,
                beta: beta,
                gamma: gamma,
            };
        };

        // Button click handler
        this.button_click_listener = (evt) => {

            // Prevent logging without first selecting a route
            if (route_id === "" && this.active_route_id === null) {
                console.error("[logger]: preventing logging whilst route not selected");
                window.alert("A route must be selected before logging")
                return;
            }

            // Toggle state
            this.is_logging = !this.is_logging;

            // Toggle interval logging
            if (this.is_logging) {

                // Notify logging started
                window.dispatchEvent(new CustomEvent("logging-started"));

                // Initiate logger collection
                const timestamp = Date.now();

                this.logger_collection = {
                    ssid: this.ssid,
                    app_id: app_id,
                    route_id: route_id === "" ? this.active_route_id : route_id,
                    start: timestamp,
                    end: timestamp,
                    ...(this.batched && { batch: this.current_batch }),
                    measurements: [],
                };

                // Create interval task
                this.interval_id = setIntervalImmediately(this.log.bind(this), this.interval);
            } else {
                // Remove interval task
                window.clearInterval(this.interval_id);

                // Append end timestamp to logger collection
                const timestamp = Date.now();

                const results = {
                    ...this.logger_collection,
                    end: timestamp,
                };

                // Send results
                this.send(results);

                // Reset collection
                this.logger_collection = {};

                // Reset the batch counter
                if (this.batched) {
                    this.current_batch = 0;
                }

                // Notify logging terminated
                window.dispatchEvent(new CustomEvent("logging-terminated"));
            }

            console.debug("[logger]: logging state = ", this.is_logging);
        }

        // Active route handler
        this.set_active_route_listener = (evt) => {
            const { id } = evt.detail;
            this.active_route_id = id;
            console.debug(`[logger]: active route set to ${this.active_route_id}`);
        };

        // Listeners
        window.addEventListener("gps-camera-update-position", this.update_position_listener, false);
        window.addEventListener("deviceorientation", this.device_orientation_listener, false);
        window.addEventListener("set-active-route", this.set_active_route_listener, false);
        this.button.addEventListener("click", this.button_click_listener, false);

        // Bind self to remove
        this.remove.bind(this);
    },

    remove: function () {
        this.button.removeEventListener("click", this.button_click_listener);
        window.removeEventListener("set-active-route", this.set_active_route_listener);
        window.removeEventListener("deviceorientation", this.device_orientation_listener);
        window.removeEventListener("gps-camera-update-position", this.update_position_listener);
    },

    log: function () {
        const timestamp = Date.now();

        const measurement = {
            position: { ...this.position },
            orientation: { ...this.orientation },
            timestamp: timestamp,
        };

        // Append current measurement to collection
        this.logger_collection.measurements.push(measurement);
        // console.debug(`[logger]: measurements = ${this.logger_collection.measurements.length}`, measurement);

        if (this.batched && this.logger_collection.measurements.length >= this.batch_size) {

            // Clone the current batch and set the end time
            const results = {
                ...this.logger_collection,
                end: timestamp,
            };

            // Send the current batch
            this.send(results);

            // Increment the batch counter
            this.current_batch++;

            // Reset logger collection
            this.logger_collection = {
                ssid: this.ssid,
                app_id: app_id,
                route_id: route_id === "" ? this.active_route_id : route_id,
                start: timestamp,
                end: timestamp,
                batch: this.current_batch,
                measurements: [],
            };
        }
    },

    send: function (data) {
        // TODO: add send to server functionality
        console.debug("[logger]: sending logging data to server", data);
        const xhr = new XMLHttpRequest();
        const uri = "submit.php";

        xhr.open("POST", uri, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        const json = JSON.stringify(data);
        xhr.send(json);
    },
});
