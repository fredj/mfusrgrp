// FIXME: restrict extent
// FIXME: bing key
(function() {
  var module = angular.module('app', ['go']);

  module.controller('MainController', ['$scope',

    function($scope) {

      var map = new ol.Map({
        controls: [],
        layers: [
          new ol.layer.Tile({
            visible: false,
            base: true,
            source: new ol.source.BingMaps({
              key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
              imagerySet: 'aerial'
            })
          }),
          new ol.layer.Tile({
            visible: true,
            base: true,
            source: new ol.source.TileJSON({
              url: 'http://api.tiles.mapbox.com/v3/camptocamp.map-ok288g0c.jsonp'
            })
          }),
          new ol.layer.Vector({
            visible: false,
            base: false,
            id: 'municipalities',
            source: new ol.source.TopoJSON({
              projection: 'EPSG:3857',
              url: 'vd-municipalities.json'
            })
          })
        ],
        view: new ol.View({
          center: [907700, 5890660],
          zoom: 8
        })
      });

      var scaleline = new ol.control.ScaleLine();
      map.addControl(scaleline);

      // FIXME
      $scope.toggleBaseLayer = function(event) {
        map.getLayers().forEach(function(layer) {
          if (layer.get('base')) {
            layer.setVisible(!layer.getVisible());
          }
        });
      };
      // FIXME
      $scope.toggleMunicipalities = function(event) {
        map.getLayers().forEach(function(layer) {
          if (layer.get('id') == 'municipalities') {
            layer.setVisible(!layer.getVisible());
          }
        });
      };

      var geolocation = new ol.Geolocation({
        projection: map.getView().getProjection()
      });
      geolocation.on('change:tracking', function(event) {
        overlay.setMap(this.getTracking() ? map : null);
      });
      var accuracy = new ol.Feature();
      accuracy.bindTo('geometry', geolocation, 'accuracyGeometry');

      var position = new ol.Feature();
      position.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399cc'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      }));
      position.bindTo('geometry', geolocation, 'position').transform(null, function(coordinates) {
        return coordinates ? new ol.geom.Point(coordinates) : null;
      });
      var overlay = new ol.FeatureOverlay({
        map: map,
        features: [position, accuracy]
      });

      $scope.map = map;
      $scope.geolocation = geolocation;
    }]);

})();
