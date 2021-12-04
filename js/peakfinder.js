
AFRAME.registerComponent("peakfinder", {
    init: function () {
        this.loaded = false;
        console.debug("[peakfinder]: initialising peakfinder", this.data);

        window.addEventListener("gps-camera-update-position", async (evt) => {
            if (!this.loaded) {
                console.debug("[peakfinder]: initial setup event");
                console.debug("[peakfinder]:", evt.detail.position);

                await this._load_buildings(evt.detail.position.longitude, evt.detail.position.latitude);
                this.loaded = true;
            } else {
                console.debug("[peakfinder]:", evt.detail.position);
                // this._update_buildings(evt.detail.position.longitude, evt.detail.position.latitude);
            }
        });
    },
    _load_buildings: async function (longitude, latitude) {
        // Load the buildings from local json file
        const buildings = await fetch("../buildings-data-reduced.json")
            .then(res => res.json())
            .catch(err => console.error(err));

        console.debug(`[peakfinder]: fetched ${buildings.length} buildings`);

        // Create new a-text entity for each feature
        buildings.forEach(feature => {

            // Convert "feature" into a centralised poi and extract name
            const { lng: longitude, lat: latitude } = Mazemap.Util.getPoiLngLat(feature.geometry);
            const { name } = feature.properties;
            const scale = 20;//50;

            console.debug(`[peakfinder]: ${name} (latitude = ${latitude}, longitude = ${longitude})`);

            // Create gltf marker entity
            const marker_entity = document.createElement("a-entity");
            marker_entity.setAttribute("look-at", "[gps-projected-camera]");
            marker_entity.setAttribute('gltf-model', "#marker-model");
            marker_entity.setAttribute("scale", {
                x: scale,
                y: scale,
                z: scale
            });
            marker_entity.setAttribute("gps-projected-entity-place", {
                latitude: latitude,
                longitude: longitude
            });

            // Distance update listener
            marker_entity.addEventListener("gps-entity-place-update-position", (evt) => {
                // console.debug(`distance:        ${evt.detail.distance}`);
                // console.debug(`distance >= 150: ${evt.detail.distance >= 150}`);
                // console.debug(`distance <  150: ${evt.detail.distance < 150}`);
                // console.debug(`is visible:      ${evt.target.hasAttribute("visible")}`);
                // console.debug(`is not visible:  ${!evt.target.hasAttribute("visible")}`)

                // if (evt.detail.distance >= 150 && evt.target.hasAttribute("visible")) {
                //     evt.target.setAttribute("visible", false);
                //     console.debug(`[peakfinder]: ${evt.detail.distance} >= 150 so hiding a-entity`);
                // } else if (evt.detail.distance < 150 && !evt.target.hasAttribute("visible")) {
                //     evt.target.setAttribute("visible", "");
                //     console.debug(`[peakfinder]: ${evt.detail.distance} < 150 so showing a-entity`);
                // }

                // marker_entity.getAttribute("visible");
                // console.debug(`marker entity distance updated: ${detail.distance}`);
            });

            // Append gltf marker entity to scene
            this.el.appendChild(marker_entity);

            console.debug(`[peakfinder]: appended gltf marker entity to scene`);

            // Create a-text entity
            // const entity = document.createElement("a-text");
            // entity.setAttribute("look-at", "[gps-projected-camera]");
            // entity.setAttribute("value", name);
            // entity.setAttribute("scale", {
            //     x: scale,
            //     y: scale,
            //     z: scale
            // });
            // entity.setAttribute("gps-projected-entity-place", {
            //     latitude: latitude,
            //     longitude: longitude
            // });

            // Append a-text entity to scene
            // this.el.appendChild(entity);


            console.debug(`[peakfinder]: appended a-text entity to scene`);
        });
    },
    _update_visibility: function (distance) {

    },
    _update_buildings: function (longitude, latitude) {
        this.el.querySelectorAll("a-entity")
    }
});

// this._load_buildings(event.detail.position.longitude, event.detail.position.latitude);
