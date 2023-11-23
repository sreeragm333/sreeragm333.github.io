// Example location data
// const locations = [
//     { x1: 10.049085, x2: 76.330842 },

// ];
const locations = [
    { x1: 10.049389, x2: 76.330982 },

];
// console.log(locations)

// Index of the current location
let locIndex = 0;
let setModel = true;

// Function to calculate distance between two points given their latitude and longitude
function calcDistance(lat1, lon1, lat2, lon2) {
    lon1 = lon1 * (Math.PI / 180);
    lon2 = lon2 * (Math.PI / 180);
    lat1 = lat1 * (Math.PI / 180);
    lat2 = lat2 * (Math.PI / 180);

    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371; // Earth radius in kilometers
    return c * r * 1000; // Distance in meters
}

// Function to check if the user is near a location within a given threshold
function isUserNearLocation(userLatt, userLong, locationLatt, locationLong, threshold) {
    const distance = calcDistance(userLatt, userLong, locationLatt, locationLong);
    console.log("Distance to location:", distance);
    console.log("threshold", threshold)
    return distance <= threshold;
}

// Function to update the model based on the user's location
function updateModel(newLatitude, newLongitude) {
    const modelElement = document.getElementById('gltfModel');
    console.log(modelElement,"model element")
    if (modelElement) {
        modelElement.setAttribute('gps-new-entity-place', `latitude: ${newLatitude}; longitude: ${newLongitude};`);
        modelElement.setAttribute('gltf-model', `../assets/Dhishna_logo_AR.glb`)
        console.log("Model updated to new location:", newLatitude, newLongitude);
    }
}

// Function to handle location updates
function handleLocationUpdate(position) {
    const userLatt = position.coords.latitude;
    const userLong = position.coords.longitude;

    if (locIndex !== -1 ) {
        const thresholdDistance = 50; // Set your desired threshold distance

        const isNearLocation = isUserNearLocation(userLatt, userLong, locations[locIndex].x1, locations[locIndex].x2, thresholdDistance);
        console.log(isNearLocation,"isnearlocationnnnn")

        if (isNearLocation) {
            const newLatitude = locations[locIndex].x1;
            const newLongitude = locations[locIndex].x2;


            if (setModel) {
                updateModel(newLatitude, newLongitude);
                setModel = false;

                // localStorage.setItem(`model${locIndex}`, "true");
            }
        } else {
            console.log("User is not near the location.");
            const modelElement = document.getElementById('gltfModel');
            if (modelElement) {
              modelElement.setAttribute('gps-new-entity-place', `null`);
              console.log("the model is removed set");
            }
        }
    } else {
        // console.log("No more locations to check.");
    }
}

// Function to handle location errors
function handleLocationError(error) {
    console.error('Error getting user location:', error);
}

// Function to start watching the user's location
navigator.geolocation.watchPosition(
    handleLocationUpdate,
    handleLocationError,
    {
      enableHighAccuracy: true,
      maximumAge: 3000,
      timeout: 2000
    }
  );