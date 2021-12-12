// The map
const map = new Mazemap.Map({
    container: "map",
    campuses: 341,
    center: { lng: -2.7922321418786713, lat: 54.01036998271985 },
    zoom: 18,
    zLevel: 1,
});

// The static route file (The Round House to Chaplaincy Centre)
const MAP_FILE = "../data/routing/path/rh-to-cc.json";

// Add map navigation controls
map.addControl(new Mazemap.mapboxgl.NavigationControl(), "bottom-right");

// Rest of functions wait for the map to load
map.on("load", () => {

    // Route Controller
    const route_controller = new Mazemap.RouteController(map, {
        routeLineColorPrimary: "#0099EA",
        routeLineColorSecondary: "#888888",
    });

    // BlueDot
    const blueDot = new Mazemap.BlueDot({
        map: map
    })
        .setAccuracy(10)
        .show();

    // Location Controller
    const location_controller = new Mazemap.LocationController({
        blueDot: blueDot,
        map: map
    });

    // Fetch the routing path and apply to map.
    fetch(MAP_FILE)
        .then(response => response.json())
        .then(geojson => {
            console.debug("[route-a]:", geojson);

            // Set the route
            const { path } = geojson;
            route_controller.setPath(path);

            // Fit map to bounds
            const bounds = Mazemap.Util.Turf.bbox(path);
            map.fitBounds(bounds, { padding: 100 });
        })
        .catch(err => console.error(err));

    // Follow will always centre on the BlueDot as it moves
    location_controller.setState("follow");

    // Success position watcher callback
    function watch_position_success(position) {
        const { accuracy, altitude, altitudeAccuracy, latitude, longitude } = position.coords;

        // Update map blue dot
        location_controller.updateLocationData({
            lngLat: {
                lng: longitude,
                lat: latitude
            }
        });

        // Dummy event mimicking a-frame GPS camera event to trigger logger update
        window.dispatchEvent(new CustomEvent("gps-camera-update-position", {
            detail: {
                position: { accuracy, altitude, altitudeAccuracy, latitude, longitude }
            }
        }));
    }

    // Error position watcher callback
    function watch_position_error(err) {
        console.warn("[navigator]:", err);
    }

    // Watcher options - should help with GPS inconsistencies
    const options = {
        enableHighAccuracy: true
    };

    // Listens for change in users location
    const watcher_id = navigator.geolocation.watchPosition(watch_position_success, watch_position_error, options);
    console.debug(`[navigator]: watcher id = ${watcher_id}`);
});
