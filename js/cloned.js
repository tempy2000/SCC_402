// fetch("../data/route-data.json")
// .then(response => {
//    return response.json();
// })
// .then(jsondata => console.log(jsondata));

// AFRAME.registerComponent('peakfinder', {
//     init: function() {
//         this.loaded = false;
//         //alert(this.loaded);
//         window.addEventListener('gps-camera-update-position', e => {
//             if(this.loaded === false) {
//                 //alert("Running");
//                 this._loadPeaks(e.detail.position.longitude, e.detail.position.latitude);
//                 this.loaded = true;
//             }
//         });
//     },
//     _loadPeaks: function(longitude, latitude) {
//         //alert("Load Peaks");
//        const scale = 5;
//        fetch("/data/route-data.json")
//        .then(response => {
//           return response.json();
//        })
//        .then ( json => {
//           let previousEntity = null;
//           let child = null;
//          json.features.forEach(feature => {
//            let entity = document.createElement('a-cone');
//            if (feature.geometry.type === "Point") {
//              console.log("Point")

//               entity.setAttribute('scale', {
//                  x: scale,
//                  y: scale,
//                  z: scale
//              });
//              entity.setAttribute('gps-projected-entity-place', {
//                  latitude: feature.geometry.coordinates[1],
//                  longitude: feature.geometry.coordinates[0]
//              });

//              child = this._editRotation(entity, previousEntity)
//              this.el.appendChild(child);
//              previousEntity = entity
//            } else {
//              console.log("Not Point")
//              let x = 0
//              feature.geometry.coordinates.forEach(coordinates => {
//                entity.setAttribute('scale', {
//                    x: scale,
//                    y: scale,
//                    z: scale
//                });
//                entity.setAttribute('gps-projected-entity-place', {
//                    latitude: feature.geometry.coordinates[x][1],
//                    longitude: feature.geometry.coordinates[x][0]
//                });

//                child = this._editRotation(entity, previousEntity)
//                this.el.appendChild(child);
//                previousEntity = entity
//                x = x + 1
//               entity = document.createElement('a-cone');
//              })
//            }
//            //cone = entity;
//          })
//        });
//    },
//    _editRotation: function(entity, previousEntity) {
//      if (previousEntity != null) {
//        let cone = previousEntity

//        let conePosition = cone.getAttribute('gps-projected-entity-place');
//        let entityPosition = entity.getAttribute('gps-projected-entity-place');
//        let lngDelta = conePosition.longitude - entityPosition.longitude;
//        let latDelta = conePosition.latitude - entityPosition.latitude;
//        let angle = Math.atan2(latDelta, lngDelta) * 180 / Math.PI;

//        cone.object3D.rotation.set(
//           THREE.Math.degToRad(0),
//           THREE.Math.degToRad(0),
//           THREE.Math.degToRad(angle)
//         );
//         return cone;
//       }
//       else {
//         return entity;
//       }
//    }
// });
