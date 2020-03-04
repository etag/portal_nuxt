<template>
  <div>
    <div id="map-wrap" style="height: 100vh; width: 100%;">
      <client-only>
        <l-map :zoom="15" :center="center">
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          <l-marker :lat-lng="center"></l-marker>
        </l-map>
      </client-only>
    </div>
  </div>
</template>
<script>
  export default {
    auth: false, // do not require to be logged in to view this page
    mounted() {
      this.getGeoLocation()
    },
    data () {
      return {
        center: [35.2059, -97.4457], // Coordinates for University of Oklahoma
      }
    },
    methods: {
      getGeoLocation () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.center = [position.coords.latitude, position.coords.longitude]
            // this.map.setView(position)
          })
        }
      }
    }
  }
</script>
