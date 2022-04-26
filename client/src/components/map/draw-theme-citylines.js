export default [
  {
    "id": "not-saved-section-inactive",
    "type": "line",
    "filter": [
      "all",
      ["==", ["get", "active"], "false"],
      ["==", ["get", "user_not_saved"], true]
    ],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#ff0000",
      "line-width": 2
    }
  },
  {
    "id": "not-saved-section-active",
    "type": "line",
    "filter": [
      "all",
      ["==", ["get", "active"], "true"],
      ["==", ["get", "user_not_saved"], true]
    ],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#00b400",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  {
    "id": "not-saved-station-halo",
    "type": "circle",
    "filter": [
      "all",
      ["==", ["get", "user_not_saved"], true],
    ],
    "paint": {
      "circle-color": "#fff",
      "circle-radius": 5
    }
  },
  {
    "id": "not-saved-station-inactive",
    "type": "circle",
    "filter": [
      "all",
      ["==", ["get", "active"], "false"],
      ["==", ["get", "user_not_saved"], true],
    ],
    "paint": {
      "circle-color": "#ff0000",
      "circle-radius": 3
    }
  },
  {
    "id": "not-saved-station-active",
    "type": "circle",
    "filter": [
      "all",
      ["==", ["get", "active"], "true"],
      ["==", ["get", "user_not_saved"], true],
    ],
    "paint": {
      "circle-color": "#00b400",
      "circle-radius": 3
    }
  }
];
