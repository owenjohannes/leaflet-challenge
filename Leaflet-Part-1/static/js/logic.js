// Create the map object with options.
let map = L.map("map").setView([37.09, -95.71], 5);

// Create the base layer using OpenStreetMap.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create the layer group for the earthquakes.
let earthquakeslayer = new L.layerGroup().addTo(map);

// Function to create circle markers colored and sized by magnitude.
function drawCircle(point, latlng) {
    let mag = point.properties.mag;
    return L.circleMarker(latlng, {
        radius: mag * 5,
        fillColor: markerColor(mag),
        color: "#000",
        weight: 0.3,
        opacity: 1,
        fillOpacity: 1
    });
}

// Function to add a pop up when a quake is clicked.
function bindPopUp(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude - ${feature.properties.mag} </p>`);
}

// Function to determine the color based on magnitude.
function markerColor(magnitude) {
    if (magnitude <= -1) {
        return "#79ff4d";
    } else if (magnitude <= 2) {
        return "#d2ff4d";
    } else if (magnitude <= 3) {
        return "#ffff4d";
    } else if (magnitude <= 4) {
        return "#ffd24d";
    } else if (magnitude <= 5) {
        return "#ffa64d";
    } else if (magnitude <= 6) {
        return "#ff794d";
    } else {
        return "#ff4d4d";
    }
};

// Perform an API call to get the earthquake information.
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
d3.json(url).then(function (data) {
    L.geoJSON(data.features, {
        pointToLayer: drawCircle,
        onEachFeature: bindPopUp
    }).addTo(earthquakeslayer);
});

// Create a legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    magnitudes = [1, 2, 3, 4, 5, 6];
    labels = [];
    legendInfo = "<strong>Magnitude</strong>";
    div.innerHTML = legendInfo;

    for (var i = 0; i < magnitudes.length; i++) {
        var magnitudeRange = magnitudes[i];
        var nextMagnitude = magnitudes[i + 1];
        var color = markerColor((magnitudeRange + nextMagnitude) / 2);
        var label = '<li style="background-color:' + color + '"> <span>' + magnitudeRange + (nextMagnitude ? '&ndash;' + nextMagnitude : '+') + '</span></li>';

        labels.push(label);
    }

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

legend.addTo(map);

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(null, { "Earthquakes": earthquakeslayer }, {
    collapsed: false
}).addTo(map);
