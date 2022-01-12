const turf = require("@turf/turf");

const DEBUG_MODE = false;
const LONG_SLEEP = DEBUG_MODE ? 1000 : 3000;
const SHORT_SLEEP = DEBUG_MODE ? 500 : 1500;

const route_markers = {
    a: { origin: null, target: null, bbox: null },
    b: { origin: null, target: null, bbox: null },
    c: { origin: null, target: null, bbox: null },
};

function pad(i) {
    return ('0' + i).slice(-2);
}

const map = new Mazemap.Map({
    container: "map",

    // If campuses is set to null then the building names don't render
    campuses: 341,
    // campuses: null,

    center: { lng: -2.7846447, lat: 54.0128025 },
    // bearing: 90,
    zoom: 17,
    zLevel: 1,
    zLevelControl: false,
    //scrollZoom: false,
    doubleClickZoom: false,
    touchZoomRotate: false,

    // To enable taking screenshots properly
    preserveDrawingBuffer: true
});

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function screenshot({ filename = "image.png", directory = "" } = {}) {
    console.log(`taking screenshot: ${filename}`);

    if (!DEBUG_MODE) {
        // Screenshot the map canvas and send generated image to the rest-server
        html2canvas(document.querySelector("#map")).then(canvas => {
            document.body.appendChild(canvas);
            return canvas;
        }).then(canvas => {
            const image = canvas.toDataURL("image/png").replace("data:image/png;base64", "");
            const stringified = JSON.stringify({
                filename: filename,
                directory: directory,
                imageData: image
            });

            canvas.remove();

            // Send screenshot to server
            console.debug("sending screenshot to server");
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/upload-screenshot",
                data: stringified,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    console.log("response:", msg);
                }
            });
        });
    }
}

function getParticipantId(study_iteration) {
    switch (study_iteration) {
        case 0: return { id: 1, removed: true };
        case 1: return { id: 2, removed: false };
        case 2: return { id: 3, removed: false };
        case 3: return { id: 4, removed: false };
        case 4: return { id: 5, removed: true };
        case 5: return { id: 7, removed: false };
        case 6: return { id: 1, removed: false };
        case 7: return { id: 5, removed: false };
        case 8: return { id: 6, removed: false };
        case 9: return { id: 8, removed: false };
        case 10: return { id: 9, removed: false };
        case 11: return { id: 10, removed: false };
        case 12: return { id: 11, removed: false };
        case 13: return { id: 12, removed: false };
        default: return { id: null, removed: false };
    }
}

function getStudyIterationIds() {
    return [13, 12, 11, 10, 9, 8, 7, 6, 5, 3, 2, 1];
}

function createLayers() {

    // GeoJSON accuracy hull source
    map.addSource("marps-accuracy-hull", { type: "geojson", data: { type: "FeatureCollection", features: [] } });

    // GeoJSON line string source
    map.addSource("marps-line-string", { type: "geojson", data: { type: "FeatureCollection", features: [] } });

    // GeoJSON accuracy hull polygon layer
    map.addLayer({
        id: "marps-accuracy-hull",
        type: "fill",
        source: "marps-accuracy-hull",
        layout: {},
        paint: {
            "fill-color": { type: "identity", property: "fill", default: "#555555" },
            "fill-opacity": { type: "identity", property: "fill-opacity", default: 0.5 },
        }
    }, "mm-building-label");

    // GeoJSON accuracy hull outline layer
    map.addLayer({
        id: "marps-accuracy-hull-outline",
        type: "line",
        source: "marps-accuracy-hull",
        layout: {
            "line-cap": "round",
        },
        paint: {
            "line-color": { type: "identity", property: "stroke", default: "#555555" },
            "line-width": { type: "identity", property: "stroke-width", default: 2 },
            "line-opacity": { type: "identity", property: "stroke-opacity", default: 1 }
        }
    }, "mm-building-label");

    // GeoJSON line string layer
    map.addLayer({
        id: "marps-line-string",
        type: "line",
        source: "marps-line-string",
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        paint: {
            "line-color": { type: "identity", property: "stroke" },
            "line-width": { type: "identity", property: "stroke-width" }
        },
    }, "mm-building-label");
}

function disableLayerVisibility() {
    // Outdoor polygon areas
    map.setLayoutProperty("mm-rooms-fill", "visibility", "none");
    map.setLayoutProperty("mm-areas-fill", "visibility", "none");

    // Points of interest markers
    map.setLayoutProperty("mm-poi-label", "visibility", "none");
    map.setLayoutProperty("poi-label", "visibility", "none");

    // Building markers
    map.setLayoutProperty("mm-building-label", "visibility", "none");

    // Natural interest markers
    map.setLayoutProperty("natural-point-label", "visibility", "none");

    // Name markers such as "Furness College" which are placed behind the MazeMap layers.
    map.setLayoutProperty("settlement-subdivision-label", "visibility", "none");
}

function getBoundingBox(bbox, features) {
    const bbox_ = turf.bbox(turf.featureCollection(features));

    return turf.bbox(turf.lineString([
        [bbox[0], bbox[1]], [bbox[2], bbox[3]],
        [bbox_[0], bbox_[1]], [bbox_[2], bbox_[3]]
    ]));
}

async function renderOriginalRoutes() {

    const routes = {
        a: await fetch("http://localhost:3000/routes/official/a.geojson").then(response => response.json()),
        b: await fetch("http://localhost:3000/routes/official/b.geojson").then(response => response.json()),
        c: await fetch("http://localhost:3000/routes/official/c.geojson").then(response => response.json()),
    };

    // Extract and combine line string features
    const features = [
        routes.a.features[0],
        routes.b.features[0],
        routes.c.features[0],
    ];

    // Add routes to map
    map.getSource("marps-line-string").setData({ type: "FeatureCollection", features });

    // Extract and combine markers
    const markers = [
        ...routes.a.features.slice(1),
        ...routes.b.features.slice(1),
        ...routes.c.features.slice(1),
    ];

    // Add markers to map
    markers.forEach(marker => {
        const { glyph, fill, route, type } = marker.properties;
        const { coordinates } = marker.geometry;

        new Mazemap.MazeMarker({
            zLevel: 0,
            glyph: glyph,
            color: fill,
        })
            .setLngLat({ lng: coordinates[0], lat: coordinates[1] })
            .addTo(map);

        // Persist marker meta data
        route_markers[route][type] = marker;
        console.log(route_markers[route][type]);
    });

    // Compute marker bounding box
    route_markers.a.bbox = turf.bbox(turf.featureCollection([routes.a.features[0]]));
    route_markers.b.bbox = turf.bbox(turf.featureCollection([routes.b.features[0]]));
    route_markers.c.bbox = turf.bbox(turf.featureCollection([routes.c.features[0]]));
    console.log(route_markers);

    ////////////////////////////////////////////////////////////////////////////////
    // ALL ROUTES
    ////////////////////////////////////////////////////////////////////////////////

    let bounds = turf.bbox(turf.featureCollection(features));
    map.fitBounds(bounds, { padding: { top: 50, bottom: 250, left: 150, right: 150 }, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "all-up.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection(features));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "all-side.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE A
    ////////////////////////////////////////////////////////////////////////////////

    bounds = turf.bbox(turf.featureCollection([routes.a.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "a-up.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection([routes.a.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "a-side.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE B
    ////////////////////////////////////////////////////////////////////////////////

    bounds = turf.bbox(turf.featureCollection([routes.b.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "b-up.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection([routes.b.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "b-side.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE C
    ////////////////////////////////////////////////////////////////////////////////

    bounds = turf.bbox(turf.featureCollection([routes.c.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "c-up.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection([routes.c.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "c-side.png", directory: "official-routes/without-buildings" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // RE-RUN WITH BUILDING NAMES VISIBLE
    ////////////////////////////////////////////////////////////////////////////////

    map.setLayoutProperty("mm-building-label", "visibility", "visible");

    ////////////////////////////////////////////////////////////////////////////////
    // ALL ROUTES
    ////////////////////////////////////////////////////////////////////////////////

    bounds = turf.bbox(turf.featureCollection(features));
    map.fitBounds(bounds, { padding: { top: 50, bottom: 250, left: 150, right: 150 }, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "all-up.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection(features));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "all-side.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE A
    ////////////////////////////////////////////////////////////////////////////////

    bounds = turf.bbox(turf.featureCollection([routes.a.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "a-up.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection([routes.a.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "a-side.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE B
    ////////////////////////////////////////////////////////////////////////////////

    bounds = turf.bbox(turf.featureCollection([routes.b.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "b-up.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection([routes.b.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "b-side.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE C
    ////////////////////////////////////////////////////////////////////////////////

    bounds = turf.bbox(turf.featureCollection([routes.c.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "c-up.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);

    bounds = turf.bbox(turf.featureCollection([routes.c.features[0]]));
    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "c-side.png", directory: "official-routes/with-buildings" });
    await sleep(SHORT_SLEEP);
}

async function renderAccuracyHullRoutes() {
    for (const study_iteration of getStudyIterationIds()) {

        // Convert study iteration to participant id
        const participant_id = getParticipantId(study_iteration).id;

        const routes = {
            a: {
                route: await fetch(`http://localhost:3000/iterations/${study_iteration}/a`).then(response => response.json()),
                hull: await fetch(`http://localhost:3000/accuracy-hulls/${study_iteration}/a`).then(response => response.json()),
            },
            b: {
                route: await fetch(`http://localhost:3000/iterations/${study_iteration}/b`).then(response => response.json()),
                hull: await fetch(`http://localhost:3000/accuracy-hulls/${study_iteration}/b`).then(response => response.json()),
            },
            c: {
                route: await fetch(`http://localhost:3000/iterations/${study_iteration}/c`).then(response => response.json()),
                hull: await fetch(`http://localhost:3000/accuracy-hulls/${study_iteration}/c`).then(response => response.json()),
            }
        };

        // Extract and combine line string features
        const features = [
            routes.a.route.features[0],
            routes.b.route.features[0],
            routes.c.route.features[0],
        ];

        // Extract and combine markers
        const hulls = [
            ...routes.a.hull.features,
            ...routes.b.hull.features,
            ...routes.c.hull.features,
        ];

        // Add routes to map
        map.getSource("marps-accuracy-hull").setData({ type: "FeatureCollection", features: hulls });

        // Add routes to map
        map.getSource("marps-line-string").setData({ type: "FeatureCollection", features });

        ////////////////////////////////////////////////////////////////////////////////
        // ROUTE A
        ////////////////////////////////////////////////////////////////////////////////

        let bounds = getBoundingBox(route_markers.a.bbox, routes.a.hull.features);
        map.fitBounds(bounds, { padding: 100, bearing: -90 });

        await sleep(LONG_SLEEP);
        screenshot({ filename: "a-up.png", directory: `accuracy-hulls/${pad(participant_id)}` });
        await sleep(SHORT_SLEEP);

        map.fitBounds(bounds, { padding: 100, bearing: 0 });

        await sleep(SHORT_SLEEP);
        screenshot({ filename: "a-side.png", directory: `accuracy-hulls/${pad(participant_id)}` });
        await sleep(SHORT_SLEEP);

        ////////////////////////////////////////////////////////////////////////////////
        // ROUTE B
        ////////////////////////////////////////////////////////////////////////////////

        bounds = getBoundingBox(route_markers.b.bbox, routes.b.hull.features);
        map.fitBounds(bounds, { padding: 100, bearing: -90 });

        await sleep(LONG_SLEEP);
        screenshot({ filename: "b-up.png", directory: `accuracy-hulls/${pad(participant_id)}` });
        await sleep(SHORT_SLEEP);

        map.fitBounds(bounds, { padding: 100, bearing: 0 });

        await sleep(SHORT_SLEEP);
        screenshot({ filename: "b-side.png", directory: `accuracy-hulls/${pad(participant_id)}` });
        await sleep(SHORT_SLEEP);

        ////////////////////////////////////////////////////////////////////////////////
        // ROUTE C
        ////////////////////////////////////////////////////////////////////////////////

        bounds = getBoundingBox(route_markers.c.bbox, routes.c.hull.features);
        map.fitBounds(bounds, { padding: 100, bearing: -90 });

        await sleep(LONG_SLEEP);
        screenshot({ filename: "c-up.png", directory: `accuracy-hulls/${pad(participant_id)}` });
        await sleep(SHORT_SLEEP);

        map.fitBounds(bounds, { padding: 100, bearing: 0 });

        await sleep(SHORT_SLEEP);
        screenshot({ filename: "c-side.png", directory: `accuracy-hulls/${pad(participant_id)}` });
        await sleep(SHORT_SLEEP);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // CLEARING ACCURACY HULLS
    ////////////////////////////////////////////////////////////////////////////////

    map.getSource("marps-accuracy-hull").setData({ type: "FeatureCollection", features: [] });
}

async function renderRouteParticipantWise() {

    const routes = {
        a: await fetch("http://localhost:3000/routes/a-all-participants.geojson").then(response => response.json()),
        b: await fetch("http://localhost:3000/routes/b-all-participants.geojson").then(response => response.json()),
        c: await fetch("http://localhost:3000/routes/c-all-participants.geojson").then(response => response.json()),
    };

    // Extract and combine line string features
    const features = [
        ...routes.a.features,
        ...routes.b.features,
        ...routes.c.features,
    ];

    // Add routes to map
    map.getSource("marps-line-string").setData({ type: "FeatureCollection", features });

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE A
    ////////////////////////////////////////////////////////////////////////////////

    let bounds = getBoundingBox(route_markers.a.bbox, routes.a.features);
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "a-up.png", directory: "participants" });
    await sleep(SHORT_SLEEP);

    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "a-side.png", directory: "participants" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE B
    ////////////////////////////////////////////////////////////////////////////////

    bounds = getBoundingBox(route_markers.b.bbox, routes.b.features);
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "b-up.png", directory: "participants" });
    await sleep(SHORT_SLEEP);

    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "b-side.png", directory: "participants" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE C
    ////////////////////////////////////////////////////////////////////////////////

    bounds = getBoundingBox(route_markers.c.bbox, routes.c.features);
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "c-up.png", directory: "participants" });
    await sleep(SHORT_SLEEP);

    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "c-side.png", directory: "participants" });
    await sleep(SHORT_SLEEP);
}

async function renderRouteInterfaceWise() {

    const routes = {
        a: await fetch("http://localhost:3000/routes/a-all-interface.geojson").then(response => response.json()),
        b: await fetch("http://localhost:3000/routes/b-all-interface.geojson").then(response => response.json()),
        c: await fetch("http://localhost:3000/routes/c-all-interface.geojson").then(response => response.json()),
    };

    // Extract and combine line string features
    const features = [
        ...routes.a.features,
        ...routes.b.features,
        ...routes.c.features,
    ];

    // Add routes to map
    map.getSource("marps-line-string").setData({ type: "FeatureCollection", features });

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE A
    ////////////////////////////////////////////////////////////////////////////////

    let bounds = getBoundingBox(route_markers.a.bbox, routes.a.features);
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "a-up.png", directory: "interfaces/combined" });
    await sleep(SHORT_SLEEP);

    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "a-side.png", directory: "interfaces/combined" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE B
    ////////////////////////////////////////////////////////////////////////////////

    bounds = getBoundingBox(route_markers.b.bbox, routes.b.features);
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "b-up.png", directory: "interfaces/combined" });
    await sleep(SHORT_SLEEP);

    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "b-side.png", directory: "interfaces/combined" });
    await sleep(SHORT_SLEEP);

    ////////////////////////////////////////////////////////////////////////////////
    // ROUTE C
    ////////////////////////////////////////////////////////////////////////////////

    bounds = getBoundingBox(route_markers.c.bbox, routes.c.features);
    map.fitBounds(bounds, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);
    screenshot({ filename: "c-up.png", directory: "interfaces/combined" });
    await sleep(SHORT_SLEEP);

    map.fitBounds(bounds, { padding: 100, bearing: 0 });

    await sleep(SHORT_SLEEP);
    screenshot({ filename: "c-side.png", directory: "interfaces/combined" });
    await sleep(SHORT_SLEEP);
}

async function renderRouteInterfaceWiseSeparate() {
    for (const interface_type of ["2d", "ar", "ar-minimap"]) {

        const routes = {
            a: await fetch(`http://localhost:3000/routes/a-${interface_type}-interface.geojson`).then(response => response.json()),
            b: await fetch(`http://localhost:3000/routes/b-${interface_type}-interface.geojson`).then(response => response.json()),
            c: await fetch(`http://localhost:3000/routes/c-${interface_type}-interface.geojson`).then(response => response.json()),
        };

        // Extract and combine line string features
        const features = [
            ...routes.a.features,
            ...routes.b.features,
            ...routes.c.features,
        ];

        // Add routes to map
        map.getSource("marps-line-string").setData({ type: "FeatureCollection", features });

        ////////////////////////////////////////////////////////////////////////////////
        // ROUTE A
        ////////////////////////////////////////////////////////////////////////////////

        let bounds = getBoundingBox(route_markers.a.bbox, routes.a.features);
        map.fitBounds(bounds, { padding: 100, bearing: -90 });

        await sleep(LONG_SLEEP);
        screenshot({ filename: "a-up.png", directory: `interfaces/${interface_type}` });
        await sleep(SHORT_SLEEP);

        map.fitBounds(bounds, { padding: 100, bearing: 0 });

        await sleep(SHORT_SLEEP);
        screenshot({ filename: "a-side.png", directory: `interfaces/${interface_type}` });
        await sleep(SHORT_SLEEP);

        ////////////////////////////////////////////////////////////////////////////////
        // ROUTE B
        ////////////////////////////////////////////////////////////////////////////////

        bounds = getBoundingBox(route_markers.b.bbox, routes.b.features);
        map.fitBounds(bounds, { padding: 100, bearing: -90 });

        await sleep(LONG_SLEEP);
        screenshot({ filename: "b-up.png", directory: `interfaces/${interface_type}` });
        await sleep(SHORT_SLEEP);

        map.fitBounds(bounds, { padding: 100, bearing: 0 });

        await sleep(SHORT_SLEEP);
        screenshot({ filename: "b-side.png", directory: `interfaces/${interface_type}` });
        await sleep(SHORT_SLEEP);

        ////////////////////////////////////////////////////////////////////////////////
        // ROUTE C
        ////////////////////////////////////////////////////////////////////////////////

        bounds = getBoundingBox(route_markers.c.bbox, routes.c.features);
        map.fitBounds(bounds, { padding: 100, bearing: -90 });

        await sleep(LONG_SLEEP);
        screenshot({ filename: "c-up.png", directory: `interfaces/${interface_type}` });
        await sleep(SHORT_SLEEP);

        map.fitBounds(bounds, { padding: 100, bearing: 0 });

        await sleep(SHORT_SLEEP);
        screenshot({ filename: "c-side.png", directory: `interfaces/${interface_type}` });
        await sleep(SHORT_SLEEP);
    }
}

async function checkLayerSources() {

    console.debug("mapbox-gl layers:", map.getStyle().layers);

    const layers_list = document.querySelector("#layers-list");
    for (const layer of map.getStyle().layers) {

        const layer_id = layer.id;
        const layer_type = layer.type;
        const visibility = map.getLayoutProperty(layer_id, "visibility");

        // Create elements
        const item = document.createElement("li");
        const cbox = document.createElement("input");
        const span = document.createElement("span");
        const text = document.createTextNode(`${layer_id} (type = ${layer_type})`);

        // Set attributes
        cbox.setAttribute("type", "checkbox");
        cbox.checked = visibility === "none";

        // Click listener
        cbox.addEventListener("click", (ev) => {
            const visibility_state = cbox.checked ? "none" : "visible";
            map.setLayoutProperty(layer_id, "visibility", visibility_state);
            console.log("toggled", layer_id, "to", visibility_state);
        });

        // Set children
        item.appendChild(cbox);
        span.appendChild(text);
        item.appendChild(span);

        // Append to list
        layers_list.appendChild(item);
    }


    const routes = {
        a: await fetch("http://localhost:3000/routes/official/a.geojson").then(response => response.json()),
        b: await fetch("http://localhost:3000/routes/official/b.geojson").then(response => response.json()),
        c: await fetch("http://localhost:3000/routes/official/c.geojson").then(response => response.json()),
    };

    // Extract and combine line string features
    const features = [
        routes.a.features[0],
        routes.b.features[0],
        routes.c.features[0],
    ];

    // Get bounding box for routes
    const bbox = turf.bbox(turf.featureCollection(features));
    map.fitBounds(bbox, { padding: 100, bearing: -90 });

    await sleep(LONG_SLEEP);

    console.debug("mapbox-gl sources:", map.getStyle().sources);

    console.log(map.getLayer("settlement-subdivision-label"));
}

map.on("load", async () => {
    console.log("map loaded");

    // Create custom layers
    createLayers();

    // Turning off certain properties to make the map more readable
    disableLayerVisibility();

    // Used to show mapping layers (testing only)
    if (DEBUG_MODE) {
        await checkLayerSources();
    }

    // Run original routes render scenario
    await renderOriginalRoutes();

    // Run interfaces render scenario
    await renderAccuracyHullRoutes();

    // Run interfaces render scenario
    await renderRouteParticipantWise();

    // Run interfaces render scenario
    await renderRouteInterfaceWise();

    // Run interfaces render scenario
    await renderRouteInterfaceWiseSeparate();

    // Show success message on complete
    alert("finished");
});
