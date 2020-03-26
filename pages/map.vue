
<template>
  <div>
    <div id="map-wrap" style="height: 90vh; width: 100%;">
        <l-map ref="map" :zoom="15" :center="center" >
          <l-tile-layer ref="osm" name=osm layerType="base"  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
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
                <br>
                <!-- data type -->
                <b-form-group label="Data Type" label-size="lg" class="font-weight-bold">
                <b-form-radio-group size="lg" id="radio-group-2"  @change="datatype_onChange"  name="radio-sub-component" stacked>
                <b-form-radio  value="readers" >Readers</b-form-radio>
                <b-form-radio value="tags">Tag Reads</b-form-radio>
                </b-form-radio-group>
                </b-form-group>
                <!-- display type -->
                <b-form-group label="Display Type" label-size="lg" class="font-weight-bold">
                <b-form-radio-group size="lg" id="opt_displaytype"  @change="displaytype_onChange"  name="opt_displaytype" stacked>
                <b-form-radio  value="tag_summaries" checked="checked">Summaries</b-form-radio>
                <b-form-radio value="raw_tag_reads">Raw tag reads</b-form-radio>
                </b-form-radio-group>
                </b-form-group>
                <!-- display options -->
                <h4>Filters</h4>
                <div class="border-top my-3"></div>
                <h6>Species</h6>
                <select v-model="selected" class="selectpicker"  ref='select1'  id="species_selector" title="Choose one or more..." data-live-search="true" multiple data-actions-box="true">
                    <option v-for="option in allspecies" v-bind:value="option.value">
                        {{ option.text }}
                    </option>
                </select>

                <h6>Tag ID</h6>
                          <select v-model="selected" class="selectpicker" ref='select2' id="tag_selector" title="Choose one or more..." data-live-search="true" multiple data-actions-box="true">
                    <option v-for="option in alltagid" v-bind:value="option.value">
                        {{ option.text }}
                    </option>
                    </select>
                <h6>Data Privacy</h6>
                            <select v-model="selected" class="selectpicker" id="data_privacy" title="User only">
                              <option>User only</option>
                              <option>All data</option>
                </select>
                <br><h6>Date</h6>
                <div><h6>Date range: {{ date_value}}</h6></div>
                <vue-slider v-model="date_value" :enable-cross="false"></vue-slider>
                <br><div class="mt-3">Selected: <strong>{{ selected }}</strong></div></br>
                <button type="button" class="btn btn-primary btn-sm btn-block" onclick="apply_filters()"><strong>Apply Filters</strong></button>  


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
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap-select';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

// import json data for demo purpose only
import readers_json from "../data/readers.json";
import locations_json from '../data/locations.json';
import reader_location_json from '../data/reader_location.json';

  export default {
    auth: false, // do not require to be logged in to view this page
    components: {
    VueSlider
    },
    mounted() {
      this.initMap();
      //var map =  this.$refs.map.mapObject;
      //var sidebar = L.control.sidebar('sidebar').addTo(map);
      this.getGeoLocation();  
    },
    data () {
      return {
        sidebar: '',
        center: [35.2059, -97.4457], // Coordinates for University of Oklahoma
        selected: [],
        datatype_sel: '',
        date_value: [0, 30],
        allspecies:[
              {text:'Cardinal', value: 'Cardinal' },
              {text:'Blue Jay', value: 'Blue Jay' },
              {text:'Chickadee', value: 'Chickadee' },
              {text:'Titmouse', value: 'Titmouse' },
              {text:'Sparrow', value: 'Sparrow' },
              {text:'Finch', value: 'Finch' },
              {text:'Others', value: 'Others' }
        ],
        alltagid:[
              {text:'620000620', value: '620000620'},
              {text:'620000731', value: '620000731'},
              {text:'06200005BA', value: '06200005BA'},
              {text:'TDP000064D', value: 'TDP000064D'}
        ],
        readers: readers_json.results,
        locations: locations_json.results,
        reader_location: reader_location_json.results,
      }
    },
    computed: {
      map: function () {return this.$refs.map.mapObject},
      osm: function () {return this.$refs.osm.mapObject},
      reader_location_dict: function() {
          var new_dict = {};
          var reader_id,location_id,r_lat,r_lon;
          for (var i=0; i<this.reader_location.length; i++) {
              reader_id = this.reader_location[i]['reader_id'];
              location_id = this.reader_location[i]['location_id'];
              //find lat,lon by location id
              for (var j=0;j< this.locations.length;j++) {
                  if (location_id == this.locations[j]['location_id']){
                        r_lat = this.locations[j]['latitude'];
                        r_lon = this.locations[j]['longitude'];
                        new_dict[reader_id] = [r_lat,r_lon];
                        break;
                  };
              }
            }
          return new_dict;
        },
    },
    methods: {
      initMap: function() {
        //var map =  this.$refs.map.mapObject;
        this.sidebar = L.control.sidebar('sidebar').addTo(this.map);
      },
      getGeoLocation () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.center = [position.coords.latitude, position.coords.longitude];
          })
        }
      },
      // display data
      datatype_onChange(val) {
        alert("Display:" + Object.keys(this.reader_location_dict));
        this.clear_map();
        },
      // display type
      displaytype_onChange(val) {
        alert(val);
      },
      // clear map 
      clear_map() {
        var mymap = this.map;
        var osmlayer = this.osm;
        mymap.eachLayer(function (layer) {
            //keep the basemap layer
            if (layer != osmlayer) {mymap.removeLayer(layer);};
            });
      },
    },
    
    //updated () {
		//$(this.$refs.select1).selectpicker('refresh');
		//$(this.$refs.select2).selectpicker('refresh');
    //},
    
  }
</script>
