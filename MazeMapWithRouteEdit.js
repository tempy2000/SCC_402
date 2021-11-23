fetch("../routeData.json")
.then(response => {
   return response.json();
})
.then(jsondata => console.log(jsondata));

AFRAME.registerComponent('peakfinder', {
    init: function() {
        this.loaded = false;
        //alert(this.loaded);
        window.addEventListener('gps-camera-update-position', e => {
            if(this.loaded === false) {
                //alert("Running");
                this._loadPeaks(e.detail.position.longitude, e.detail.position.latitude);
                this.loaded = true;
            }
        });
    },
    _loadPeaks: function(longitude, latitude) {
        //alert("Load Peaks");
       const scale = 5;
       fetch("../routeData.json")
       .then(response => {
          return response.json();
       })
       .then ( json => {
          //let cone = null;

         json.features.forEach(feature => {
           let entity = document.createElement('a-cone');
           if (feature.geometry.type === "Point") {
             console.log("Point")
             //console.log(feature.geometry.coordinates[0]);
             //entity.setAttribute('look-at', '[gps-projected-camera]');
             //entity.setAttribute('value', json[key].properties.name);

              entity.setAttribute('scale', {
                 x: scale,
                 y: scale,
                 z: scale
             });
             /*entity.object3D.rotation.set(
                THREE.Math.degToRad(20),
                THREE.Math.degToRad(180),
                THREE.Math.degToRad(45)
              );*/
             entity.setAttribute('gps-projected-entity-place', {
                 latitude: feature.geometry.coordinates[1],
                 longitude: feature.geometry.coordinates[0]
             });

           } else {
             console.log("Not Point")
             let x = 0
             feature.geometry.coordinates.forEach(coordinates => {
               entity.setAttribute('scale', {
                   x: scale,
                   y: scale,
                   z: scale
               });
               /*entity.object3D.rotation.set(
                  THREE.Math.degToRad(20),
                  THREE.Math.degToRad(180),
                  THREE.Math.degToRad(45)
                );*/
               entity.setAttribute('gps-projected-entity-place', {
                   latitude: feature.geometry.coordinates[x][1],
                   longitude: feature.geometry.coordinates[x][0]
               });

               this.el.appendChild(entity);
               x = x + 1
               entity = document.createElement('a-cone');
             })
           }
           //cone = entity;
           this.el.appendChild(entity);
           _editRotation(entity);
           //alert("Apparently Done")
           //console.log(feature.geometry.coordinates[0]);

         })
       });
   },
   _editRotation: function(entity) {
     let cone = document.getElementsByClassName('a-cone').slice(-1)

     let conePosition = cone.getAttribute('gps-projected-entity-place');
     let entityPosition = entity.getAttribute('gps-projected-entity-place');
     let lngDelta = conePosition.longitude - entityPosition.longitude;
     let latDelta = conePosition.latitude - entityPosition.latitude;
     let angle = Math.atan2(latDelta, lngDelta) * 180 / Math.PI;

     cone.object3D.rotation.set(
        THREE.Math.degToRad(0),
        THREE.Math.degToRad(0),
        THREE.Math.degToRad(angle)
      );
   }
    /*_loadPeaks: function(longitude, latitude) {
       const scale = 2000;
       fetch(`https://www.hikar.org/fm/ws/bsvr.php?bbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}&outProj=4326&format=json&poi=natural`
           )
       .then ( response => response.json() )
       .then ( json => {
           json.features.filter ( f => f.properties.natural == 'peak' )
               .forEach ( peak => {
                   const entity = document.createElement('a-text');
                   entity.setAttribute('look-at', '[gps-projected-camera]');
                   entity.setAttribute('value', peak.properties.name);
                   entity.setAttribute('scale', {
                       x: scale,
                       y: scale,
                       z: scale
                   });
                   entity.setAttribute('gps-projected-entity-place', {
                       latitude: peak.geometry.coordinates[1],
                       longitude: peak.geometry.coordinates[0]
                   });
                   this.el.appendChild(entity);
               });
       });
   }*/
});

// The map
//<!-- include aframe -->
//<!-- with location based, use aframe v0.9.2 -->
//include("https://aframe.io/releases/0.9.2/aframe.min.js")
//<!-- include ar.js -->
//include("https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js")
/*
const map = new Mazemap.Map({
    container: "map",
    campuses: 341,
    center: { lng: -2.7922321418786713, lat: 54.01036998271985 },
    zoom: 18,
    zLevel: 1,
});

let lng;
let lat;
*/
/*navigator.geolocation.getCurrentPosition(function(position){
  lng = position.coords.longitude;
  lat = position.coords.latitude;

  console.log(lng);
  console.log(lat);
})*/
/*

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
    */
  /*const blueDot = new Mazemap.BlueDot({
    map : map,
  }).setLngLat({lng : lng, lat : lat})
    .setZLevel(1)
    .setAccuracy(10)
    .show();
  */

    //BlueDot
    /*
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

    var testElement = document.querySelector("body > ascene > a-text")

    testElement.setAttribute("gps-entity-place", "latitude: " + latitude + "; longitude: " + longitude + ";")

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
  });*/
    //map.flyTo({center:{lng : longitude, lat : latitude}, zoom: 18});
    // Show a map centered at latitude / longitude.

  /*navigator.geolocation.getCurrentPosition(function(position){
    lng = position.coords.longitude;
    lat = position.coords.latitude;
  */
/*
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
*/
// Get and set the route
