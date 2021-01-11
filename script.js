let map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
//map.locate({setView: true, maxZoom: 17});
	
let tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//En el clusters almaceno todos los markers
let markers = L.markerClusterGroup();
let data_markers = [''];
let markers_arr = [];
let marker;

//Petición fetch a la api para hacer get del json
function onMapLoad() {
	$('#kind_food_selector').append(`<option selected></option>`);

	fetch('http://localhost/mapa/api/apiRestaurants.php')
		.then(data => data.json())
		.then(data => {
			data.forEach((element) =>{
				data_markers.push(element);
			})
			showTiposComidas(data_markers);
			render_to_map(data_markers, 'all');
			console.log(data_markers);
		})
}

//Mostrar tipos de comida en pestaña y markers
let showTiposComidas = (data_markers)=>{
	let itemsFoods = [];
	for(let i = 1; i < data_markers.length; i++){
		let arr = data_markers[i].kind_food.split(',');
		arr.forEach((food)=>{
			if(itemsFoods.indexOf(food) === -1){
				$('#kind_food_selector').append(`<option>${food}</option>`);
				itemsFoods.push(food);
			}
		})
		marker = L.marker([data_markers[i].lat, data_markers[i].lng]);
		marker.bindPopup(`<b>${data_markers[i].name}</b><br>${data_markers[i].address}`).openPopup();
		markers_arr.push(marker);
	}
	console.log(itemsFoods);
}

//Filtrar por tipos de comida y mostrar/resetear markers
$('#kind_food_selector').on('change', function() {
	console.log(this.value);
  	render_to_map(data_markers, this.value);
});

let render_to_map = (data_markers,filter)=>{
	//Limpiar markers
	map.removeLayer(markers);	
	markers.clearLayers();

	//Filtrar y mostrar markers
	if(filter === 'all' || filter === ''){
		markers_arr.forEach((marker)=>{
			markers.addLayer(marker);
			map.addLayer(markers);
		})
	}else{
		for(let i = 1; i < data_markers.length; i++){
			let arr = data_markers[i].kind_food.split(', ');
			if(arr.includes(filter)){
				console.log()
				marker = L.marker([data_markers[i].lat, data_markers[i].lng]);
				marker.bindPopup(`<b>${data_markers[i].name}</b><br>${data_markers[i].address}`).openPopup();
				markers.addLayer(marker);
				map.addLayer(markers);
			}
		}
	}
}

