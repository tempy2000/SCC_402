/**
 * https://aframe.io/docs/1.2.0/core/systems.html
 */
AFRAME.registerSystem("route", {

    // schema: {
    //     buttonA: {
    //         type: "selector",
    //         default: null,
    //     },
    //     buttonB: {
    //         type: "selector",
    //         default: null,
    //     },
    //     buttonC: {
    //         type: "selector",
    //         default: null,
    //     }
    // },

    active_route: null,

    init: function () {
        // Set initial route collection
        this.routes = [];

        // Get the buttons
        this.buttonA = document.querySelector("#btn-route-a");
        this.buttonB = document.querySelector("#btn-route-b");
        this.buttonC = document.querySelector("#btn-route-c");

        if (!this.buttonA || !this.buttonB || !this.buttonC) {
            console.error("Invalid or missing values for at least one of buttonA, buttonB, and buttonC");
            return;
        }

        // Position update listener
        this.update_position_listener = (evt) => {
            console.debug("[route-system]:", evt.detail.position);

            if (this.active_route !== null) {
                // Debug message if user too far from all points
                const entities = this.active_route.querySelectorAll("a-entity[gltf-model]");
                
                // If there are entities but none of them are visible
                if (entities.length > 0 && !Array.prototype.some.call(entities, x => x.components.visible.data)) {
                    console.debug("[route-system]: device too far no markers are visible");
                }
            }
        };

        // Register listeners
        window.addEventListener("gps-camera-update-position", this.update_position_listener);

        // Button click handler
        this.handle_click = (evt, route) => {
            console.debug("[route-system]:", evt);
            console.debug("[route-system]:", route);

            // Hide previously active route
            if (this.active_route !== null) {
                this.active_route.components.route.hide_markers();
            }

            // Update active route
            this.active_route = route;

            // Show current route
            this.active_route.components.route.show_markers();
        }

        // Button click event listeners
        this.buttonA.addEventListener("click", (evt) => this.handle_click(evt, this.routes[0]));
        this.buttonB.addEventListener("click", (evt) => this.handle_click(evt, this.routes[1]));
        this.buttonC.addEventListener("click", (evt) => this.handle_click(evt, this.routes[2]));
    },

    register: function (entity) {
        this.routes.push(entity);
    },

    unregister: function (entity) {
        const index = this.routes.indexOf(entity);
        this.routes.splice(index, 1);
    },
});