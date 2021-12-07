// The map
const map = new Mazemap.Map({
    container: "map",
    campuses: 341,
    center: { lng: -2.7922321418786713, lat: 54.01036998271985 },
    zoom: 18,
    zLevel: 1,
});

// Add map navigation controls
map.addControl(new Mazemap.mapboxgl.NavigationControl(), "bottom-right");

map.on("load", () => {
    const route_controller = new Mazemap.RouteController(map, {
        routeLineColorPrimary: "#0099EA",
        routeLineColorSecondary: "#888888",
    });

    const blueDot = new Mazemap.BlueDot({
        map: map,
    })
        .setAccuracy(10)
        .show();

    const locationController = new Mazemap.LocationController({
        blueDot: blueDot,
        map: map
    });

    // Register position listener (called when new route starts)
    window.addEventListener("set-active-route", (evt) => {
        const { active_route } = evt.detail;
        console.debug("[minimap]:", active_route);

        const geojson = active_route.components.route.route_data.path;
        console.debug("[minimap]:", geojson);

        // Update the minimap with the active route
        set_route(geojson);
    });

    locationController.setState('follow');

    const watchID = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        console.debug("[minimap]:", latitude, longitude);

        locationController.updateLocationData({
            lngLat: {
                lng: longitude,
                lat: latitude
            }
        });
    });

    function set_route(geojson) {
        console.debug("[minimap]:", geojson);

        // Set the route
        route_controller.setPath(geojson);

        // Set the bound to the route
        const bounds = Mazemap.Util.Turf.bbox(geojson);
        map.fitBounds(bounds, { padding: 10 });
    }
});
