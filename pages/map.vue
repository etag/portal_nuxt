<template>
  <div>
    <div id="map-wrap" style="height: 90vh; width: 100%;">
        <l-map ref="map" :zoom="15" :center="center" >
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
          <l-marker :lat-lng="center"></l-marker>
        </l-map>
        <div id="sidebar" class="leaflet-sidebar collapsed">
    <!-- Nav tabs -->
    <div class="leaflet-sidebar-tabs">
        <ul role="tablist"> <!-- top aligned tabs -->
            <li><a href="#home" role="tab"><i class="fa fa-bars fa-lg"></i></a></li>
            <li><a href="#profile" role="tab"><i class="fa fa-user fa-lg"></i></a></li>
            <li class="disabled"><a href="#messages" role="tab"><i class="fas fa-upload fa-lg"></i></a></li>
        </ul>

        <ul role="tablist"> <!-- bottom aligned tabs -->
            <li><a href="#help" role="tab"><i class="far fa-question-circle fa-lg"></i></a></li>
        </ul>
    </div>

    <!-- Tab panes -->
    <div class="leaflet-sidebar-content">
        <div class="leaflet-sidebar-pane" id="home">
            <h1 class="leaflet-sidebar-header">
                ETAG Map Tool
                <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
            </h1>
            <p>A responsive sidebar for mapping libraries</p>
        </div>

        <div class="leaflet-sidebar-pane" id="messages">
            <h1 class="leaflet-sidebar-header">Messages<div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div></h1>
        </div>

        <div class="leaflet-sidebar-pane" id="profile">
            <h1 class="leaflet-sidebar-header">Profile<div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div></h1>
        </div>

          <div class="leaflet-sidebar-pane" id="help">
            <h1 class="leaflet-sidebar-header">Help<div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div></h1>
        </div>
    
    </div>
    </div>
    </div>
    
  </div>
</template>
<script>
import 'leaflet-sidebar-v2';
import 'leaflet-sidebar-v2/css/leaflet-sidebar.css';
import "@fortawesome/fontawesome-free";
import '@fortawesome/fontawesome-free/css/all.css';
  export default {
    auth: false, // do not require to be logged in to view this page
    mounted() {
      var map =  this.$refs.map.mapObject;
      var sidebar = L.control.sidebar('sidebar').addTo(map);
      this.getGeoLocation();
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
            this.center = [position.coords.latitude, position.coords.longitude];
          })
        }
      }
    }
  }
</script>
