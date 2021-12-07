
AFRAME.registerComponent("route", {

    schema: {
        routePath: {
            type: "string",
            default: "",
        },
        routeDirections: {
            type: "string",
            default: ""
        },
        arrowScale: {
            type: "number",
            default: 1,
        },
        markerScale: {
            type: "number",
            default: 2,
        },
    },

    init: function () {
        console.debug(`[route]: initialising route ${this.data}`);

        // State
        this.loaded = false;
        this.is_active = false;
        this.route_id = this.el.id;
        this.route_data = null,
        this.arrow_scale = this.data.arrowScale;
        this.marker_scale = this.data.markerScale;

        // Register route to system
        this.system.register(this.el);

        // Validation
        if (!this.data.routePath || !this.data.routePath) {
            console.error("[route]: invalid 'routePath' or 'routeDirections'");
            return;
        }

        // Set the loaded data
        this._load_routing_data().then((res) => {
            this.route_data = { ...res };
            this.loaded = true;
            console.debug("[route]:", this.route_data);
        });

        // Bind self to remove
        this.remove.bind(this);
    },

    remove: function () {
        // Unregister route from system
        this.system.unregister(this.el);
    },

    show_markers: function () {
        console.debug(`[route]: creating route markers for ${this.route_id}`);

        // Ignore current point if equal to previous
        const equals_previous = (previous = [], current = []) => {
            if (previous === undefined || previous.length !== current.length) {
                return false;
            }

            for (let i = 0; i < previous.length; i++) {
                if (!current.includes(previous[i])) {
                    return false;
                }
            }

            return true;
        }

        // Convert path data to lat-lng points
        const points = this.route_data.path.features
            .flatMap(feature => feature.geometry.coordinates)
            .filter((point, i, array) => !equals_previous(array[i - 1], point))
            .map(point => ({ latitude: point[1], longitude: point[0] }));

        // Generate points in reverse
        const total = points.length - 1;

        for (let i = total; i >= 0; i--) {
            let marker_entity;

            if (i === total) {
                // The current point is the end of the route - place goal marker.
                marker_entity = document.createElement("a-entity");
                marker_entity.setAttribute("gltf-model", "#marker-model");

                // Rotate to always face the camera
                marker_entity.setAttribute("look-at", "[gps-projected-camera]")

                // Set appropriate scale
                marker_entity.setAttribute("scale", {
                    x: this.marker_scale,
                    y: this.marker_scale,
                    z: this.marker_scale,
                });
            } else {
                // Otherwise, place orientated arrow marker point from "current" to "target".
                marker_entity = document.createElement("a-entity");
                marker_entity.setAttribute("gltf-model", "#arrow-model");

                // Rotate to always face the target marker
                marker_entity.setAttribute("look-at", `[data-point-index="${i + 1}"]`)

                // Set appropriate scale
                marker_entity.setAttribute("scale", {
                    x: this.arrow_scale,
                    y: this.arrow_scale,
                    z: this.arrow_scale,
                });
            }
            
            // Initially all markers made not visible as gps camera distance culling can execute after
            // the initial marker render cycle.
            marker_entity.setAttribute("visible", "false");
            marker_entity.setAttribute("data-point-index", i);

            marker_entity.setAttribute("gps-projected-entity-place", {
                latitude: points[i].latitude,
                longitude: points[i].longitude
            });

            marker_entity.setAttribute('position', {
                x: 0,
                y: -10,
                z: 0
            });

            // Append to the route entity
            this.el.prepend(marker_entity);
        }
    },

    hide_markers: function () {
        console.debug(`[route]: removing route marker for ${this.route_id}`);

        this.el.querySelectorAll("a-entity[gltf-model]").forEach(marker_entity => {
            marker_entity.parentEl.removeChild(marker_entity);
        });
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

        const response = await fetch(`../data/routing/path/${this.data.routePath}`);

        if (!response.ok) {
            console.error("[route]: failed to load route path", response.status);
        }

        return await response.json();
    },

    _load_route_directions: async function () {
        console.debug("[route]: loading route directions");

        const response = await fetch(`../data/routing/directions/${this.data.routeDirections}`);

        if (!response.ok) {
            console.error("[route]: failed to load route directions", response.status);
        }

        return await response.json();
    }
});
