$(function() {

  var trailId = '8c8c2474-4375-4121-95d3-763f381717df';
  var map, selectedZone, trailBounds;

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
      $.ajax('/api/trails/' + trailId + '/paths'),
      $.ajax({
        url: '/api/trails/' + trailId + '/zones',
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

    var longestPath = _.maxBy(paths, 'length');

    L.geoJSON(recordsToFeatureCollection([ longestPath ]), {
      style: function(feature) {
        return {
          color: '#ff00bb'
        };
      }
    }).addTo(map);
  }

  function displayZones(zones) {

    var minLat, minLng, maxLat, maxLng, firstZone, lastZone;
    _.each(zones, function(zone) {

      var coordinates = zone.geometry.coordinates[0];
      _.each(coordinates, function(coordinate) {
        minLng = Math.min(coordinate[0], minLng || 180);
        minLat = Math.min(coordinate[1], minLat || 90);
        maxLng = Math.max(coordinate[0], maxLng || -180);
        maxLat = Math.max(coordinate[1], maxLat || -90);
      });

      firstZone = !firstZone || zone.position < firstZone.position ? zone : firstZone;
      lastZone = !lastZone || zone.position > lastZone.position ? zone : lastZone;
    });

    if (minLat === undefined || minLng === undefined || maxLat === undefined || maxLng === undefined) {
      return;
    }

    var northEast = L.latLng(maxLat, maxLng);
    var southWest = L.latLng(minLat, minLng);
    trailBounds = L.latLngBounds(southWest, northEast);

    map.fitBounds(trailBounds, getFitBoundsOptions());

    addBackControl();

    L
      .geoJSON(recordsToFeatureCollection(zones), {
        onEachFeature: configureZone,
        style: getZoneStyle()
      })
      .bindTooltip(function(layer) {
        return layer.feature.properties.keyword;
      })
      .addTo(map);

    if (_.get(firstZone, 'points.start.geometry.type') === 'Point') {
      var start = firstZone.points.start;
      L.marker(L.latLng(start.geometry.coordinates[1], start.geometry.coordinates[0])).addTo(map);
    }

    if (_.get(lastZone, 'points.end.geometry.type') === 'Point') {
      var end = lastZone.points.end;
      L.marker(L.latLng(end.geometry.coordinates[1], end.geometry.coordinates[0])).addTo(map);
    }
  }

  function getZoneStyle(feature, state) {

    var color = '#3388ff';
    var fillOpacity = 0.2;

    var highlighted = feature && feature.properties.highlighted;
    var selected = selectedZone && feature === selectedZone;

    if (selected && highlighted) {
      color = '#00c000';
      fillOpacity = 0.4;
    } else if (selected) {
      color = '#008b00';
      fillOpacity = 0.4;
    } else if (highlighted) {
      color = '#0000ff';
      fillOpacity = 0.4;
    }

    return {
      color: color,
      fillOpacity: fillOpacity
    };
  }

  function configureZone(feature, layer) {
    feature.setLayerStyle = _.bind(layer.setStyle, layer);

    layer.on('click', function() {

      var previouslySelectedZone = selectedZone;
      if (!selectedZone || selectedZone !== feature) {
        selectedZone = feature;
        onZoneSelected(selectedZone);
      } else {
        selectedZone = undefined;
        onZoneDeselected(selectedZone);
      }

      feature.setLayerStyle(getZoneStyle(feature));
      if (previouslySelectedZone) {
        previouslySelectedZone.setLayerStyle(getZoneStyle(previouslySelectedZone));
      }
    });

    layer.on('mouseout', function() {
      feature.properties.highlighted = false;
      feature.setLayerStyle(getZoneStyle(feature));
    });

    layer.on('mouseover', function() {
      feature.properties.highlighted = true;
      feature.setLayerStyle(getZoneStyle(feature));
    });
  }

  function onZoneSelected(feature) {
    console.log('Zone ' + feature.properties.position + ' has been selected');
  }

  function onZoneDeselected() {
    console.log('No zone selected');
  }

  function recordsToFeatureCollection(records) {
    return {
      type: 'FeatureCollection',
      features: records.map(function(record) {
        return {
          type: 'Feature',
          geometry: record.geometry,
          properties: _.omit(record, 'geometry')
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
