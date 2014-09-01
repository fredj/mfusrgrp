(function() {

  var nominatim = new Bloodhound({
    remote: {
      url: '//nominatim.openstreetmap.org/search?format=json&countrycodes=ch&q=%QUERY',
      filter: function(resp) {
        return resp;
      }
    },
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace
  });
  nominatim.initialize();

  var input = $('#search').typeahead({}, {
    name: 'nominatim',
    source: nominatim.ttAdapter(),
    templates: {
      suggestion: function(suggestion) {
        return "<p><i class='" + suggestion.type + "'></i>" + suggestion.display_name + "</p>";
      }
    }
  });


  input.on('typeahead:selected', function(event, datum, dataset) {
    //debugger;
  });

})();
