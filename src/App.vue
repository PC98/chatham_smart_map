<template>
  <div id="app">
    <v-app>
      <TheProgressCircle v-if="loading" />
      <TheWarningAlert :text="warningText" v-if="showWarning" />
      <TheErrorModal :display="mapError" />
      <TheMap />
      <TheConsole v-if="mapLoaded" />
      <TheTimelapse v-if="mapLoaded" v-show="timelapseMode" />
    </v-app>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import TheConsole from "@/components/console/TheConsole";
import TheErrorModal from "@/components/TheErrorModal";
import TheMap from "@/components/TheMap";
import TheProgressCircle from "@/components/TheProgressCircle";
import TheWarningAlert from "@/components/TheWarningAlert";
import TheTimelapse from "@/components/timelapse/TheTimelapse";

export default {
  name: "app",
  components: {
    TheConsole,
    TheErrorModal,
    TheMap,
    TheProgressCircle,
    TheWarningAlert,
    TheTimelapse
  },
  computed: {
    ...mapState("app", [
      "loading",
      "mapError",
      "mapLoaded",
      "showWarning",
      "timelapseMode",
      "warningText"
    ]),
    ...mapGetters("app", ["timelapseMode"])
  }
};
</script>

<style>
#app {
  font-family: Roboto, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Override default CSS for p tags set by Vuetify */
p {
  margin-bottom: 0px !important;
  font-size: 14px;
}

/* Remove the arrow from the popup */
.mapboxgl-popup-tip {
  border: 0px;
}

/* Pushes the popup away from sensor, prevents flickering bugs */
.mapboxgl-popup-anchor-bottom {
  top: -12px;
}

.mapboxgl-popup-anchor-top {
  top: 12px;
}

.mapboxgl-popup-anchor-right {
  left: -12px;
}

.mapboxgl-popup-anchor-left {
  left: 12px;
}

/* Override default CSS for search box to position it within TheConsole */
.mapboxgl-ctrl-top-left .mapboxgl-ctrl {
  margin: 20px 0 0 18px;
  width: 309px;
}

/* Override default CSS for text in search box */
.mapboxgl-ctrl-geocoder input[type="text"] {
  font-size: 13px;
  padding-left: 35px;
}

/* Override default CSS for popup - give it a higher z-index than everything in TheConsole */
.mapboxgl-popup {
  z-index: 2;
}

/* Override default CSS for slider's thumb label - gives the label a rectangular/oval shape rather
than the default balloon shape */
.v-slider__thumb-label {
  transform: translate(-70px, -18px) !important;
  border-radius: 20px !important;
  z-index: 2 !important;
  width: 145px !important;
}

/* Override default CSS for the span element containing the thumb label text so that it is not 
rotated */
.v-slider__thumb-label > span {
  transform: none !important;
}

/* CSS for the downward arrow located at the bottom of the thumb label */
.arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  transform: translate(-5px, -18px);
  border-top: 5px solid #9e9e9e;
}

.v-slider {
  cursor: pointer;
}

.v-slider input {
  cursor: pointer;
}

/* CSS for the chart tooltip that is rendered using HTML rather than SVG to allow it to cover the 
y-axis labels */
div.tev {
  display: block;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 9px;
  margin-left: 1px;
  margin-top: 1px;
}
</style>
