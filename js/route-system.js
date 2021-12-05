/**
 * https://aframe.io/docs/1.2.0/core/systems.html
 */
AFRAME.registerSystem("route", {

    init: function () {
        // Set initial route collection
        this.routes = [];
        this.active_route = null;
        this.is_logging = false;

        // Get the buttons
        this.button_a = document.querySelector("#btn-route-a");
        this.button_b = document.querySelector("#btn-route-b");
        this.button_c = document.querySelector("#btn-route-c");

        // Validate buttons
        if (!this.button_a || !this.button_b || !this.button_c) {
            console.error("[route-system]: invalid or missing values for at least one of 'buttonA', 'buttonB', and 'buttonC'");
            return;
        }

        // Button click handler
        this.update_route = (route) => {

            // Validate
            if (this.is_logging) {
                console.error("[route-system]: cannot change route whilst logging session currently active");
                window.alert("Route cannot be changed whilst a logging session is currently active")
                return;
            }

            // Hide previously active route
            if (this.active_route !== null) {
                this.active_route.components.route.hide_markers();
            }

            // Update the active route
            this.active_route = route;
        
            // Dispatch set active route event
            window.dispatchEvent(new CustomEvent("set-active-route", { detail: { id: this.active_route.id } }));

            // Show active route
            this.active_route.components.route.show_markers();
        };        

        // Logging started handler
        this.logging_started_listener = () => {
            this.is_logging = true;
        };

        // Logging terminated handler
        this.logging_terminated_listener = () => {
            this.is_logging = false;
        };

        // Register listeners
        this.button_a.addEventListener("click", () => this.update_route(this.routes[0]));
        this.button_b.addEventListener("click", () => this.update_route(this.routes[1]));
        this.button_c.addEventListener("click", () => this.update_route(this.routes[2]));

        window.addEventListener("logging-started", this.logging_started_listener, false);
        window.addEventListener("logging-terminated", this.logging_terminated_listener, false);

        // Bind self to remove
        this.remove.bind(this);
    },

    remove: function() {
        window.removeEventListener("logging-started", this.logging_started_listener);
        window.removeEventListener("logging-terminated", this.logging_terminated_listener);
    },

    register: function (entity) {
        this.routes.push(entity);
    },

    unregister: function (entity) {
        const index = this.routes.indexOf(entity);
        this.routes.splice(index, 1);
    },
});