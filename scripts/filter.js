function getCheckbox(p) {
  return '<label><input type="checkbox" value="' + p + '"> ' + p + '</label><br>';
}

function addFilters(map, points, layers, ptm) {

  var props = [
    'Charter',
    'Non-Charter',
    'IB',
    'AVID',
    'Dual Language',
    'Arts',
    'Education Equity',
    'US News'
  ];

  // Property values for which filtering returns 'true'
  //var propsOK = ['x', 'y', 'gold', 'silver'];
  propsOK = {
    'Charter': ['Charter', ['y']],
    'Non-Charter': ['Charter', ['n']],
    'IB': ['IB', ['x']],
    'AVID': ['AVID', ['x']],
    'Dual Language': ['Dual Language', ['x']],
    'Arts': ['Arts', ['x']],
    'Education Equity': ['Education Equity', ['x']],
    'US News': ['US News', ['gold', 'silver']],
  }

  $('.ladder:last').after('<div id="filter" \
    class="ladder leaflet-control leaflet-control-custom leaflet-bar"> \
      <h6 class="pointer minimize"><span class="legend-icon"><i class="fa fa-filter"></i></span>Filter</h6> \
      <div></div> \
    </div>');

  for (i = 0; i < props.length; i++) {
    $('#filter div').append(getCheckbox(props[i]));

    if (i == 1) {
      $('#filter div').append('<p style="font-size: 1.1em; font-weight: bold; margin: 3px 0;">Special Distinctions</p>');
    }
  }

  map.on('overlayadd', function() {
    $('#filter input').change();
  });

  $('#filter input').change(function() {
    activeFilters = [];
    for (i = 0; i < props.length; i++) {
      if ($('#filter input[value="' + props[i] + '"]').is(':checked')) {
        activeFilters.push(props[i]);
      }
    }

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

      for (prop = 0; prop < activeFilters.length; prop++) {
        if ($.inArray($.trim(p[propsOK[activeFilters[prop]][0]]).toLowerCase(), propsOK[activeFilters[prop]][1]) == -1) {
          // Adding exception for 'Charter' and 'Non-Charter' selected at the same time
          if (activeFilters[prop] == 'Charter' || activeFilters[prop] == 'Non-Charter') {
            if ($.inArray('Charter', activeFilters) > -1 && $.inArray('Non-Charter', activeFilters) > -1) {
              continue;
            }
          }
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
