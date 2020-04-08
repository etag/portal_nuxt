
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
                <b-form-radio-group size="lg" v-model='datatype_sel' id="radio-group-2"  @change="datatype_onChange"  name="radio-sub-component" stacked>
                <b-form-radio  value="readers" >Readers</b-form-radio>
                <b-form-radio value="tags">Tag Reads</b-form-radio>
                </b-form-radio-group>
                </b-form-group>
                <!-- display type -->
                <b-form-group label="Tag Reads Display Options" label-size="lg" class="font-weight-bold">
                <b-form-radio-group v-model='opt_displaytype' size='lg' id="opt_displaytype"  @change="displaytype_onChange"  name="opt_displaytype" stacked>
                <b-form-radio  ref="tag_summaries "value="tag_summaries">Summaries</b-form-radio>
                <b-form-radio ref="raw_tag_reads" value="raw_tag_reads">Raw tag reads</b-form-radio>
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
            <div><iframe src="/User_Guide_for_ETAG.html" style="border:0;height:700px;width:400px;"> </iframe></div>
          </div>
    
    </div>
    </div>
    </div>
    
  </div>
</template>


<script>
import 'leaflet-sidebar-v2';
import 'leaflet-sidebar-v2/css/leaflet-sidebar.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
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
import tag_reads_json from '../data/tag_reads_1000.json';
import animals_json from '../data/animals.json';
import tag_animal_json from '../data/tag_animal.json';

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
        opt_displaytype: '',
        date_value: [0, 30],
        allspecies:[
          {text:'Carolina Chickadee',vaule:'0416F1BAA0,0416F20F1F,0416F1CADD,0416F1EF53,0416F20B45'},
          {text:'Dark-eyed Junco',vaule:'TU0005CD'},
          {text:'Downey Woodpecker',vaule:'0416F20590'},
          {text:'Northern Cardinal',vaule:'TU200005BB'},
          {text:'Purple Martin',vaule:'TU0000720,BFBFBFBFBF,0416F1D055'},
          {text:'Tufted titmouse',vaule:'0416F1E5F8,0416F204E3,0416F208FC'},
          {text:'Window Dove',vaule:'0416F1DB87'},
          ],
        alltagid:[
            {text:'0416F1DB87',value:'0416F1DB87'}, 
            {text:'0416F1E5F8',value:'0416F1E5F8'}, 
            {text:'0416F1BAA0',value:'0416F1BAA0'}, 
            {text:'0416F208FC',value:'0416F208FC'}, 
            {text:'0416F1D055',value:'0416F1D055'}, 
            {text:'BFBFBFBFBF',value:'BFBFBFBFBF'}, 
            {text:'0416F20590',value:'0416F20590'}, 
            {text:'0416F204E3',value:'0416F204E3'}, 
            {text:'0416F20F1F',value:'0416F20F1F'}, 
            {text:'TU200005BB',value:'TU200005BB'}, 
            {text:'0416F1CADD',value:'0416F1CADD'}, 
            {text:'0416F1EF53',value:'0416F1EF53'}, 
            {text:'0416F20B45',value:'0416F20B45'}, 
            {text:'TU0000720', value:'TU0000720'}, 
            {text:'TU0005CD', value:'TUvalue:0005CD'},
            ],
        tag_reads_summary: {
          "T1B": {"0416F1E5F8": 60, "0416F20B45": 15, "0416F208FC": 8},
          "T2A": {"BFBFBFBFBF": 1, "0416F1DB87": 1, "0416F1D055": 5}, 
          "T2B": {"0416F204E3": 61, "0416F20B45": 22, "0416F1E5F8": 48, "0416F1BAA0": 13, "0416F1CADD": 2, "BFBFBFBFBF": 1, "0416F1DB87": 1}, 
          "T2C": {"0416F204E3": 556, "0416F208FC": 120, "0416F1EF53": 1, "0416F20B45": 12, "0416F20590": 1, "BFBFBFBFBF": 2, "0416F1DB87": 1},
          "T1A": {"0416F20F1F": 16, "0416F1E5F8": 3, "0416F208FC": 7, "0416F1D055": 9, "BFBFBFBFBF": 5, "0416F1DB87": 1},
          "TU109876": {"TU0000720": 16, "TU200005BB": 4, "TU0005CD": 8}
        },
        readers: readers_json.results,
        locations: locations_json.results,
        reader_location: reader_location_json.results,
        tag_reads: tag_reads_json.results,
        animals:animals_json.results,
        tag_animal: tag_animal_json.results,
        //readers_marker: L.featureGroup(),
        readers_marker: L.markerClusterGroup(),
      }
    },
    computed: {
      map: function () {return this.$refs.map.mapObject},
      osm: function () {return this.$refs.osm.mapObject},
      reader_location_dict: function() {
          var new_dict = {};
          var reader_id,location_id,r_lat,r_lon;
          var starttime, endtime;
          for (var i=0; i<this.reader_location.length; i++) {
              reader_id = this.reader_location[i]['reader_id'];
              location_id = this.reader_location[i]['location_id'];
              starttime = this.reader_location[i]['start_timestamp'];
              endtime = this.reader_location[i]['end_timestamp'];
              //find lat,lon by location id
              for (var j=0;j< this.locations.length;j++) {
                  if (location_id == this.locations[j]['location_id']){
                        r_lat = this.locations[j]['latitude'];
                        r_lon = this.locations[j]['longitude'];
                        new_dict[reader_id] = [r_lat,r_lon,starttime,endtime];
                        break;
                  };
              }
            }
          return new_dict;
        },
      tag_animal_dict: function() {
        var new_dict = {}
        var tag_id,animal_id,animal_name;
        for (var i=0; i<this.tag_animal.length;i++) {
          tag_id = this.tag_animal[i]['tag_id'];
          animal_id = this.tag_animal[i]['animal_id'];
          for (var j=0;j< this.animals.length;j++) { 
            if (animal_id == this.animals[j]['animal_id']) {
              new_dict[tag_id] = [animal_id, this.animals[j]['species']];
              break;
            }
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
      this.clear_map();
      this.readers_marker.clearLayers();
      if (val == "readers") {
            var reader_id, reader_desc, reader_lat,reader_lon,reader_s_time,reader_e_time;
            var popinfo;
            for (var i=0; i<this.readers.length; i++) {
                  reader_id = this.readers[i]['reader_id'];
                  reader_desc = this.readers[i]['description'];
                  //[reader_lat, reader_lon,reader_s_time,reader_e_time]= extract_reader_location(reader_id);
                  if (reader_id in this.reader_location_dict) {
                    [reader_lat, reader_lon,reader_s_time,reader_e_time]= this.reader_location_dict[reader_id];
                    popinfo = '<p style="font-size:16px"><strong>Reader ID: </strong>' + reader_id + "<br>";
                    popinfo += "<strong>Description: </strong>" + reader_desc + "<br>";
                    popinfo += "<strong>Start Timestamp: </strong>" + reader_s_time + "<br>";
                    popinfo += "<strong>End Timestamp: </strong>" + reader_e_time + "<br>";
                    popinfo +="</p>";
                    reader_id = '';
                    L.marker([reader_lat,reader_lon]).bindPopup(popinfo).addTo(this.readers_marker);
                  }
            }
      this.map.addLayer(this.readers_marker);
      this.map.fitBounds(this.readers_marker.getBounds(),{maxZoom:10});
      }
      //display tags
      if (val == "tags") {
        //set the as summaries if is not selected
      //alert(this.tag_animal_dict['0416F20F1F']);
        var optionValue = $("input[name='opt_displaytype']:checked").val();
        if (this.opt_displaytype == "") {this.opt_displaytype ="tag_summaries";optionValue="tag_summaries";}
        //var optionValue = this.opt_displaytype;
          if (optionValue == "raw_tag_reads") {
              var tag_id, reader_id,reader_lat,reader_lon,pop_info;
              var animal_id, animal_species;
              var reader_s_time,reader_e_time; //not used
              var accessory_data;
              for (var i=0; i<this.tag_reads.length; i++) {
                    reader_id = this.tag_reads[i]['reader_id'];
                    tag_id = this.tag_reads[i]['tag_id'];
                    popinfo = '<p style="font-size:18px"><strong>Tag ID: </strong>' + tag_id + "</p>";
                    popinfo += '<span style="font-size:16px">';
                    if (this.tag_animal_dict.hasOwnProperty(tag_id)) {
                      [animal_id,animal_species] = this.tag_animal_dict[tag_id]; 
                      popinfo += '<strong>Animal ID: </strong>' + animal_id.toString() + "<br>";
                      popinfo += '<strong>Animal Species: </strong>' + animal_species + "<br>";
                    } 
                    //[reader_lat, reader_lon,reader_s_time,reader_e_time]= extract_reader_location(reader_id);
                    [reader_lat, reader_lon,reader_s_time,reader_e_time]= this.reader_location_dict[reader_id]; 
                    popinfo += "<strong>Reader ID</strong>: " + this.tag_reads[i]['reader_id']+ "<br>";
                    popinfo += "<strong>Read Time</strong>: " + this.tag_reads[i]['tag_read_time']+ "<br>";
                    popinfo += "<strong>Public</strong>: " + this.tag_reads[i]['public'] + "<br>";
                    popinfo += "<strong>Accessory Data</strong>:"+ "<br>";
                    popinfo += "<ul>";
                    // switch to a loop
                    accessory_data = this.tag_reads[i]['accessory_data'];
                     for (var p in accessory_data) {
                        if( accessory_data.hasOwnProperty(p) ) {
                          popinfo += "<li>" + p + ": "+accessory_data[p]+"</li>";
                            //result += p + " , " + obj[p] + "\n";
                          } 
                    }              
                    //popinfo += "<li>HUMIDITY: "+this.tag_reads[i]['accessory_data']['HUMIDITY']+"</li>";
                    //popinfo += "<li>SOLAR_RADIATION: "+this.tag_reads[i]['accessory_data']['SOLAR_RADIATION']+"</li>";
                    //popinfo += "<li>TEMPERATURE: "+this.tag_reads[i]['accessory_data']['TEMPERATURE']+"</li>";
                    popinfo += "</ul></span>";
                    reader_id = '';
                    tag_id = '';
                    L.marker([reader_lat,reader_lon]).bindPopup(popinfo).addTo(this.readers_marker);
              }
              this.map.addLayer(this.readers_marker);
              this.map.fitBounds(this.readers_marker.getBounds(),{maxZoom:10});
          }
          if (optionValue == "tag_summaries") { 
            var reader_id, reader_desc, reader_lat,reader_lon,reader_s_time,reader_e_time;
            var popinfo;
            var tag_summary;
            for (var i=0; i<this.readers.length; i++) {
                  reader_id = this.readers[i]['reader_id'];
                  reader_desc = this.readers[i]['description'];
                  //[reader_lat, reader_lon,reader_s_time,reader_e_time]= extract_reader_location(reader_id);
                  if (reader_id in this.reader_location_dict) {
                    [reader_lat, reader_lon,reader_s_time,reader_e_time]= this.reader_location_dict[reader_id];
                    popinfo = '<p style="font-size:16px"><strong>Reader ID: </strong>' + reader_id + "<br>";
                    //tag_reads_summary
                    if (this.tag_reads_summary.hasOwnProperty(reader_id)) {
                        popinfo += "<br/>No. of tag readings:";
                        tag_summary = this.tag_reads_summary[reader_id];
                        for (var p in tag_summary) {
                            popinfo += "<li>" + p + ": "+tag_summary[p]+"</li>";}
                      } else {
                        popinfo += "Zero tag readings ..<br/>";
                      }
                    popinfo +="</p>";
                    reader_id = '';
                    L.marker([reader_lat,reader_lon]).bindPopup(popinfo).addTo(this.readers_marker);
                  }
            }
          this.map.addLayer(this.readers_marker);
          this.map.fitBounds(this.readers_marker.getBounds(),{maxZoom:10});

          }

      } 
      
      },
      // display type
      displaytype_onChange(val) {
        if (this.datatype_sel !== "tags") {this.datatype_sel ="tags";}
        this.datatype_onChange("tags");
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
