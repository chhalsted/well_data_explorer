//Christian Halsted 2019

//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope
(function(){

var map = L.map('map').setView([45.375, -69.0], 7);

//create base map layers
//Open Street Map
var baseLayerOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
})
//Stamen Terrain
var baseLayerStamen = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  ,subdomains: 'abcd',minZoom: 0,maxZoom: 20
})
//MapBox gray scale
var mbAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> |' +' <a href="http://mapbox.com">Mapbox</a> | Christian Halsted';
var apitoken = 'pk.eyJ1IjoiY2hoYWxzdGVkIiwiYSI6ImNqbDJ5NTI1aDF2a2szcW41dGFvcnlsMDUifQ.VwB2q6vg1Z6ORVv4Myyrhg'
var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}';
var baseLayerMBGrayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', token: apitoken, attribution: mbAttr}).addTo(map);;
//Esri imagery
var baseLayerEsri = L.esri.basemapLayer('Imagery');
var baseLayerEsriLabels = L.esri.basemapLayer('ImageryLabels');

// function addLayerControl(layerWells) {
  //add layer control for base map and geoJSON layers
  L.control.layers(
    {
      "MapBox Grayscalse":baseLayerMBGrayscale
      ,"Open Street Map":baseLayerOSM
      ,"Stamen Terrain":baseLayerStamen
      ,"Esri Imagery":baseLayerEsri
    },
    {
      // "Wells":layerWells
      // ,"Counties":layerCounties
    },
    {
      sortLayers: false,
      collapsed: true,
      autoZIndex: true,
    }).addTo(map);
// }

$(document).ready(function() {
    $('#example').DataTable( {
      "scrollY": "18vh",
      "scrollCollapse": true,
      "paging": false,
      "autoWidth": true,
      "bFilter": false,
      "bInfo" : false,
      // "responsive": true,
      // "pageResize": true,
    });
    $('#table').DataTable().columns.adjust().draw();
    // $('#table').closest('.dataTables_scrollBody').css('max-height', '500px');
    //         $('#table').DataTable().draw();
} );

// $(document).ready(getData(map));

// function debugCallback(response){
// 	$(mydiv).append('GeoJSON data: ' + JSON.stringify(mydata));
// };
//
// function debugAjax(){
// 	var mydata;
// 	$.ajax("data/citypop.geojson", {
// 		dataType: "json",
// 		success: function(response){
// 			debugCallback(mydata);
// 		}
// 	});
// 	$(mydiv).append('<br>GeoJSON data:<br>' + JSON.stringify(mydata));
// };

// $(mydiv).append('GeoJSON data: ' + JSON.stringify(mydata));

//----------------------------------------
//define AJAX function
// function jQueryAjax(){
//     //basic jQuery ajax method
//     $.ajax("data/citypop.geojson", {
//         dataType: "json",
//         success: callback
//     });
// };
//
// //define callback function
// function callback(response, status, jqXHRobject){
//     //TASKS USING THE DATA GO HERE
//     //console.log(response);
//     $(mydiv).append('<br>GeoJSON data:<br>' + JSON.stringify(response));
// };
//
// $(document).ready(jQueryAjax);


var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


})(); //last line of main.js - self-executing anonymous function
