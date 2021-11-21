fetch("../routeData.json")
.then(response => {
   return response.json();
})
.then(jsondata => console.log(jsondata));

AFRAME.registerComponent('peakfinder', {
	init: function() {
		this.loaded = false;
        window.addEventListener('gps-camera-update-position', e => {
            if(this.loaded === false) {
                this._loadPeaks(e.detail.position.longitude, e.detail.position.latitude);
                this.loaded = true;
            }
        });
    },
    _loadPeaks: function(longitude, latitude) {
		const scale = 20000;
       	fetch("../routeData.json")
       	.then(response => {
			return response.json();
       	})
       	.then ( json => 
			{
         	const cone = null;
         	json.features.forEach(feature => {
           	if (feature.geometry.type === "Point") 
			   {
             	console.log(feature.geometry.coordinates[0]);
             	const entity = document.createElement('a-cone');
             	//entity.setAttribute('look-at', '[gps-projected-camera]');
             	//entity.setAttribute('value', json[key].properties.name);
             	entity.setAttribute('scale', {
                 	x: scale,
                 	y: scale,
                 	z: scale
            	 });
             	entity.setAttribute('gps-projected-entity-place', {
                 	latitude: feature.geometry.coordinates[0][0],
                 	longitude: feature.geometry.coordinates[0][1]
             	});
           	}
			else 
			{
				console.log(feature.geometry.coordinates[0]);
				const entity = document.createElement('a-cone');
				//entity.setAttribute('look-at', '[gps-projected-camera]');
				//entity.setAttribute('value', json[key].properties.name);
				entity.setAttribute('scale', {
					x: scale,
					y: scale,
					z: scale
				});
				entity.setAttribute('gps-projected-entity-place', {
					latitude: feature.geometry.coordinates[0][0][0],
					longitude: feature.geometry.coordinates[0][0][1]
				});
			}

			if (cone != null)
			{
				const conePosition = cone.getAttribute('position');
				const entityPosition = entity.getAttribute('position');

				const angle = calculateAngle(conePosition.x - entityPosition.x, conePosition.y - entityPosition.y);

				cone.setAttribute('rotation', {
					x: 0,
					y: 0,
					z: angle
				});
			}

            cone = entity;
			this.el.appendChild(entity);
			console.log(feature.geometry.coordinates[0]);
         })
       });
   }
});

function calculateAngle(x, y)
{
	return Math.atan2(y, x) * 180 / Math.PI;
}