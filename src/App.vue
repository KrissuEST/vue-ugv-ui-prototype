<script setup>
import { onMounted, ref } from "vue";
import L from "leaflet";
import greenIconUrl from "@/assets/green_icon.png";

const lat = ref(0);
const lng = ref(0);
const map = ref();
const mapContainer = ref();
const ugvMarker = ref(null);
const engineRunning = ref(false);   // Engine's state
const waypoints = ref([]);   // Saving waypoints
const locationSet = ref(false);  // Reactive variable what tracks when user pressed "Get Location" button.

// Saved waypoint icon
const greenIcon = L.icon({
  iconUrl: greenIconUrl,
  iconSize: [27, 43], // Icon size
  iconAnchor: [14, 41] // Icon location at map
});

/* Creating main UGV marker and also adding main map layer. */
onMounted(() => {
  map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value);

  // Disabling many map options on open window.
  map.value.dragging.disable();
  map.value.scrollWheelZoom.disable();
  map.value.touchZoom.disable();
  map.value.doubleClickZoom.disable();
  map.value.boxZoom.disable();
  map.value.zoomControl.disable();
  map.value.keyboard.disable();

  // Checking engine running for the right click.
  map.value.on("contextmenu", (event) => {
    if (!engineRunning.value) {
      console.warn("Engine not started – left click don't work!");
      alert("Start the engine to save waypoints with the right click!");  // If engine not running show alert.
      return;
    }

    openWaypointPopup(event.latlng);
  });

  // Create one marker with original location and store it in a variable
  ugvMarker.value = L.marker([51.505, -0.09], { draggable: false })
  .addTo(map.value)
  .on("dragend", (event) => {
      lat.value = event.target.getLatLng().lat;
      lng.value = event.target.getLatLng().lng;
  });

  window.addEventListener("keydown", handleKeyPress);
});

/* Engine working function, using boolean value. */
function toggleEngine() {
  engineRunning.value = !engineRunning.value;
}

/* When the user right clicks on marker to add a point, we will display 
   a popup window with ok button. */
function openWaypointPopup(latlng) {
  // My genius solution how to solve this problem that always will save my current location. :)
  // We check if the mouse click location is different from the current location of the UGV
  if (latlng.lat !== lat.value || latlng.lng !== lng.value) {
    // If the click location does not equal the current location, 
    // we update the latlng with the current location of the UGV marker
    latlng.lat = lat.value;
    latlng.lng = lng.value;
  }

  // Keep the reference on the popup window so you can close it later
  const popup = L.popup()
    .setLatLng(latlng)
    .setContent(`
      <div>
        <p>New UGV marker is created <br/> at the location: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}</p>
        <button id="closePopupBtn">OK</button>
      </div>
    `)
    .openOn(map.value);

  // We associate the “OK” button with a specific popup window to close it
  setTimeout(() => {
    document.getElementById("closePopupBtn").addEventListener("click", () => {
      popup.remove(); // Close this certain pop-up window.
    });
  }, 10);

  // When the user right-clicks to add a waypoint, create an exact copy of the marker 
  // from the UGV but with green icon
  const ugvCopyMarker = L.marker([latlng.lat, latlng.lng], {
    icon: greenIcon,
  }).addTo(map.value);

  // Saving copy to the list
  waypoints.value.push({
    lat: latlng.lat,
    lng: latlng.lng,
    name: `Waypoint ${waypoints.value.length + 1}`,
    saved: true,
    marker: ugvCopyMarker  // Save the marker's reference
  });
}

/* Drive to certain saved location, bring map focus to it. */
function driveToDestination(latDest, lngDest) {
  lat.value = latDest;  // We use the value directly, not the number
  lng.value = lngDest;

  if (ugvMarker.value) {
    ugvMarker.value.setLatLng([lat.value, lng.value]);  // Uuenda UGV markeri positsiooni
  }

  // Point the map exactly to this point
  map.value.setView([lat.value, lng.value], 18);
}

/* Delete a certain waypoint with popup window */
function deleteWaypoint(index) {
  const waypoint = waypoints.value[index]; // Get a waypoint to delete

  if (waypoint.marker) {
    map.value.removeLayer(waypoint.marker); // Delete waypoint from map
  }

  waypoints.value.splice(index, 1);  // Delete waypoint from list

  // Show popup notification about deletion
  const popup = L.popup()
    .setLatLng([waypoint.lat, waypoint.lng])
    .setContent(`
      <div>
        <p>Waypoint called "${waypoint.name}" is deleted!</p>
      </div>
    `)
    .openOn(map.value);

  // Hide popup automatically after 3 seconds
  setTimeout(() => {
    map.value.closePopup(popup);
  }, 3000);
}

/* Rename a choosen waypoint with prompt window. */
function renameWaypoint(index) {
  const newName = prompt("Insert new name:", waypoints.value[index].name);
  if (newName) waypoints.value[index].name = newName;
}

/* All the logic to move around the map with arrow keys. */
function handleKeyPress(event) {
  if (!engineRunning.value) {
    alert("Start the engine for moving around the map with arrow keys!");  // If engine not running show warning
    return;
  }

  const stepSize = 0.00007;  // How big is cordinates jump when moving with arrow keys
  if (event.key === "ArrowUp") lat.value += stepSize;
  if (event.key === "ArrowDown") lat.value -= stepSize;
  if (event.key === "ArrowRight") lng.value += stepSize;
  if (event.key === "ArrowLeft") lng.value -= stepSize;

  ugvMarker.value.setLatLng([lat.value, lng.value]); // Liiguta markerit

  // Update map view that it will follow the marker
  map.value.setView([lat.value, lng.value], map.value.getZoom());
}

/* For a button to get your current location, 
   it also helps to start the application. */
function getLocation() {
  if (navigator.geolocation) {
    // watchPosition() watches location changes, it's slower and waiting new GPS updates
    // getCurrentPosition() returns location right away
    navigator.geolocation.getCurrentPosition((position) => {
      lat.value = position.coords.latitude;
      lng.value = position.coords.longitude;
      map.value.setView([lat.value, lng.value], 18);  // Max 18, min 0, before was 13

      // Update current marker location
      if (ugvMarker.value) {
        ugvMarker.value.setLatLng([lat.value, lng.value]);
        ugvMarker.value.dragging.enable(); // Kui asukoht määratud, markerit saab lohistada
      }

      locationSet.value = true; // Kui asukoht määratud, aktiveeri kõik funktsioonid

      // Activate map features after location determination
      map.value.dragging.enable();
      map.value.scrollWheelZoom.enable();
      map.value.touchZoom.enable();
      map.value.doubleClickZoom.enable();
      map.value.boxZoom.enable();
      map.value.zoomControl.enable();
    });
  }
}
</script>

<template>
  <p v-if="!locationSet">Get your location first and then you can start using the app!</p>
  <p v-if="locationSet">Click the right mouse button on marker to save waypoints! <br/>
    Move around on the map with arrow keys.</p>
  <button @click="getLocation()">Get Your Location</button>&nbsp;

  <!-- slot -> I want something similar what is in React like empty tag <> -->
  <slot v-if="locationSet">
    {{ lat }} , {{ lng }} &nbsp;&nbsp;
    <button @click="toggleEngine" class="engine-button">
      {{ engineRunning ? "Stop Egine" : "Start Engine" }}
    </button>
  </slot>
  <div :class="{ 'map-not-active': !locationSet }">
    <div ref="mapContainer" style="width: 800px; height: 500px"></div>
  </div>

  <!-- Creating a list of waypoints to manage them. -->
  <div>
    <h2 v-if="locationSet">Saved waypoints</h2>
    <ul>
      <li v-for="(waypoint, index) in waypoints" :key="index"
        :class="{ saved: waypoint.saved, unsaved: !waypoint.saved }">
        {{ index + 1 }}. {{ waypoint.name }} &nbsp;&nbsp;
        <button @click="renameWaypoint(index)">Rename</button>&nbsp;
        <button @click="driveToDestination(waypoint.lat, waypoint.lng)">Drive</button>&nbsp;
        <button @click="deleteWaypoint(index),driveToDestination(waypoint.lat, waypoint.lng)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
</style>