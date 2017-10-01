function dataTableToggle(map) {
  $('.ladder:first').before('<div id="dataTableToggleDiv" \
    class="ladder leaflet-control leaflet-control-custom leaflet-bar"> \
      <h6 class="pointer"><span class="legend-icon"> \
        <i class="fa fa-table"></i></span>See School Data Listed \
       \
      \
      <div style="z-index: 999; width:37px; position: absolute; top: 5px; right: 8px; height: 20px">\
      <label class="switch"> \
        <input type="checkbox"> \
        <span class="slider round"></span> \
      </label></div> \
    </div>');

  $('#dataTableToggleDiv input').change(function() {
    if ($('#dataTableToggleDiv input').is(':checked')) {
      $('#map').css('height', '60vh');
      $('#maptable_wrapper').css('visibility', 'visible');
    } else {
      $('#maptable_wrapper').css('visibility', 'hidden');
      $('#map').css('height', '100vh').css('height', '-=70px');
      map.invalidateSize();
    }
  });
}
