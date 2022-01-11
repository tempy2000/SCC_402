window.addEventListener('load', () => {

  let location = getLocationUpdate();
  var blob = new Blob(["TESTING!"], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "testing.txt");

  // getLocation();
  // printLocation();


  // let scene = document.querySelector('a-scene');
  // let test = getLocation();
  // let latitude = test.latitude;
  // let longitude = test.longitude;
  // scene.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
  // console.log(latitude);
  // console.log(longitude);
});

window.addEventListener('gps-camera-update-positon', () => {
  let text = document.querySelector('a-text');
  text.setAttribute('gps-entity-place', `latitude: ${location[0]}; longitude: ${location[1]};`);
  text.setAttribute('value', 'LOCATION');
  alert(location[0], location[1])
});

var watchID;
var geoLoc;
         
function showLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  // alert("Latitude : " + latitude + " Longitude: " + longitude);
  console.log("Latitude : " + latitude + " Longitude: " + longitude);

  return [latitude, longitude];
}

function errorHandler(err) {
  if(err.code == 1) {
      alert("Error: Access is denied!");
  } else if( err.code == 2) {
      alert("Error: Position is unavailable!");
  }
}

function getLocationUpdate(){
  
  if(navigator.geolocation){
      
      // timeout at 60000 milliseconds (60 seconds)
      var options = {timeout:60000};
      geoLoc = navigator.geolocation;
      watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
  } else {
      alert("Sorry, browser does not support geolocation!");
  }
}


function getLocation() {
  if (navigator.geolocation) {
    let coords = navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }

  return coords;
}

function printLocation()
{
  document.querySelector("test").innerHTML("CHANGED");
}