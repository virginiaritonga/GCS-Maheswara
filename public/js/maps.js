
var map;
$(document).ready(function () {
  $("#basemapslider").slider({
		animate: true,
		value: 1,
		orientation: "vertical",
		min: 0,
		max: 1,
		step: 0.1,
		slide: function (event, ui) {
			mytile.setOpacity(ui.value);
		}
   });

	$('#basemapslider').mousedown(function(){
	  map.dragging.disable();
	})

	$('#basemapslider').mouseup(function(){
	  map.dragging.enable();
	})

  map = L.map('map').setView([-7.7703316,110.3778278], 16.0);
  
  var mytile = L.tileLayer('/Map/Map/{z}/{x}/{y}.png', {
	maxZoom: 16,
	tms: false,
	attribution: 'Generated by QTiles'
  }).addTo(map);


  
//   var mytile =L.tileLayer('C:/Users/GF63-8RD/Desktop/GCS V2/OSMPublicTransport/{z}/{x}/{y}.png', {
// 	maxZoom: 16,
// 	tms: false,
// 	attribution: 'Generated by QTiles'
//   }).addTo(map);

  L.control.layers({'Basemap':baselayer},{'MapPantai':mytile}).addTo(map);
})

var i = 0;
var marker;
var CoSet = new Array(); 
var LatitudeAwal = 0; 
var LongitudeAwal = 0; 
var LatitudeMuatan = 0;
var LongitudeMuatan = 0; 

var iconPopUp = L.icon({ 
	iconUrl: 'frontend/misc/dot.png', 
	iconSize: [10,10], //klo mau edit ukuran marker(ijo2 nya) ato segalanya ini diutak atik aja angkanya 
	popupAnchor: [0,0], 
}); 

socket.on('arduino:data', function (dataSerial) {
	// console.log(dataSerial);
	//chart.data.labels.push(counter);
	chart.data.datasets.forEach(dataset => {
	  updateMap(dataSerial.lintangs,dataSerial.bujurs);
	//   var marker = L.marker([dataSerial.lintangs,dataSerial.bujurs]).addTo(map);
	//   marker.addTo(map);
	});});

function updateMap(dataLintang,dataBujur){
	if (i === 0) {
		LatitudeAwal = parseFloat(dataLintang);
		LongitudeAwal = parseFloat(dataBujur);
	}
	LatitudeMuatan = parseFloat(dataLintang); 
	LongitudeMuatan = parseFloat(dataBujur); 

	if (marker){ 
		// marker.setIcon(iconPopUp);
		map.removeLayer(marker)
	} 
	CoSet.push([LatitudeMuatan,LongitudeMuatan]); // ini juga buat nampung LatLon 
	//Marker Lokasi Muatan 
	var LokasiMuatan = L.icon({ 
	iconUrl: 'logo/marker2.png', 
	iconSize: [50,50], //klo mau edit ukuran marker(ijo2 nya) ato segalanya ini diutak atik aja angkanya 
	iconAnchor: [25,40], 
	popupAnchor: [-3,-50], 
	}); 
	marker = L.marker([LatitudeMuatan, LongitudeMuatan]); 
	marker.addTo(map);

		// .bindPopup("Ketinggian: " + parseInt(data["Ketinggian"]) + " m<br>" +
		// 	"Lintang: " + parseFloat(data["Lintang"]).toFixed(5) +"<br> Bujur: " + parseFloat(data["Bujur"]).toFixed(5)); 

	//Garis pergerakan 
	var TitikAwal = new L.latLng(LatitudeAwal,LongitudeAwal); 
	var TitikSekarang = new L.LatLng(LatitudeMuatan,LongitudeMuatan); 
	var Garis = [TitikAwal,TitikSekarang]; 

	if ($('#autohand').html() == 'Auto'){
		map.setView([LatitudeMuatan, LongitudeMuatan], 16) 
	}
	var firstpolyline = new L.Polyline(Garis, { 
	color: 'red', 
	weight: 3, //klo mau edit ketebalan garisnya, edit weight nya 
	opacity: 1, 
	smoothFactor: 1, 
	clickable : true 
	}); 
	firstpolyline.addTo(map); 
	var markers = new L.Marker(new L.LatLng(LatitudeMuatan, LongitudeMuatan)); 
	// 
	
	LatitudeAwal = LatitudeMuatan; 
	LongitudeAwal = LongitudeMuatan; 
	i++;
}