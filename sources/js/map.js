$(function() {
  var map = L.map('map', {
    scrollWheelZoom: false
  }).setView([ 46.778626, 6.641014 ], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(map);

  $.when(
    $.ajax('/api/trails/8c8c2474-4375-4121-95d3-763f381717df/paths'),
    $.ajax({
      url: '/api/trails/8c8c2474-4375-4121-95d3-763f381717df/zones',
      dataType: 'json'
    })
  ).then(displayData);

  function displayData(pathsResult, zonesResult) {
    return $.when([
      displayPath(pathsResult[0]),
      displayZones(zonesResult[0])
    ]);
  }

  function displayPath(paths) {

    var path;
    for (var i = 0; i < paths.length; i++) {
      if (!path || path.length !== undefined && paths[i].length > path.length) {
        path = paths[i];
      }
    }

    L.geoJSON(recordsToFeatureCollection([ path ]), {
      style: function(feature) {
        return {
          color: '#ff00bb'
        };
      }
    }).addTo(map);
  }

  function displayZones(zones) {

    var minLat, minLng, maxLat, maxLng;
    for (var i = 0; i < zones.length; i++) {
      var zone = zones[i];

      var coordinates = zone.geometry.coordinates[0];
      for (var j = 0; j < coordinates.length; j++) {
        var coordinate = coordinates[j];
        minLng = Math.min(coordinate[0], minLng || 180);
        minLat = Math.min(coordinate[1], minLat || 90);
        maxLng = Math.max(coordinate[0], maxLng || -180);
        maxLat = Math.max(coordinate[1], maxLat || -90);
      }
    }

    if (minLat === undefined || minLng === undefined || maxLat === undefined || maxLng === undefined) {
      return;
    }

    var northEast = L.latLng(maxLat, maxLng);
    var southWest = L.latLng(minLat, minLng);
    var bounds = L.latLngBounds(southWest, northEast);

    map.fitBounds(bounds);

    L.geoJSON(recordsToFeatureCollection(zones)).addTo(map);
  }

  function recordsToFeatureCollection(records) {
    return {
      type: 'FeatureCollection',
      features: records.map(function(record) {
        return {
          type: 'Feature',
          geometry: record.geometry
        };
      })
    };
  }
});
