$(function() {

  var map, trailBounds;

  $.when()
    .then(initMap)
    .then(loadData)
    .then(displayData);

  function initMap() {
    map = L.map('map', {
      scrollWheelZoom: false
    }).setView([ 46.778626, 6.641014 ], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(map);
  }

  function addBackControl() {

    var BackButton = L.Control.extend({

      options: {
        position: 'topleft'
      },

      onAdd: function (map) {

        var container = $('<div class="leaflet-bar leaflet-control leaflet-custom-control"></div>');
        var button = $('<a href="#" title="Retour au sentier" role="button" aria-label="Retour au sentier"></a>').appendTo(container);
        var icon = $('<span class="glyphicon glyphicon-map-marker"></span>').appendTo(button);

        button.on('click', function(e) {
          e.preventDefault();
          map.fitBounds(trailBounds, getFitBoundsOptions({
            animate: true,
            duration: 0.5
          }));
        });

        return container[0];
      },

    });

    map.addControl(new BackButton());
  }

  function loadData() {
    return $.when(
      $.ajax('/api/trails/8c8c2474-4375-4121-95d3-763f381717df/paths'),
      $.ajax({
        url: '/api/trails/8c8c2474-4375-4121-95d3-763f381717df/zones',
        dataType: 'json'
      })
    );
  }

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
    trailBounds = L.latLngBounds(southWest, northEast);

    map.fitBounds(trailBounds, getFitBoundsOptions());

    addBackControl();

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

  function getFitBoundsOptions(options) {
    options = options || {};
    options.padding = options.padding || [ 20, 20 ];
    return options;
  }
});
