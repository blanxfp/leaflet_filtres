var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 6);
//map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();

var data_markers = [];

function onMapLoad() {

	console.log("Mapa cargado");
    /*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/

	$.ajax({
		url: 'http://localhost:8888/mapa/api/apiRestaurants.php',
		type: 'get',
		dataType: 'json',
		success: function(data) {
			data_markers = data;
			var currents = [];
			var kinds = ["Mexicano"];
			// Loop through each item of data
			$.each(data_markers, function (i, item) {
				// add to selector kinds of restaurant
				currents = item.kind_food.split(',');
				// Loop through and exclude from selector the ones that are already in the array kinds
				$.each(currents, function (i, current) {
					if(kinds.indexOf( current ) == -1) {
						$('#kind_food_selector').append($('<option>', { 
							value: current,
							text : current
						}));
						kinds.push(current);
					}
				})

				var marker = L.marker(new L.LatLng(item.lat, item.lang))
				.bindPopup("<b>" + item.name + "</b><br>" + item.address)
				.openPopup();
				markers.addLayer( marker );
			});
			map.addLayer(markers);

		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	})

}

$('#kind_food_selector').on('change', function() {
  console.log(this.value);
  render_to_map(data_markers, this.value);
});



function render_to_map(data_markers,filter){
	markers.clearLayers();
	var currents = [];
	var kinds = ["Mexicano"];
	// Loop through each item of data
	$.each(data_markers, function (i, item) {
		// add to selector kinds of restaurant
		currents = item.kind_food.split(',');
		// Loop through and exclude from selector the ones that are already in the array kinds
		$.each(currents, function (i, current) {
			if(current == filter) {
				var marker = L.marker(new L.LatLng(item.lat, item.lang))
				.bindPopup("<b>" + item.name + "</b><br>" + item.address)
				.openPopup();
				markers.addLayer( marker );
			}
		})
	});
	map.addLayer(markers);

	/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/	
			
}