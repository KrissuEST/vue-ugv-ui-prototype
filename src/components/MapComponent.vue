<!-- <template>
    <div id="map" style="width: 100%; height: 500px;"></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import L from 'leaflet';
  
  onMounted(() => {
    const map = L.map('map').setView([59.437, 24.753], 14); // Tallinn cordinates
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Lisa UGV algne asukoht
    L.marker([59.437, 24.753]).addTo(map)
      .bindPopup("UGV Algne Asukoht")
      .openPopup();
  });
  </script> -->
  