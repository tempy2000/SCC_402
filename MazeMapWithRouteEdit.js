// The map
const map = new Mazemap.Map({
    container: "map",
    campuses: 341,
    center: { lng: -2.7922321418786713, lat: 54.01036998271985 },
    zoom: 18,
    zLevel: 1,
});

let lng;
let lat;

/*navigator.geolocation.getCurrentPosition(function(position){
  lng = position.coords.longitude;
  lat = position.coords.latitude;
  
  console.log(lng);
  console.log(lat);
})*/


// Add map navigation controls
map.addControl(new Mazemap.mapboxgl.NavigationControl());

// Placeholder start and end points using lat-long
const p2 = { lngLat: { lng: -2.784581, lat: 54.005382 }, zLevel: map.zLevel };

// Route controller will be set after the map has loaded
let route_controller;
var trigger = true;

map.on("load", () => {
    route_controller = new Mazemap.RouteController(map, {
        routeLineColorPrimary: "#0099EA",
        routeLineColorSecondary: "#888888",
    });

    // Set the route
    //set_route(p1, p2);
    
  /*const blueDot = new Mazemap.BlueDot({
    map : map,
  }).setLngLat({lng : lng, lat : lat})
    .setZLevel(1)
    .setAccuracy(10)
    .show();
  */
              
    //BlueDot
  const blueDot = new Mazemap.BlueDot({
      map : map
  })
     .setAccuracy(10)
     .show();
    
  var locationController = new Mazemap.LocationController({
    blueDot: blueDot,
    map: map
  });
  locationController.setState('follow'); 
  const watchId = navigator.geolocation.watchPosition(position => {
      
    const { latitude, longitude } = position.coords;
    
    
    locationController.updateLocationData({
        lngLat: {
            lng: longitude,
            lat: latitude
        }
    })
      
    if(trigger) {
        set_route({ lngLat: { lng: longitude, lat: latitude }, zLevel: map.zLevel }, p2);
        trigger = false;
    }
  });
    //map.flyTo({center:{lng : longitude, lat : latitude}, zoom: 18});
    // Show a map centered at latitude / longitude.

  /*navigator.geolocation.getCurrentPosition(function(position){
    lng = position.coords.longitude;
    lat = position.coords.latitude;
  */

  
});

function set_route(p1, p2) {
    // Remove previous route if present
    route_controller.clear();

    // Get route and show if succesful
    Mazemap.Data.getRouteJSON(p1, p2).then((geojson) => {
        console.log(geojson);

        // Set the route
        route_controller.setPath(geojson);

        // Fit the map bounds to the path bounds
        let bounds = Mazemap.Util.Turf.bbox(geojson);
        map.fitBounds(bounds, { padding: 100 });
    });
};

// Get and set the route

