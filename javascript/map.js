/* This page displays the mapbox api and has the corrdinates and
data for the map and its pins. it also has the code to transfer
the data from the map.html page to the specificflower.html
page */

/* Initialize the map */
function initializeMap() {
  //Create the map only when the map element exists on the html page
  const mapContainer = document.getElementById("map");
  if (!mapContainer || typeof mapboxgl === "undefined") {
    console.log("Map functionality not needed right now");
    return;
  }

// Mapbox reference, it uses the template from mapbox API docs
mapboxgl.accessToken =
    "pk.eyJ1Ijoicml2ZXJiYW5rMjI0MSIsImEiOiJjbTEwYmR4NXAwNGNyMmxxNWx4N29rd3k1In0.z4RRESKjgIB3ZetHdANFbg";

// Style of map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [135, -25],
  zoom: 3,
});
  fetchAndRenderMarkers(map);
}

// Define the styling options for markers
var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  fillOpacity: 0.8,
};

// Create the geojson objects to represent geographic attributes
let geojson = {
  type: "FeatureCollection",
  features: [],
};

/* Create and add the marker and pop-up page to the map based on the given geojson */
function renderMarkers(map, geojson) {
  for (const feature of geojson.features) {
    const el = document.createElement("div");
    el.className = "marker";

    new mapboxgl.Marker(el)
      .setLngLat(feature.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 20 }).setHTML(`
                      <h2>${feature.properties.title}</h2>
                      <p class="pop-up-page-description">${feature.properties.description}</p>
                      <p class="pop-up-page-extra-button1">
                          <a href=${feature.properties.link}>Flower Specification</a>
                      </p>
                      <p class="pop-up-page-extra-button2">
                          <a href=${feature.properties.link2}>Soldier Memorial</a>
                      </p>
                  `)
      )
      .addTo(map);
  }
}

/* Fetch information of flower from brisbane government database and add information to each marker */
function fetchAndRenderMarkers(map) {
  const API_URL =
    "https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/free-native-plants-species/records?limit=29";

// The array of the data of longitude and latitude
const markerCoordinates = [
    [149, -34.5],
    [140, -34.2],
    [152, -25.8],
    [122, -20.7],
    [150.5, -23],
    [145, -35.6],
    [152, -31],
    [144.5, -14.8],
    [117, -30],
];

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    const plants = data.results || [];

    // Retrieve 9 entries from API
    for (let i = 0; i < 9; i++) {
      if (plants.length > 0) {
        const plant = plants[i];
        const species = plant.species;
        const description = plant.description_and_growing_requirements;

        // Create the dynamic link and manipulate the query string of the URL
        const dynamicLink = new URL(
          "https://deco1800teams-t33-coco2-0.uqcloud.net/specificflower.html",
          window.location.origin
        );
        dynamicLink.searchParams.append("flowername", species);
        dynamicLink.searchParams.append("description", description);
        dynamicLink.searchParams.append("image", `${species}.png`);
        
        // Add data of flower info to geojson
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: markerCoordinates[i],
          },
          properties: {
            title: species,
            description: description,
            link: dynamicLink.toString(),
            link2: "index.html",
          },
        });
      }
      // Add data to the marker
      renderMarkers(map, geojson);
    }
  })
  .catch((err) => {
    console.error(err);
  });
}

/* Parse the information from the url parameters, and then 
   display them in the flower specification page. It is inspired 
   by the content from 
   https://www.sitepoint.com/get-url-parameters-with-javascript */
function handleUrlParameters() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const flowerNameUrl = urlParams.get("flowername");
  const descriptionUrl = urlParams.get("description");
  const imageUrl = urlParams.get("image");

  
document.getElementById("flower-name").textContent = flowerNameUrl;
document.getElementById("flower-description").textContent = descriptionUrl;

// Update the flower info if the element exists
const imageElement = document.getElementById("flower-image");
if (imageElement && imageUrl) {
  imageElement.src = "images/" + imageUrl;
  imageElement.alt = flowerNameUrl || "Flower image";
}
}



/* Run functions automatically after the page has loaded */
window.onload = function () {
  initializeMap();
  handleUrlParameters();
};
