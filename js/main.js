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

map.on('zoomend', function(e) { console.log(map.getZoom()); });

map.on('moveend', function() {
     console.log(map.getBounds());
});


function GetSummaryStatsData() {
  var dataLayer = $('#selectDataLayer :selected').val();
  var driller = document.getElementById("selectDriller").value;
  if (driller == "ALL") {
    var whereDriller = "(WELL_DRILLER_COMPANY LIKE '%' OR WELL_DRILLER_COMPANY IS NULL)";
  } else {
    var whereDriller = "WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'";
  }
  var whereTotalWells = encodeURIComponent(whereDriller);
  var uriTotalWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereTotalWells + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  var uriTotalWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereTotalWells + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";

  var d = new Date();
  var y = d.getFullYear();
  var whereCurrentYearWells = encodeURIComponent(whereDriller + " AND DRILL_DATE LIKE '%" + y + "%'");
  var uriCurrentYearWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereCurrentYearWells + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  var uriCurrentYearWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereCurrentYearWells + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";

  // var uriSummaryStats = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereTotalWells + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%0D%0A%5D&f=pgeojson";
  var uriSummaryStatsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereTotalWells + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
  var uriSummaryStatsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereTotalWells + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
  // console.log (uriSummaryStats);
  var a1 = $.ajax(uriTotalWellsMapped, {dataType: "json",success: function(response){ } }),
      a2 = $.ajax(uriTotalWellsUnmapped, {dataType: "json",success: function(response){ } }),
      a3 = $.ajax(uriCurrentYearWellsMapped, {dataType: "json",success: function(response){ } }),
      a4 = $.ajax(uriCurrentYearWellsUnmapped, {dataType: "json",success: function(response){ } }),
      a5 = $.ajax(uriSummaryStatsMapped, {dataType: "json",success: function(response){ } }),
      a6 = $.ajax(uriSummaryStatsUnmapped, {dataType: "json",success: function(response){ } })

  $.when(a1, a2, a3, a4, a5, a6).done(function(r1, r2, r3, r4, r5, r6) {
      // Each returned resolve has the following structure:
      // [data, textStatus, jqXHR]
      // e.g. To access returned data, access the array at index 0
      // console.log(r1[0]);
      console.log(r1[0].properties.count);
      $("#strTotalWells").text(parseInt(r1[0].properties.count) + parseInt(r2[0].properties.count));
      // console.log(r2[0]);
      console.log(r2[0].properties.count);
      $("#strTotalWellsMapped").text(r2[0].properties.count + ' (' + Math.round((parseInt(r2[0].properties.count) / (parseInt(r2[0].properties.count) + parseInt(r1[0].properties.count)))*100, 0) + '%)');
      console.log(r3[0].properties.count);
      console.log(r4[0].properties.count);
      $("#strTotalWellsCurrentYear").text(parseInt(r3[0].properties.count) + parseInt(r4[0].properties.count));
      console.log(r5[0]);
      console.log(r6[0]);
      $("#strMinimumLabel").text($('#selectDataLayer :selected').text());
      $("#strMinimum").text(parseInt(r5[0].features[0].properties.MIN) + parseInt(r6[0].features[0].properties.MIN));
      $("#strAverageLabel").text($('#selectDataLayer :selected').text());
      $("#strAverage").text(Math.round((r5[0].features[0].properties.AVG + r6[0].features[0].properties.AVG)/2),0);
      $("#strMaximumLabel").text($('#selectDataLayer :selected').text());
      $("#strMaximum").text(parseInt(r5[0].features[0].properties.MAX) + parseInt(r5[0].features[0].properties.MAX));
  });
}

$('#selectDriller').on('change', function () {
	// var driller = document.getElementById("selectDriller").value;
  // getDataTotalWellsMapped(driller);
  // getDataTotalWellsUnMapped(driller);
  // getDataCurrentYearWells(driller);
  // console.log(document.getElementById("selectDataLayer").value)
  // console.log($('#selectDataLayer :selected').val())
  // console.log($('#selectDataLayer :selected').text())
  GetSummaryStatsData();
});
$('#selectDataLayer').on('change', function () {
	// var driller = document.getElementById("selectDriller").value;
  // getDataTotalWellsMapped(driller);
  // getDataTotalWellsUnMapped(driller);
  // getDataCurrentYearWells(driller);
  // console.log(document.getElementById("selectDataLayer").value)
  // console.log($('#selectDataLayer :selected').val())
  // console.log($('#selectDataLayer :selected').text())
  GetSummaryStatsData();
});



function loadDataTable () {
  $('#tableDataTable').DataTable( {
    "scrollY": "18vh",
    "scrollCollapse": true,
    "paging": false,
    "autoWidth": true,
    "bFilter": false,
    "bInfo" : false,
  });
  $('#table').DataTable().columns.adjust().draw();
}

function loadWellDrillers() {
  var uri = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=WELL_DRILLER_COMPANY+LIKE+%27%25%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=WELL_DRILLER_COMPANY&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=WELL_DRILLER_COMPANY&groupByFieldsForStatistics=WELL_DRILLER_COMPANY&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++%22onStatisticField%22%3A+%22WELL_DRILLER_COMPANY%22%0D%0A++%7D%0D%0A%5D&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=";
  $.ajax(uri, {
    dataType: "json"
    ,success: function(response){
      var arrayDrillers = response.features;
      var options = $('#selectDriller').prop('options');
      for (var i=0; i < arrayDrillers.length; i++) {
        var option = (arrayDrillers[i].properties.WELL_DRILLER_COMPANY);
        options[options.length] = new Option(option, option);
      }
      // var driller = document.getElementById("selectDriller").value;
      GetSummaryStatsData();
    }
  });
}



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

$(document).ready(function() {
  loadWellDrillers();
  loadDataTable();
} );

})(); //last line of main.js - self-executing anonymous function
