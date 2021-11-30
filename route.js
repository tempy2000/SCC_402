
AFRAME.registerComponent("route", {

    _route_data: null,

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
                
                // TODO:
                // 1. add state "active-route"
                // 2. hide all other routes
                
                // this.addState("route-toggled");
                // _toggle_markers();
            });
        }

        console.debug(`[route]: initialising route ${this.el.id}`);

        // Set the loaded data
        this._load_routing_data().then((res) => {
            this._route_data = { ...res };
            this.loaded = true;
            console.debug("[route]:", this._route_data);
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

        let response = await fetch(`../data/routing/path/${this.data.routePath}`);

        if (!response.ok) {
            console.error("[route]: failed to load route path", response.status);
        }

        return await response.json();
    },

    _load_route_directions: async function () {
        console.debug("[route]: loading route directions");

        let response = await fetch(`../data/routing/directions/${this.data.routeDirections}`);

        if (!response.ok) {
            console.error("[route]: failed to load route directions", response.status);
        }

        return await response.json();
    }
});