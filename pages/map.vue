
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
                <select  v-model="selected" class="selectpicker"  ref='select1'  id="species_selector" title="Choose one or more..." data-live-search="true" multiple data-actions-box="true">
                    <option v-for="(item,key,index) in allspecies" v-bind:value="item">
                        {{ key }}
                    </option>
                </select>

                <h6>Tag ID</h6>
                      <select  v-model="selected" class="selectpicker" ref='select2' id="tag_selector" title="Choose one or more..." data-live-search="true" multiple data-actions-box="true">
                    <option v-for="option in alltagid" v-bind:value="option">
                        {{ option}}
                    </option>
                    </select>
                <h6>Data Privacy</h6>
                            <select class="selectpicker" id="data_privacy" title="User only">
                              <option>User only</option>
                              <option>All data</option>
                </select>
                <br><h6>Date</h6>
                <!-- <div><h6>Date range: {{ date_value}}</h6></div> -->
                <div align="center" display="block" style="width:85%;margin-left: 5%;">
                <div v-if="date1_s">
                <vue-slider ref=dateslider :value="daterange" :min=date0_s :max=date1_s :interval=86400 :enable-cross="false"  :tooltip="'always'" :tooltip-placement="['bottom', 'bottom']" :tooltip-formatter="dateformatter"></vue-slider>
                </div>
                </div>
                <br/>
                <br/>
                <button type="button" class="btn btn-primary btn-sm btn-block" @click="apply_filters"><strong>Apply Filters</strong></button>  


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
// import readers_json from "../data/readers.json";
// import locations_json from '../data/locations.json';
// import reader_location_json from '../data/reader_location.json';
// import tag_reads_json from '../data/tag_reads_1000.json';
// import animals_json from '../data/animals.json';
// import tag_animal_json from '../data/tag_animal.json';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
            //date0_s: new Date('2011-04-01').getTime() / 1000,
            //date1_s: new Date('2012-01-01').getTime() / 1000,
            //date_value:[new Date('2011-04-01').getTime() / 1000,new Date('2012-01-01').getTime() / 1000],
            dateformatter: v => new Date(v *1000).toISOString().split("T",1),

            // tag_reads_summary: {
            //     "35": {"01103F4B9D": 1, "01103F6189": 662, "011016DF6B": 287}, 
            //     "14": {"01103F4B9D": 1}, 
            //     "2": {"01103F4B9D": 1, "01103F84DB": 42, "01103F7ABF": 6},
            // },
            //readers: readers_json.results,
            readers: [],
            //locations: locations_json.results,
            locations: [],
            //reader_location: reader_location_json.results,
            reader_location: [],
            //tag_reads: tag_reads_json.results,
            tag_reads: [],
            //animals:animals_json.results,
            animals: [],
            //tag_animal: tag_animal_json.results,
            tag_animal: [],
            readers_marker: L.featureGroup(),
            readers_marker: L.markerClusterGroup(),
        }
    },
    async fetch () {
        this.readers = await this.fetchAll('/api/etag/readers/?page_size=100&format=json');
        this.locations = await this.fetchAll('/api/etag/locations/?page_size=100&format=json');
        this.reader_location = await this.fetchAll('/api/etag/reader_location/?page_size=100&format=json');
        this.tag_reads = await this.fetchAll('/api/etag/tag_reads/?page_size=1000&format=json',0);
        this.animals = await this.fetchAll('/api/etag/animals/?page_size=150&format=json');
        this.tag_animal = await this.fetchAll('/api/etag/tag_animal/?page_size=100&format=json');
    },

    computed: {
        map: function () {return this.$refs.map.mapObject},
        osm: function () {return this.$refs.osm.mapObject},

        reader_location_dict: function() {
          // dict to store reader_id: lat, lon, startime, endtime
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
          // dict object to strore tag_id:animal_id, species
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
        allspecies: function () {
          // reverse tag_animal_dict
          // dict: species: tagid,tagid,tagid...
          var new_dict = {};
          var animal;
          for (var tagid in this.tag_animal_dict) {
            animal = this.tag_animal_dict[tagid][1];
            if (new_dict.hasOwnProperty(animal)) {
                new_dict[animal] = new_dict[animal] + "," + tagid;
            } else {
               new_dict[animal] = tagid ;
            }
          }
          return new_dict;
        },

        alltagid: function () {
          // get tag id list for filter
          // scan tag_reads to get all unique id
          var alltagidset = new Set();
          for (var i=0; i<this.tag_reads.length;i++) {
            alltagidset.add(this.tag_reads[i]['tag_id']);
          }
          return alltagidset;
        },
       
       tag_reads_summary: function () {
         // a summary dict on tag reads on each reader
         // reader_id: tag_id:times, tag_id:times
         var new_dict = {};
         var temp_dict = {};
         var readerid, tagid;
         for (var i=0; i<this.tag_reads.length;i++) {
           tagid = this.tag_reads[i]['tag_id'];
           readerid = this.tag_reads[i]['reader_id'];
           if (new_dict.hasOwnProperty(readerid)) {
             temp_dict = {};
             temp_dict = new_dict[readerid]
             if (temp_dict.hasOwnProperty(tagid)) {
                temp_dict[tagid] = temp_dict[tagid] + 1
             } else { temp_dict[tagid] = 1; }
             new_dict[readerid] = temp_dict;
           } else {
             temp_dict={};
             temp_dict[tagid] = 1
             new_dict[readerid] = temp_dict;
           }}
           console.log(new_dict);
           return new_dict;
       },

        daterange: function () {
          // find out the date range from tag_reads
          var alldateset = new Set();
          console.log(this.tag_reads.length);
          for (var i=0; i<this.tag_reads.length;i++) {
            alldateset.add(this.tag_reads[i]['tag_read_time'].split("T")[0]);
          }
          var alldatearray = Array.from(alldateset);
          console.log(alldatearray);
          var dateinsecond = [];
          for (var i=0; i<alldatearray.length;i++) {
            dateinsecond.push(new Date(alldatearray[i]).getTime() / 1000);
          }
          dateinsecond.sort(function(a, b){return a-b});
          console.log(dateinsecond);
          return [dateinsecond[0],dateinsecond.slice(-1)[0]];
        }, 
        date0_s:function() {return this.daterange[0];},
        date1_s:function() {return this.daterange[1];},      
    },

    methods: {
        initMap: function() {
            //var map =  this.$refs.map.mapObject;
            this.sidebar = L.control.sidebar('sidebar').addTo(this.map).open('home');
        },
        getGeoLocation () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = [position.coords.latitude, position.coords.longitude];
                })
            }
        },
        fetchAll: async function(url,loadallflag=1) {
            let axios = this.$axios;
            let results = [];
            let data = await axios.get(url.replace(process.env.baseUrl, "")).then(response => response.data);
            if (loadallflag != 0) {
            while (data.next != null) {
                results = [].concat.apply(results, data.results);
                data = await axios.get(data.next.replace(process.env.baseUrl, "")).then(response => response.data);
                await sleep(100)
            }}
            return [].concat.apply(results, data.results);
        },
        
      // display data
      datatype_onChange(val) {
      this.clear_map();
      this.readers_marker.clearLayers();
      if (val == "readers") {
        //alert(this.readers);
        //alert(this.reader_location_dict);
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
        //alert(this.tag_reads_summary);
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
              var icount = 0;
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
                    if (reader_id in this.reader_location_dict) {
                    [reader_lat, reader_lon,reader_s_time,reader_e_time]= this.reader_location_dict[reader_id]; 
                    } else {continue}; 
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
                    icount += 1;
              }
            if (icount >= 1) {
              this.map.addLayer(this.readers_marker);
              this.map.fitBounds(this.readers_marker.getBounds(),{maxZoom:10});}
            else {alert("Found zero record with the current readers!");}

              //this.map.fitBounds(this.readers_marker.getBounds(),{maxZoom:10});
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

      //display raw tag reads
      display_raw_tag_with_filter(filter_tag,filter_date) {
            var tagfilterflag = (filter_tag.length > 0);
            var datefilterflag = (filter_date.length > 0);
            //alert(filter_tag.length);
            //alert(filter_tag.includes('0416F1DB87'));
            var icount = 0;
            this.clear_map();
            this.readers_marker.clearLayers();
              var tag_id, reader_id,reader_lat,reader_lon,popinfo;
              var animal_id, animal_species;
              var reader_s_time,reader_e_time; //not used
              var accessory_data;
              var time_str,tag_read_date;
              for (var i=0; i<this.tag_reads.length; i++) {
                    reader_id = this.tag_reads[i]['reader_id'];
                    tag_id = this.tag_reads[i]['tag_id'];
                    if (tagfilterflag && !filter_tag.includes(tag_id)) {continue;}
                    if (datefilterflag) {
                      //new Date('2000-01-01').getTime() / 1000
                      //only count date
                      time_str = this.tag_reads[i]['tag_read_time'].split("T")[0];
                      tag_read_date = new Date(time_str).getTime() / 1000;
                      if (tag_read_date < filter_date[0] || tag_read_date > filter_date[1])
                        {continue;}
                    }
                    popinfo = '<p style="font-size:18px"><strong>Tag ID: </strong>' + tag_id + "</p>";
                    popinfo += '<span style="font-size:16px">';
                    if (this.tag_animal_dict.hasOwnProperty(tag_id)) {
                      [animal_id,animal_species] = this.tag_animal_dict[tag_id]; 
                      popinfo += '<strong>Animal ID: </strong>' + animal_id.toString() + "<br>";
                      popinfo += '<strong>Animal Species: </strong>' + animal_species + "<br>";
                    } 
                    //[reader_lat, reader_lon,reader_s_time,reader_e_time]= extract_reader_location(reader_id);
                    if (reader_id in this.reader_location_dict) {
                      [reader_lat, reader_lon,reader_s_time,reader_e_time]= this.reader_location_dict[reader_id]; 
                    } else {continue};
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
                    icount += 1;
            }

            if (icount >= 1) {
              this.map.addLayer(this.readers_marker);
              this.map.fitBounds(this.readers_marker.getBounds(),{maxZoom:10});}
            else {alert("Found zero record!");}
      },
      
      // apply filters 
      apply_filters() {

        var species_filter = $('#species_selector').val();
        var tag_filter = $('#tag_selector').val();
      
        var tag_filter_list = [];
        //ignore length = 0 or length = allspecies.length
        if (species_filter.length > 0 && species_filter.length < this.allspecies.length ) {
          for (var i = 0; i < species_filter.length; i++) {
            tag_filter_list.push(species_filter[i].split(","));
          }
        }

        //ignore length =0 or length = alltagid.length;
        if (tag_filter.length > 0 && tag_filter.length < this.alltagid.length ) {
          tag_filter_list.push(tag_filter);
        }
        //alert(tag_filter_list);  
        //date filter
        var date_filter = [];
        //console.log(this.$refs.dateslider.value);
        var date0 = this.$refs.dateslider.value[0];
        var date1 = this.$refs.dateslider.value[1];
        if (date0 != this.date0_s || date1 != this.date1_s) {
          date_filter.push(date0,date1);}
          // else { alert("not time fileter");}

        this.display_raw_tag_with_filter(tag_filter_list.flat(),date_filter);
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
