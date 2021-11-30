fetch("../routeData.json")
.then(response => {
   return response.json();
})
.then(jsondata => console.log(jsondata));

var jsonObject = new Object();
var orientationObject = new Object();
var hasStopped = false;
var hasSentToServer = false;

function start() {
  jsonObject.startTimestamp = Date.now();
  jsonObject.positionData = [];
  window.addEventListener("deviceorientation", handleOrientation, true);
  navigator.geolocation.watchPosition(position => {
    if(!hasStopped) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      var positionDataObject = new Object();
      positionDataObject.timestamp = Date.now();
      positionDataObject.latitude = latitude;
      positionDataObject.longitude = longitude;
      positionDataObject.orientation = orientationObject;
  
      jsonObject.positionData.push(positionDataObject);
    }
    if(hasStopped && !hasSentToServer) {
      hasSentToServer = true;
      jsonObject.endTimestamp = Date.now();
      console.log(JSON.stringify(jsonObject));
    }
  });
}

function stop() {
  hasStopped = true;
}

function setRouteId(id) {
  jsonObject.routeId = id;
}

function handleOrientation(event) {
  orientationObject.absolute = event.absolute;
  orientationObject.alpha = event.alpha; // Rotation around Z 0 to 360
  orientationObject.beta = event.beta; // Rotation around the X -180 to 180
  orientationObject.gamma = event.gamma; // Rotation around the Y -90 to 90
}



AFRAME.registerComponent('peakfinder', {
    init: function() {
        start(0);
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
      const scale = 3;
      fetch("../routeData.json")
      .then(response => {
         return response.json();
      })
      .then ( json => {
         let previousEntity = null;
         let eCoords = null;
         let pCoords = null;
         let child = null;
        json.features.forEach(feature => {
          let entity = document.createElement('a-cone');
          if (feature.geometry.type === "Point") {
            console.log("Point")
/*
             entity.setAttribute('scale', {
                x: scale,
                y: scale,
                z: scale
            });
            eCoords = {latitude: feature.geometry.coordinates[1], longitude: feature.geometry.coordinates[0]}
            entity.setAttribute('gps-projected-entity-place', {
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0]
            });

            child = this._editRotation(eCoords, pCoords, entity, previousEntity)
            console.log(child)
            this.el.appendChild(child);
            previousEntity = entity
            pCoords = eCoords*/
          } else {
            console.log("Not Point")
            let x = 0
            feature.geometry.coordinates.forEach(coordinates => {
              entity.setAttribute('scale', {
                  x: scale,
                  y: scale,
                  z: scale
              });
              eCoords = {latitude: feature.geometry.coordinates[x][1],longitude: feature.geometry.coordinates[x][0]}
              entity.setAttribute('gps-projected-entity-place', {
                  latitude: feature.geometry.coordinates[x][1],
                  longitude: feature.geometry.coordinates[x][0]
              });

              if (x > 0) {
               child = this._editRotation(eCoords, pCoords, entity, previousEntity)
              }
              else {
                child = this._editRotation(0, 0, entity, previousEntity)
              }
              child.setAttribute('position', {
                  x: 0,
                  y: -10,
                  z: 0
              });
              this.el.appendChild(child);
              previousEntity = entity
              pCoords = eCoords
              x = x + 1
             entity = document.createElement('a-cone');
            })
          }
          //cone = entity;
        })
      });
  },
  _editRotation: function(entityPosition, conePosition, entity, previousEntity) {
    if (previousEntity != null) {
      let lngDelta = conePosition.longitude - entityPosition.longitude;
      let latDelta = conePosition.latitude - entityPosition.latitude;
      let angle = Math.atan2(latDelta, lngDelta) * 180 / Math.PI;

      previousEntity.object3D.rotation.set(
         THREE.Math.degToRad(0),
         THREE.Math.degToRad(angle),
         THREE.Math.degToRad(90)
       );
       return previousEntity;
     }
     else {
       return entity;
     }
  }
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
