let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    //globalData = data
    console.log(data)
  
    createFeatures(data.features);
    
  });

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>WHERE: ${feature.properties.place}</h3><hr><p> Magnitude: ${(feature.properties.mag)}
    </p><hr><p> Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  function circleMarkers(feature, latlng) { 
    return L.circle(latlng,{
      radius : feature.properties.mag * 20000,
      fillColor : chooseColor(feature.geometry.coordinates[2]),
      color : "black",
      weight : 0.5,
      opacity : 0.5,
      fillCapacity : 0.7,
      stroke : true
    })
      
    }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer : circleMarkers
  });
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
  };

function chooseColor(depth) {

  if (depth >= 10 && depth <= 30){
    return "blue"
  } else if (depth >= 30 && depth <= 50){
      return "green"
  } else if ( depth >= 50 && depth <= 70){
      return "black"
  } else if (depth >= 70 && depth <= 90) {
      return "yellow"
  } else if (depth >= 90 && depth <= 110){
      return"orange"
  } else
      return "red"
  
}
// function chooseColor(d) {
//   return d > 1000 ? '#800026' :
//          d > 500  ? '#BD0026' :
//          d > 200  ? '#E31A1C' :
//          d > 100  ? '#FC4E2A' :
//          d > 50   ? '#FD8D3C' :
//          d > 20   ? '#FEB24C' :
//          d > 10   ? '#FED976' :
//                     '#FFEDA0';
// }


// Create a legend to display info about our map.

var legend = L.control({position: "bottomright"})
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
    depth = [ 10, 30, 50, 70, 90, 110];  
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
for (var i =0; i < depth.length; i++) {
  div.innerHTML += 
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
    depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
return div;

};

function createMap(earthquakes) {
   // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


//Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create an overlay object to hold our overlay.
let overlayMaps = {
  "Earthquake" : earthquakes
};

let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [street, earthquakes]
  
});



L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

legend.addTo(myMap);

};






  
  


