function getCheckbox(p) {
  return '<label><input type="checkbox" value="' + p + '"> ' + p + '</label><br>';
}

function addFilters(map, points, layers, ptm) {

  var props = [
    'IB',
    'AVID',
    'Dual Language',
    'Arts',
    'Education Equity',
    'US News',
    'Charter'
  ];

  // Property values for which filtering returns 'true'
  var propsOK = ['x', 'y', 'gold', 'silver'];

  $('.ladder:last').after('<div id="filter" \
    class="ladder leaflet-control leaflet-control-custom leaflet-bar"> \
      <h6 class="pointer minimize"><span class="legend-icon"><i class="fa fa-filter"></i></span>Filter (<span class="counter">0</span>)</h6> \
      <div></div> \
    </div>');

  for (i = 0; i < props.length; i++) {
    $('#filter div').append(getCheckbox(props[i]));
  }

  map.on('overlayadd', function() {
    $('#filter input').change();
  });

  $('#filter input').change(function() {
    checked = [];
    for (i = 0; i < props.length; i++) {
      if ($('#filter input[value="' + props[i] + '"]').is(':checked')) {
        checked.push(props[i]);
      }
    }

    $('#filter h6 .counter').text(checked.length);

    for (i = 0; i < points.length; i++) {
      var p = points[i];
      var markerLayer = ptm[p.School + p.Location];

      var cont = false;
      // Check if marker is in the School Type layer that's visible
      // If so, we will continue. If not, skipping this point
      for (l in layers) {
        if (layers[l].hasLayer(markerLayer)) {
          if (map.hasLayer(layers[l])) {
            cont = true;
            break;
          }
          break;
        }
      }
      if (!cont) continue;

      pointRemoved = false;

      for (prop = 0; prop < checked.length; prop++) {
        if ($.inArray($.trim(p[checked[prop]]).toLowerCase(), propsOK) == -1) {
          map.removeLayer(markerLayer);
          pointRemoved = true;
          break;
        }
      }

      if (!pointRemoved) {
        if (!map.hasLayer(markerLayer)) {
          map.addLayer(markerLayer);
        }
      }
    }

    // Changing the view (to the same one) will trigger moveend event, which
    // will update the DataTable
    map.setView(map.getCenter(), map.getZoom());
  });
}
