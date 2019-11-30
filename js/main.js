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

// var layerWellTowns = L.esri.featureLayer({
//   url: 'https://gis.maine.gov/arcgis/rest/services/Boundaries/Maine_Boundaries_Town_Townships/MapServer/3',
//   simplifyFactor: 0.5,
//   precision: 5,
//   // maxZoom: 11,
//   minZoom: 6,
//   style: function (feature) {
//     return {fill: true
//       ,opacity: .25
//       , color: '#d95f0e'}
//   },
//   onEachFeature: function (feature, layer) {
//     layer.bindTooltip(feature.properties.TOWN, {sticky: true});
//   }
// }).addTo(map);

// var layerWellTowns = L.esri.featureLayer({
//   //url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1',
//   url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?&inSR=4326&outSR=4326&geometryType=esriGeometryEnvelope&geometry={' + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "}",
//   simplifyFactor: 0.5,
//   precision: 5,
//   maxZoom: 11,
//   minZoom: 6,
//   where: "WELL_DRILLER_COMPANY='AFFORDABLE WELL DRILLING'",
//   style: function (feature) {
//     return {fill: true
//       ,opacity: .25
//       , color: '#d95f0e'}
//   },
//   onEachFeature: function (feature, layer) {
//     layer.bindTooltip(feature.properties.WELL_LOCATION_TOWN, {sticky: true});
//   }
// }).addTo(map);

//
var layerWellPoints = L.esri.featureLayer({
  url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0',
  // maxZoom: 11,
  minZoom: 13,
}).addTo(map);



// map.on('zoomend', function(e) { console.log(map.getZoom()); });

map.on('moveend', function() {
     // console.log(map.getBounds());
     // console.log(map.getZoom());
     // console.log($('#checkLimitSpatial').is(':checked'));
     // console.log(document.getElementById("checkLimitSpatial").checked);
     getSummaryStatsData();
});

// function GetSpatialFilter() {
//   if ( $('#checkLimitSpatial').is(':checked') ) {
//
//   } else {
//
//   }
// }
function getData() {
  getSummaryStatsData();
  // getUnmappedTownsFilter();
}
// function getUnmappedTownsFilter() {
//   $.ajax("https://gis.maine.gov/arcgis/rest/services/Boundaries/Maine_Boundaries_Town_Townships/MapServer/3/query?where=TOWN%3C%3E%27%27&geometry=" + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=TOWN&returnGeometry=false&outSR=4326&f=geojson", {
//     dataType: "json",
//     success: function (response){
//       console.log(response);
//       console.log(response.features.length)
//       var towns = '';
//       for (i=0; i < response.features.length; i++) {
//         towns = towns + "'" + (response.features[i].properties.TOWN).replace(/'/g,"''") + "',";
//       }
//       // console.log("WELL_LOCATION_TOWN IN (" + towns.slice(0,-1).replace(/'/g,"''") + ")")
//       // getSummaryStatsData(encodeURIComponent("WELL_LOCATION_TOWN IN (" + towns.slice(0,-1) + ")"));
//       getSummaryStatsData(encodeURIComponent("OBJECTID>0"));
//       // var properties = response.features;
//       // console.log(properties)
//       // for ( var attr in properties ) {
//       //   console.log (attr);
//       // }
//     }
//   })
// }
// var townsFilter = getTownsFilter();
// console.log(townsFilter);

var layerWellTowns = '';
function loadMapTownsLayer() {
  // console.log('loadMap ' + url);
  if (layerWellTowns){
    map.removeLayer(layerWellTowns)
  };
  var dataLayer = $('#selectDataLayer :selected').val();
  var driller = document.getElementById("selectDriller").value;
  // map.eachLayer(function (layer) {
  //   map.removeLayer(layer);
  // });
  layerWellTowns = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1',
    // url: url,
    // url: "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=WELL_DRILLER_COMPANY%3D%27AFFORDABLE+WELL+DRILLING%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=WELL_LOCATION_TOWN&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=",
    simplifyFactor: 0.5,
    precision: 5,
    maxZoom: 12,
    minZoom: 6,
    where: "WELL_DRILLER_COMPANY='" + driller + "'",
    style: function (feature) {
      return {fill: true
        ,opacity: .25
        , color: '#d95f0e'}
    },
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(feature.properties.WELL_LOCATION_TOWN, {sticky: true});
    }
  }).addTo(map);
}

function getSummaryStatsData() {
  // function getSummaryStatsData(unmappedTownsFilter) {
  // getTownsFilter();
  // var townFilter = '';
  // var aTownFilter = $.ajax("https://gis.maine.gov/arcgis/rest/services/Boundaries/Maine_Boundaries_Town_Townships/MapServer/3/query?where=TOWN%3C%3E%27%27&geometry=" + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=TOWN&returnGeometry=false&outSR=4326&f=geojson",
  //   {dataType: "json",
  //   success: function(response){ }
  // })
  // $.when(aTownFilter).done(function(r1) {
  //     console.log(r1);
  //     console.log(r1.features.length)
  //     for (i=0; i < r1.features.length; i++) {
  //       townFilter = townFilter + "'" + r1.features[i].properties.TOWN + "',";
  //     }
  //     console.log(townFilter)
  //     // townFilter = "WELL_LOCATION_TOWN IN (" + townFilter.slice(0,-1).replace(/'/g,"''") + ")"
  // });
  // console.log('done ' + townFilter)


  var dataLayer = $('#selectDataLayer :selected').val();
  var driller = document.getElementById("selectDriller").value;
  if (driller == "ALL") {
    var whereDriller = encodeURIComponent("(WELL_DRILLER_COMPANY LIKE '%' OR WELL_DRILLER_COMPANY IS NULL)");
  } else {
    var whereDriller = encodeURIComponent("WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'");
  }
  var extentFilterMapped = '';
  if ( $('#checkLimitSpatial').is(':checked') ) {
    // console.log(map.getBounds());
    extentFilterMapped = "&inSR=4326&outSR=4326&geometryType=esriGeometryEnvelope&geometry={" + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "}";
  }

  // var whereTotalWells = encodeURIComponent(whereDriller);
  var uriTotalWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereDriller + extentFilterMapped + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  var uriTotalWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
// console.log(uriTotalWellsUnmapped);
  //var uriTotalWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "%20AND%20" + unmappedTownsFilter + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";

  var d = new Date();
  var y = d.getFullYear();
  var whereCurrentYearWells = whereDriller + encodeURIComponent(" AND DRILL_DATE LIKE '%" + y + "%'");
  var uriCurrentYearWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereCurrentYearWells + extentFilterMapped + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  var uriCurrentYearWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereCurrentYearWells + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  // var uriCurrentYearWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereCurrentYearWells + "%20AND%20" + unmappedTownsFilter + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";

  // var uriSummaryStats = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%0D%0A%5D&f=pgeojson";
  var uriSummaryStatsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereDriller + extentFilterMapped + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
  var uriSummaryStatsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
  // var uriSummaryStatsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "%20AND%20" + unmappedTownsFilter + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
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
      // console.log(r1[0].properties.count);
      $("#strTotalWells").text(parseInt(r1[0].properties.count) + parseInt(r2[0].properties.count));
      // console.log(r2[0]);
      // console.log(r2[0].properties.count);
      $("#strTotalWellsMapped").text(r1[0].properties.count + ' (' + Math.round((parseInt(r1[0].properties.count) / (parseInt(r2[0].properties.count) + parseInt(r1[0].properties.count)))*100, 0) + '%)');
      // console.log(r3[0].properties.count);
      // console.log(r4[0].properties.count);
      $("#strTotalWellsCurrentYear").text(parseInt(r3[0].properties.count) + parseInt(r4[0].properties.count));
      // console.log(r5[0]);
      // console.log(r6[0]);
      $("#strMinimumLabel").text($('#selectDataLayer :selected').text());
      $("#strMinimum").text(parseInt(r5[0].features[0].properties.MIN) + parseInt(r6[0].features[0].properties.MIN));
      $("#strAverageLabel").text($('#selectDataLayer :selected').text());
      $("#strAverage").text(Math.round((r5[0].features[0].properties.AVG + r6[0].features[0].properties.AVG)/2),0);
      $("#strMaximumLabel").text($('#selectDataLayer :selected').text());
      $("#strMaximum").text(parseInt(r5[0].features[0].properties.MAX) + parseInt(r5[0].features[0].properties.MAX));
  });

  //load the well towns layer
  // var whereDriller = encodeURIComponent("WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'");
  // var uriMapTownsLayer = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereDriller + extentFilterMapped + "&returnGeometry=true&outSR=4326&f=pgeojson";
  // loadMapTownsLayer(driller.replace(/'/g,"''"));
}

$('#selectDriller').on('change', function () {
	// var driller = document.getElementById("selectDriller").value;
  // getDataTotalWellsMapped(driller);
  // getDataTotalWellsUnMapped(driller);
  // getDataCurrentYearWells(driller);
  // console.log(document.getElementById("selectDataLayer").value)
  // console.log($('#selectDataLayer :selected').val())
  // console.log($('#selectDataLayer :selected').text())
  getData();
  loadMapTownsLayer();
});
$('#selectDataLayer').on('change', function () {
	// var driller = document.getElementById("selectDriller").value;
  // getDataTotalWellsMapped(driller);
  // getDataTotalWellsUnMapped(driller);
  // getDataCurrentYearWells(driller);
  // console.log(document.getElementById("selectDataLayer").value)
  // console.log($('#selectDataLayer :selected').val())
  // console.log($('#selectDataLayer :selected').text())
  getData();
  loadMapTownsLayer();
});
$('#checkLimitSpatial').on('change', function () {
  getData();
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
      getData();
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
  loadMapTownsLayer();
} );

})(); //last line of main.js - self-executing anonymous function
