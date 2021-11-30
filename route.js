
AFRAME.registerComponent("route", {

    route_data: null,

    schema: {
        routePath: {
            type: "string",
            default: "",
        },
        routeDirections: {
            type: "string",
            default: ""
        },
        toggleButton: {
            type: "selector",
            default: null
        }
    },

    init: function () {
        this.loaded = false;
        this.route_active = false;
        this.route_id = this.el.id;

        console.debug("[route]: initialising route", this.data);

        // Validation
        if (!this.data.routePath || !this.data.routePath) {
            console.error("[route]: invalid 'routePath' or 'routeDirections'");
            return;
        }

        // Triggers onclick listener
        if (this.data.toggleButton) {
            this.data.toggleButton.addEventListener("click", function (evt) {
                console.debug(`[route]: button was clicked!`, evt);
                
                // Toggle state
                setState
            });
        }

        console.debug(`[route]: initialising route ${this.el.id}`);

        // Set the loaded data
        this._load_routing_data().then((res) => {
            this.route_data = { ...res };
            this.loaded = true;
            console.debug("[route]:", this.route_data);
        });
    },

    _toggle_markers: function() {

    },

    _load_routing_data: async function () {
        const route_path = await this._load_route_path();
        const route_directions = await this._load_route_directions();

        return {
            ...route_path,
            ...route_directions,
        };
    },

    _load_route_path: async function () {
        console.debug("[route]: loading route path");

        let response = await fetch(`../routing/path/${this.data.routePath}`);

        if (!response.ok) {
            console.error("[route]: failed to load route path", response.status);
        }

        return await response.json();
    },

    _load_route_directions: async function () {
        console.debug("[route]: loading route directions");

        let response = await fetch(`../routing/directions/${this.data.routeDirections}`);

        if (!response.ok) {
            console.error("[route]: failed to load route directions", response.status);
        }

        return await response.json();
    }
});