import { distanceInWordsToNow, format } from "date-fns";
import store from "@/store";
import {
  inundationDemoBoost,
  inundationDemoMultiplier
} from "@/helpers/constants";

export default class Sensor {
  constructor(id, coordinates, name, description, datastreams) {
    this.id = id;
    this.coordinates = coordinates;
    this.name = `${name} Sensor`;
    this.description = description;
    this.datastreams = datastreams;
  }

  get placeName() {
    return `${this.name}, Chatham, GA`;
  }

  get chartDatastreams() {
    if (store.state.app.updatingData) {
      return [{ title: "Loading chart data..." }];
    }

    return this.datastreams.map(datastream => {
      const { name, color, observations, unitHtml } = datastream;
      const plotLines = this.plotLines[name];
      let series = [];
      let data = [];
      let dataMapping = [];
      observations.forEach(observation => {
        if (observation) {
          const x = new Date(observation.resultTime).getTime();
          const y = observation.result;
          data.push({ x, y });
          dataMapping.push({
            seriesIndex: series.length,
            dataIndex: data.length - 1
          });
        } else {
          dataMapping.push(undefined);
          if (data.length) {
            series.push({ data, color, name });
            data = [];
          }
        }
      });
      if (data.length) {
        series.push({ data, color, name });
      }
      const title = series.length
        ? `${name} Data`
        : `No ${name} data available in selected time interval`;

      return { title, series, unitHtml, plotLines, dataMapping };
    });
  }

  get waterLevelReading() {
    if (store.state.app.updatingData) {
      return { result: "Loading...", resultTime: "Loading...", inundation: 0 };
    }
    // We made sure that water level was the first datastream:
    const { observations, unitSymbol } = this.datastreams[0];
    const observation = observations[store.state.timelapse.sliderVal];
    if (observation) {
      const result = `${observation.result} ${unitSymbol}`;
      const resultTime = store.getters["timelapse/present"]
        ? distanceInWordsToNow(observation.resultTime, {
            addSuffix: true
          })
        : format(
            observation.resultTime,
            store.getters["timelapse/displayYear"]
              ? "M/DD/YYYY h:mm aa"
              : "MMMM Do h:mm aa"
          );
      const inundation =
        observation.result * inundationDemoMultiplier + inundationDemoBoost;
      return {
        result,
        resultTime,
        inundation
      };
    } else {
      return {
        resultTime: "N/A",
        result: "No reading",
        inundation: 0
      };
    }
  }

  get plotLines() {
    return {
      "Water Level": [
        {
          color: "red",
          width: 2,
          value: +Math.random().toFixed(2),
          dashStyle: "shortdash",
          zIndex: 5,
          label: {
            x: -1,
            align: "right",
            text: "DANGER",
            style: {
              color: "red",
              fontSize: "12px",
              fontStyle: "italic"
            }
          }
        }
      ]
    };
  }
  // Follows Carmen GeoJSON format:
  get geoJSON() {
    return {
      id: this.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: this.coordinates
      },
      properties: {
        description: this.description,
        inundation: this.waterLevelReading.inundation
      },
      place_name: this.placeName,
      place_type: ["place"],
      center: this.coordinates
    };
  }
}
