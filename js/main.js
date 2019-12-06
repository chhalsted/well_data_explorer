//Christian Halsted 2019
//GEOG 575 Final Project - Maine Water Well Database Explorer

//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope
(function(){
$('#body').css('min-height', screen.height);
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
var mbAttr = '<a href="http://openstreetmap.org">OpenStreetMap</a> | <a href="http://mapbox.com">Mapbox</a> | Christian Halsted';
var apitoken = 'pk.eyJ1IjoiY2hoYWxzdGVkIiwiYSI6ImNqbDJ5NTI1aDF2a2szcW41dGFvcnlsMDUifQ.VwB2q6vg1Z6ORVv4Myyrhg'
var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}';
var baseLayerMBGrayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', token: apitoken, attribution: mbAttr}).addTo(map);
//Esri imagery
var baseLayerEsri = L.esri.basemapLayer('Imagery');
var baseLayerEsriLabels = L.esri.basemapLayer('ImageryLabels');

// function addLayerControl(layerWells) {
  //add layer control for base map and geoJSON layers
  L.control.layers(
    {
      "MapBox Grayscalse":baseLayerMBGrayscale,
      "Open Street Map":baseLayerOSM,
      "Stamen Terrain":baseLayerStamen,
      "Esri Imagery":baseLayerEsri,
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
// var layerWellPoints = L.esri.featureLayer({
//   url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0',
//   // maxZoom: 11,
//   minZoom: 13,
// }).addTo(map);

layerTowns = L.esri.featureLayer({
  url: 'https://gis.maine.gov/arcgis/rest/services/Boundaries/Maine_Boundaries_Town_Townships/MapServer/3',
  attribution: 'MEGIS',
  simplifyFactor: 0.5,
  precision: 5,
  minZoom: 13,
  style: function (feature) {
    return {fill: false,
      opacity: .25
      }
  },
  // onEachFeature: function (feature, layer) {
  //   layer.bindTooltip(feature.properties.TOWN, {sticky: true});
  // }
}).addTo(map);





// function GetSpatialFilter() {
//   if ( $('#checkLimitSpatial').is(':checked') ) {
//
//   } else {
//
//   }
// }
// function getData() {
//   getSummaryStatsData();
//   // getUnmappedTownsFilter();
// }
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




//color ramp arrays for data layer classes,
var colorRampOpacity = [
  'rgba(26,152,80, 0.2)',
  'rgba(102,189,99, 0.2)',
  'rgba(166,217,106, 0.2)',
  'rgba(217,239,139, 0.2)',
  'rgba(255,255,191, 0.2)',
  'rgba(254,224,139, 0.2)',
  'rgba(253,174,97, 0.2)',
  'rgba(244,109,67, 0.2)',
  'rgba(215,48,39, 0.2)',
]
var colorRampSolid = [
  'rgba(26,152,80, 1)',
  'rgba(102,189,99, 1)',
  'rgba(166,217,106, 1)',
  'rgba(217,239,139, 1)',
  'rgba(255,255,191, 1)',
  'rgba(254,224,139, 1)',
  'rgba(253,174,97, 1)',
  'rgba(244,109,67, 1)',
  'rgba(215,48,39, 1)'
]
var dataLayerClass = {
  'WELL_DEPTH_FT':'WELL_DEPTH_CLASS',
  'WELL_YIELD_GPM':'WELL_YIELD_CLASS',
  'OVERBURDEN_THICKNESS_FT':'WELL_OVERBURDEN_THICKNESS_CLASS',
  'CASING_LENGTH_FT':'CASING_LENGTH_CLASS'
}
// var classesWellDepth = ["0 - 50", "50.1 - 100", "100.1 - 150", "150.1 - 200", "200.1 - 300", "300.1 - 400", "400.1 - 500", "500.1 - 1000", "1000+"];
// var classesWellYield = ["0 - 2", "2.1 - 4", "4.1 - 6", "6.1 - 10", "10.1 - 15", "15.1 - 30", "30.1 - 60", "60.1 - 100", "100+"];
// var classesOverburden = ["0 - 5", "5.1 - 10", "10.1 - 20", "20.1 - 30", "30.1 - 40", "40.1 - 50", "50.1 - 75", "75.1 - 100", "100+"];
// var classesCasing = ["0 - 10", "10.1 - 20", "20.1 - 30", "30.1 - 50", "50.1 - 75", "75.1 - 100", "100.1 - 250", "250.1 - 500", "500+"];
var dataLayerClassLabels = {
  'WELL_DEPTH_FT':["0 - 50", "50.1 - 100", "100.1 - 150", "150.1 - 200", "200.1 - 300", "300.1 - 400", "400.1 - 500", "500.1 - 1000", "1000+"],
  'WELL_YIELD_GPM':["0 - 2", "2.1 - 4", "4.1 - 6", "6.1 - 10", "10.1 - 15", "15.1 - 30", "30.1 - 60", "60.1 - 100", "100+"],
  'OVERBURDEN_THICKNESS_FT':["0 - 5", "5.1 - 10", "10.1 - 20", "20.1 - 30", "30.1 - 40", "40.1 - 50", "50.1 - 75", "75.1 - 100", "100+"],
  'CASING_LENGTH_FT':["0 - 10", "10.1 - 20", "20.1 - 30", "30.1 - 50", "50.1 - 75", "75.1 - 100", "100.1 - 250", "250.1 - 500", "500+"]
}

// match the current feature's class for selected data layer to get the symbol color
function mapTownsSymbolizeByClass ( feature ) {
  // return {fill: true, opacity: .25, color: '#d95f0e'}
  // response.features[i].properties[dataLayerClass[dataLayer]]
  // chart.data.datasets[i].data
  // console.log(objChartDataLayerByClass.data.labels)
  // console.log(feature);
  // console.log(feature.properties[dataLayerClass[dataLayer]]);
  // console.log(dataLayerClassLabels[dataLayer])
  for ( var i=0; i < 9; i++ ) {
    // console.log(dataLayerClassLabels[dataLayer])
    if (feature.properties[dataLayerClass[dataLayer]]==dataLayerClassLabels[dataLayer][i]) {
      // console.log('match')
      return {fill: true, color: colorRampSolid[i]}
    }

  }
  // return {fill: true, color: colorRampOpacity[0]}

}

var layerWellTowns = '';
function loadMapTownsLayer() {
  // console.log('loadMap ' + url);
  if (layerWellTowns){
    map.removeLayer(layerWellTowns)
  };
  // var dataLayer = $('#selectDataLayer :selected').val();
  // var driller = document.getElementById("selectDriller").value;
  // map.eachLayer(function (layer) {
  //   map.removeLayer(layer);
  // });
  layerWellTowns = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/0',
    // url: url,
    // url: "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=WELL_DRILLER_COMPANY%3D%27AFFORDABLE+WELL+DRILLING%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=WELL_LOCATION_TOWN&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=",
    simplifyFactor: 0.5,
    precision: 5,
    maxZoom: 12,
    minZoom: 6,
    where: "WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'",
    style: function (feature) {
      // return {fill: true, opacity: .25, color: '#d95f0e'}
      return mapTownsSymbolizeByClass(feature);
    },
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(
        '<u>Town Summary:</u> ' + feature.properties.WELL_LOCATION_TOWN + '<br>' +
        'Total Wells: ' + feature.properties.WELL_COUNT + '<br>' +
        'Average Well Depth (ft): ' + feature.properties.WELL_DEPTH_FT   + '<br>' +
        'Average Well Yield (gpm): ' + feature.properties.WELL_YIELD_GPM   + '<br>' +
        'Average Overburden Thickness (ft): ' + feature.properties.OVERBURDEN_THICKNESS_FT   + '<br>' +
        'Average Casing Length (ft): ' + feature.properties.CASING_LENGTH_FT,
        {sticky: true});
    }
  }).addTo(map);
}


// match the current feature's class for selected data layer to get the symbol color
function mapWellsSymbolizeByClass ( feature ) {
  for ( var i=0; i < 9; i++ ) {
    if (feature.properties[dataLayerClass[dataLayer]]==dataLayerClassLabels[dataLayer][i]) {
      return colorRampSolid[i]
    }
  }
}

// var layerWellPoints = L.esri.featureLayer({
//   url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0',
//   // maxZoom: 11,
//   minZoom: 13,
// }).addTo(map);
var layerWellPoints = '';
function loadMapWellsLayer() {
  if (layerWellPoints){
    map.removeLayer(layerWellPoints)
  };
  // var dataLayer = $('#selectDataLayer :selected').val();
  if ( document.getElementById("selectDriller").value == 'ALL' ) {
    drillerWhere = "WELL_DRILLER_COMPANY LIKE '%' OR WELL_DRILLER_COMPANY IS NULL";
  } else {
    drillerWhere = "WELL_DRILLER_COMPANY='" + document.getElementById("selectDriller").value + "'";
  }
  // var driller = document.getElementById("selectDriller").value;
  layerWellPoints = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/3',
    attribution: '<a href="https://www.maine.gov/dacf/mgs/">Maine Geological Survey</a>',
    minZoom: 13,
    where: drillerWhere,
    // style: function (feature) {
    //   return {fill: true
    //     ,opacity: .25
    //     ,color: '#d95f0e'}
    // },
    pointToLayer: function (geojson, latlng) {
      // console.log(geojson);
      // console.log(mapWellsSymbolizeByClass(geojson));
      return L.circleMarker(latlng, {
        // color: 'red'
        // color: mapTownsSymbolizeByClass(geojson)
        fillColor: mapWellsSymbolizeByClass(geojson),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      })
    },
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(
        'Well Number: ' + feature.properties.WELLNO + '<br>' +
        'Town: ' + feature.properties.WELL_LOCATION_TOWN + '<br>' +
        'Well Address: ' + feature.properties.WELL_LOCATION_ADDRESS + '<br>' +
        'Drill Date: ' + feature.properties.DRILL_DATE + '<br>' +
        'Driller: ' + feature.properties.WELL_DRILLER_COMPANY + '<br>' +
        'Well Depth (ft): ' + feature.properties.WELL_DEPTH_FT + '<br>' +
        'Well Yield (gpm): ' + feature.properties.WELL_YIELD_MODIFIER + ' ' + feature.properties.WELL_YIELD_GPM + '<br>' +
        'Overburden Thickness (ft): ' + feature.properties.OVERBURDEN_THICKNESS_FT + '<br>' +
        'Casing Length (ft): ' + feature.properties.CASING_LENGTH_FT + '<br>' +
        'Well Use: ' + feature.properties.WELL_USE + '<br>' +
        'Well Type: ' + feature.properties.WELL_TYPE + '<br>' +
        'Well Construction: ' + feature.properties.WELL_CONSTRUCTION + '<br>' +
        'Well Development: ' + feature.properties.WELL_DEVELOPMENT
        ,
        {sticky: true});
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


  // var dataLayer = $('#selectDataLayer :selected').val();
  // var driller = document.getElementById("selectDriller").value;
  // if (driller == "ALL") {
  //   var whereDriller = encodeURIComponent("(WELL_DRILLER_COMPANY LIKE '%' OR WELL_DRILLER_COMPANY IS NULL)");
  // } else {
    var whereDriller = encodeURIComponent("WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'");
  // }
  var extentFilterMapped = '';
  var hideUnknownTownWells = '';
  if ( $('#checkLimitSpatial').is(':checked') ) {
    // console.log(map.getBounds());
    extentFilterMapped = "&inSR=4326&outSR=4326&geometryType=esriGeometryEnvelope&geometry={" + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "}";
    hideUnknownTownWells = "%20AND%20WELL_LOCATION_TOWN%3C%3E%27UNKNOWN%27"
  }

  // var whereTotalWells = encodeURIComponent(whereDriller);
  // var uriTotalWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereDriller + extentFilterMapped + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  // var uriTotalWells = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=" + whereDriller + extentFilterMapped + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  var uriTotalWells = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22WELL_COUNT%22%2C%22outStatisticFieldName%22%3A%22TotalWells%22%7D%5D&f=pgeojson";
  // console.log(uriTotalWells);
  // var uriTotalWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereDriller + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  // var uriTotalWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=LOCATED%3D%27Yes%27%20AND%20" + whereDriller + extentFilterMapped + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  var uriTotalWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22LOCATED_YES%22%2C%22outStatisticFieldName%22%3A%22WellsLocated%22%7D%5D&f=pgeojson";
// console.log(uriTotalWellsMapped);
  //var uriTotalWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "%20AND%20" + unmappedTownsFilter + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";

  // var d = new Date();
  // var y = d.getFullYear();
  // var whereCurrentYearWells = whereDriller + encodeURIComponent(" AND DRILL_DATE LIKE '%" + y + "%'");
  // var uriCurrentYearWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereCurrentYearWells + extentFilterMapped + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  // var uriCurrentYearWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereCurrentYearWells + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  // var uriCurrentYearWells = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=" + whereCurrentYearWells + extentFilterMapped + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  var uriCurrentYearWells = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22REPORTED_CURRENT_YEAR%22%2C%22outStatisticFieldName%22%3A%22WellsCurrentYear%22%7D%5D&f=pgeojson";
  // var uriCurrentYearWellsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereCurrentYearWells + "%20AND%20" + unmappedTownsFilter + "&returnGeometry=false&featureEncoding=esriDefault&returnCountOnly=true&returnExceededLimitFeatures=true&f=pgeojson";
  // console.log(uriCurrentYearWells);

  // var uriSummaryStats = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22MIN%22%0D%0A++%7D%0D%0A%5D&f=pgeojson";
  // var uriSummaryStatsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=" + whereDriller + extentFilterMapped + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
  // var uriSummaryStatsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereDriller + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
  // var uriSummaryStatsUnmapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/2/query?where=" + whereDriller + "%20AND%20" + unmappedTownsFilter + "&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22min%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MIN%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22avg%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22AVG%22%0D%0A++%7D%2C%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22max%22%2C%0D%0A++++%22onStatisticField%22%3A+%22" + dataLayer + "%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22MAX%22%0D%0A++%7D%0D%0A%5D&f=pgeojson"
  // console.log (uriSummaryStats);
  uriSummaryMinMaxAvg = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22min%22%2C%22onStatisticField%22%3A%22MIN_" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%22MinDataLayer%22%7D%2C%7B%22statisticType%22%3A%22avg%22%2C%22onStatisticField%22%3A%22AVG_" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%22AvgDataLayer%22%7D%2C%7B%22statisticType%22%3A%22max%22%2C%22onStatisticField%22%3A%22MAX_" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%22MaxDataLayer%22%7D%5D&f=pgeojson";
  // console.log (uriSummaryMinMaxAvg);

  var a1 = $.ajax(uriTotalWells, {dataType: "json",success: function(response){ } }),
      a2 = $.ajax(uriTotalWellsMapped, {dataType: "json",success: function(response){ } }),
      a3 = $.ajax(uriCurrentYearWells, {dataType: "json",success: function(response){ } }),
      a4 = $.ajax(uriSummaryMinMaxAvg, {dataType: "json",success: function(response){ } })
      // a4 = $.ajax(uriCurrentYearWellsUnmapped, {dataType: "json",success: function(response){ } }),
      // a5 = $.ajax(uriSummaryStatsMapped, {dataType: "json",success: function(response){ } }),
      // a6 = $.ajax(uriSummaryStatsUnmapped, {dataType: "json",success: function(response){ } })

  $.when(a1, a2, a3, a4).done(function(r1, r2, r3, r4) {
    // Each returned resolve has the following structure:
    // [data, textStatus, jqXHR]
    // e.g. To access returned data, access the array at index 0
    // console.log(r1[0]);
    // console.log(r1[0].properties.count);
    // $("#strTotalWells").text(parseInt(r1[0].properties.count) + parseInt(r2[0].properties.count));
    // $("#strTotalWells").text(r1[0].properties.count);
    $("#strTotalWells").text(r1[0].features[0].properties.TotalWells);
    // console.log(r2[0]);
    // console.log(r2[0].properties.count);
    // $("#strTotalWellsMapped").text(r2[0].properties.count + ' (' + Math.round((parseInt(r2[0].properties.count) / (parseInt(r1[0].properties.count)))*100, 0) + '%)');
    $("#strTotalWellsMapped").text(r2[0].features[0].properties.WellsLocated + ' (' + Math.round((parseInt(r2[0].features[0].properties.WellsLocated) / (parseInt(r1[0].features[0].properties.TotalWells)))*100, 0) + '%)');
    // console.log(r3[0].properties.count);
    // console.log(r4[0].properties.count);
    // $("#strTotalWellsCurrentYear").text(parseInt(r3[0].properties.count) + parseInt(r4[0].properties.count));
    // $("#strTotalWellsCurrentYear").text(parseInt(r3[0].properties.count));
    $("#strTotalWellsCurrentYear").text(parseInt(r3[0].features[0].properties.WellsCurrentYear));
    // console.log(r5[0]);
    // console.log(r6[0]);
    // $("#strMinimumLabel").text($('#selectDataLayer :selected').text());
    // $("#strMinimum").text(parseInt(r5[0].features[0].properties.MIN) + parseInt(r6[0].features[0].properties.MIN));
    // $("#strAverageLabel").text($('#selectDataLayer :selected').text());
    // $("#strAverage").text(Math.round((r5[0].features[0].properties.AVG + r6[0].features[0].properties.AVG)/2),0);
    // $("#strMaximumLabel").text($('#selectDataLayer :selected').text());
    // $("#strMaximum").text(parseInt(r5[0].features[0].properties.MAX) + parseInt(r5[0].features[0].properties.MAX));
    $("#strMinimumLabel").text($('#selectDataLayer :selected').text());
    $("#strMinimum").text(r4[0].features[0].properties.MinDataLayer);
    $("#strAverageLabel").text($('#selectDataLayer :selected').text());
    $("#strAverage").text(Math.round(r4[0].features[0].properties.AvgDataLayer,0));
    $("#strMaximumLabel").text($('#selectDataLayer :selected').text());
    $("#strMaximum").text(r4[0].features[0].properties.MaxDataLayer);
});

  //load the well towns layer
  // var whereDriller = encodeURIComponent("WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'");
  // var uriMapTownsLayer = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/1/query?where=" + whereDriller + extentFilterMapped + "&returnGeometry=true&outSR=4326&f=pgeojson";
  // loadMapTownsLayer(driller.replace(/'/g,"''"));
}

function loadWellDrillers() {
  // var uri = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database/FeatureServer/0/query?where=WELL_DRILLER_COMPANY+LIKE+%27%25%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=WELL_DRILLER_COMPANY&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=WELL_DRILLER_COMPANY&groupByFieldsForStatistics=WELL_DRILLER_COMPANY&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++%22onStatisticField%22%3A+%22WELL_DRILLER_COMPANY%22%0D%0A++%7D%0D%0A%5D&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=";
  var uri = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=WELL_DRILLER_COMPANY+LIKE+%27%25%27&outFields=WELL_DRILLER_COMPANY&returnGeometry=false&orderByFields=WELL_DRILLER_COMPANY&groupByFieldsForStatistics=WELL_DRILLER_COMPANY&outStatistics=%5B%0D%0A%7B%0D%0A%22statisticType%22%3A+%22count%22%2C%0D%0A%22onStatisticField%22%3A%22WELL_DRILLER_COMPANY%22%0D%0A++%7D%0D%0A%5D&f=pgeojson";
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
      // getData();
      getSummaryStatsData();
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


//create the located by year graph with no data
var canvasChartLocatedByYear = document.getElementById('chartLocatedByYear').getContext('2d');
var objChartLocatedByYear = new Chart(canvasChartLocatedByYear, {
  type: 'bar',
  data: {
      labels: [],
      datasets: [{
          label: 'Unlocated',
          data: [],
          backgroundColor: 'rgba(0, 112, 192, 0.75)',
          borderColor: 'rgba(0, 112, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Located',
          data: [],
          backgroundColor: 'rgba(146, 208, 80, 0.75)',
          borderColor: 'rgba(146, 208, 80, 1)',
          borderWidth: 1
        }
      ]
    },
  options: {
    title: {
      display: true,
      text: 'Total Wells Drilled by Year'
    },
    scales: {
      xAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Year'
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Wells'
        }
      }]
    }
  }
})
// console.log(objChartLocatedByYear.data.labels);
// objChartLocatedByYear.data.labels.push('l3','l4');
// objChartLocatedByYear.data.datasets[0].data.push(2,3)
// objChartLocatedByYear.data.datasets[1].data.push(1,1)
// function addData(chart, label, data1, data2) {
//     chart.data.labels.push(label);
//     chart.data.datasets[0].data.push(data1);
//     chart.data.datasets[1].data.push(data2);
//     chart.update();
// }
function addData(chart, label, data) {
    chart.data.labels.push(label);
    for (var i=0; i < data.length; i++) {
      chart.data.datasets[i].data.push(data[i]);
    }
    chart.update();
}
// addData(objChartLocatedByYear,'l3',4,4);
// addData(objChartLocatedByYear,'l4',4,4);
// addData(objChartLocatedByYear,'l5',4,4);
// console.log(objChartLocatedByYear.data.datasets[0].data.length)
function removeData(chart) {
  // console.log(chart.data.datasets[0])
  // var d = chart.data.datasets.length;
  var l = chart.data.datasets[0].data.length;
  for (var i=0; i < l; i++) {
    chart.data.labels.pop();
    for (var d=0; d < chart.data.datasets.length; d++) {
      chart.data.datasets[d].data.pop();
    }
    // chart.data.datasets[0].data.pop();
    // chart.data.datasets[1].data.pop();
  }
  // console.log(chart.data.datasets[0])
}
// removeData(objChartLocatedByYear);


// function removeData(chart) {
//     chart.data.labels.pop();
//     console.log(chart.data.datasets[0])
//     console.log(chart.data.datasets[1])
//     chart.data.datasets[0].data.pop();
//     chart.data.datasets[1].data.pop();
//     console.log(chart.data.datasets[0])
//     console.log(chart.data.datasets[1])
//     chart.update();
// }


// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     console.log(chart.data.labels);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }
//
// function removeData(chart) {
//   console.log(chart.data.datasets[0])
//   console.log(chart.data.datasets[1])
//   chart.data.labels.pop();
//   chart.data.datasets.forEach((dataset) => {
//     console.log(dataset.data)
//     dataset.data.pop();
//   });
//   chart.update();
//   console.log(chart.data.datasets[0])
//   console.log(chart.data.datasets[1])
// }
// removeData(objChartLocatedByYear);


function loadChartLocatedByYear() {
  // var driller = document.getElementById("selectDriller").value;
  if (driller == "ALL") {
    var whereDriller = encodeURIComponent("(WELL_DRILLER_COMPANY LIKE '%' OR WELL_DRILLER_COMPANY IS NULL)");
  } else {
    var whereDriller = encodeURIComponent("WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'");
  }
  var extentFilterMapped = '';
  var hideUnknownTownWells = '';
  if ( $('#checkLimitSpatial').is(':checked') ) {
    extentFilterMapped = "&inSR=4326&outSR=4326&geometryType=esriGeometryEnvelope&geometry={" + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "}";
    hideUnknownTownWells = "%20AND%20WELL_LOCATION_TOWN%3C%3E%27UNKNOWN%27"
  }

  //need to change LOCATED field to 2 fields LOCATED_YES and LOCATED_NO (1 and 0) and then can do one AJAX call to get all statsValues

  // var uriYearsLabels = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=DRILL_DATE_YEAR%20IS%20NOT%20NULL%20AND%20" + whereDriller + extentFilterMapped + "&outFields=DRILL_DATE_YEAR&returnGeometry=false&orderByFields=DRILL_DATE_YEAR&groupByFieldsForStatistics=DRILL_DATE_YEAR&outStatistics=%5B%0D%0A%7B%0D%0A%22statisticType%22%3A%22count%22%2C%0D%0A%22onStatisticField%22%3A%22WELLNO%22%2C%0D%0A%22outStatisticFieldName%22%3A%22WELLS%22%0D%0A%7D%0D%0A%5D&f=pgeojson"
  // // console.log(uriYearsLabels);
  // var uriLocatedByYear = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=DRILL_DATE_YEAR%20IS%20NOT%20NULL%20AND%20LOCATED%3D%27Yes%27%20AND%20" + whereDriller + extentFilterMapped + "&outFields=DRILL_DATE_YEAR&returnGeometry=false&orderByFields=DRILL_DATE_YEAR&groupByFieldsForStatistics=DRILL_DATE_YEAR&outStatistics=%5B%0D%0A%7B%0D%0A%22statisticType%22%3A%22count%22%2C%0D%0A%22onStatisticField%22%3A%22WELLNO%22%2C%0D%0A%22outStatisticFieldName%22%3A%22WellsLocated%22%0D%0A%7D%0D%0A%5D&f=pgeojson"
  // console.log(uriLocatedByYear);
  // var uriUnlocatedByYear = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=DRILL_DATE_YEAR%20IS%20NOT%20NULL%20AND%20LOCATED%3D%27No%27%20AND%20" + whereDriller + extentFilterMapped + "&outFields=DRILL_DATE_YEAR&returnGeometry=false&orderByFields=DRILL_DATE_YEAR&groupByFieldsForStatistics=DRILL_DATE_YEAR&outStatistics=%5B%0D%0A%7B%0D%0A%22statisticType%22%3A%22count%22%2C%0D%0A%22onStatisticField%22%3A%22WELLNO%22%2C%0D%0A%22outStatisticFieldName%22%3A%22WellsUnlocated%22%0D%0A%7D%0D%0A%5D&f=pgeojson"
  // console.log(uriUnlocatedByYear);

  var uriChartLocatedByYear = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=DRILL_DATE_YEAR%20IS%20NOT%20NULL%20AND%20" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&outFields=DRILL_DATE_YEAR&returnGeometry=false&orderByFields=DRILL_DATE_YEAR&groupByFieldsForStatistics=DRILL_DATE_YEAR&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22LOCATED_YES%22%2C%22outStatisticFieldName%22%3A%22WellsLocated%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22LOCATED_NO%22%2C%22outStatisticFieldName%22%3A%22WellsUnlocated%22%7D%5D&f=pgeojson"
  // console.log(uriChartLocatedByYear);

  $.ajax(uriChartLocatedByYear, {
    dataType: "json",
    success: function(response){
      // console.log(response);
      // console.log(response.features.length);
      removeData(objChartLocatedByYear);
      // var arrayYearsLabels = [], arrayYearLocated = [], arrayYearUnlocated = [];
      for (var i=0; i < response.features.length; i++) {
        // arrayYearsLabels.push(response.features[i].properties.DRILL_DATE_YEAR);
        // arrayYearLocated.push(response.features[i].properties.WellsLocated);
        // arrayYearUnlocated.push(response.features[i].properties.WellsUnlocated);
        // addData(objChartLocatedByYear, response.features[i].properties.DRILL_DATE_YEAR, response.features[i].properties.WellsLocated);
        // addData(objChartLocatedByYear, response.features[i].properties.DRILL_DATE_YEAR, response.features[i].properties.WellsUnlocated, response.features[i].properties.WellsLocated);
        addData(objChartLocatedByYear, response.features[i].properties.DRILL_DATE_YEAR, [response.features[i].properties.WellsUnlocated, response.features[i].properties.WellsLocated]);
      }
      // addData(objChartLocatedByYear, arrayYearsLabels, arrayYearLocated);


      // var ctx = document.getElementById('chartLocatedByYear').getContext('2d');
      // if (objChartLocatedByYear) {
      //   console.log('clear');
      //   objChartLocatedByYear.clear();
      // };
      // var objChartLocatedByYear = new Chart(ctx, {
      //   type: 'bar',
      //   data: {
      //     // labels: ['2005', '2006', '2007', '2008','2009'],
      //     labels: arrayYearsLabels,
      //     datasets: [{
      //         label: 'Unlocated',
      //         // data: [12,5,9,12,13],
      //         data: arrayYearUnlocated,
      //         backgroundColor: 'rgba(0, 112, 192, 0.75)',
      //         borderColor: 'rgba(0, 112, 192, 1)',
      //         borderWidth: 1
      //       },
      //       {
      //         label: 'Located',
      //         // data: [9,8,2,10,8],
      //         data: arrayYearLocated,
      //         backgroundColor: 'rgba(146, 208, 80, 0.75)',
      //         borderColor: 'rgba(146, 208, 80, 1)',
      //         borderWidth: 1
      //       }
      //     ]
      //   },
      //   options: {
      //     title: {
      //       display: true,
      //       text: 'Total Wells Drilled by Year'
      //     },
      //     scales: {
      //       xAxes: [{ stacked: true }],
      //       yAxes: [{
      //         ticks: {
      //           beginAtZero: true
      //         },
      //         stacked: true
      //       }]
      //     }
      //   }
      // })
    }
  })




  // var a1 = $.ajax(uriYearsLabels, {dataType: "json",success: function(response){ } }),
  //     a2 = $.ajax(uriLocatedByYear, {dataType: "json",success: function(response){ } }),
  //     a3 = $.ajax(uriUnlocatedByYear, {dataType: "json",success: function(response){ } })
  //
  // $.when(a1, a2, a3).done(function(r1, r2, r3) {
  //   // console.log(r1[0]);
  //   console.log(r1[0].features.length);
  //   var arrayYearsLabels = [];
  //   for (var i=0; i < r1[0].features.length; i++) {
  //     arrayYearsLabels.push(r1[0].features[i].properties.DRILL_DATE_YEAR);
  //   }
  //   // console.log(arrayYearsLabels)
  //
  //   console.log(r2[0]);
  //   console.log(r2[0].features.length);
  //   var arrayLocatedByYear = [];
  //   for (var i=0; i < r2[0].features.length; i++) {
  //     arrayLocatedByYear.push(r2[0].features[i].properties.WellsLocated);
  //   }
  //   console.log(arrayLocatedByYear)
  //
    // var ctx = document.getElementById('chartLocatedByYear').getContext('2d');
    // var myChart = new Chart(ctx, {
    //   type: 'bar',
    //   data: {
    //     // labels: ['2005', '2006', '2007', '2008','2009'],
    //     labels: arrayYearsLabels,
    //     datasets: [{
    //         label: 'Unlocated',
    //         // data: [12,5,9,12,13],
    //         data: arrayYearUnlocated,
    //         backgroundColor: 'rgba(0, 112, 192, 0.75)',
    //         borderColor: 'rgba(0, 112, 192, 1)',
    //         borderWidth: 1
    //       },
    //       {
    //         label: 'Located',
    //         // data: [9,8,2,10,8],
    //         data: arrayYearLocated,
    //         backgroundColor: 'rgba(146, 208, 80, 0.75)',
    //         borderColor: 'rgba(146, 208, 80, 1)',
    //         borderWidth: 1
    //       }
    //     ]
    //   },
    //   options: {
    //     title: {
    //       display: true,
    //       text: 'Total Wells Drilled by Year'
    //     },
    //     scales: {
    //       xAxes: [{ stacked: true }],
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         },
    //         stacked: true
    //       }]
    //     }
    //   }
    // });
  // });
};


//create the data_layer map class graph with no data
var canvasChartDataLayerByClass = document.getElementById('chartDataLayerByClass').getContext('2d');
var objChartDataLayerByClass = new Chart(canvasChartDataLayerByClass, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      // label: '',  //'# of Votes',
      data: [],
      backgroundColor: colorRampSolid,
      borderColor: colorRampSolid,
      // backgroundColor: 'rgba(146, 208, 80, 0.75)',
      // borderColor: 'rgba(146, 208, 80, 1)',
      borderWidth: 1
    }]
  },
  options: {
    title: {
      display: true,
      text: ''  //'[Data Layer] by Map Class'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Wells'
        }

      }]
    },
    legend: {
      display: false
    }
  }
});


function loadChartDataLayerByClass() {
  // var dataLayer = $('#selectDataLayer :selected').val();
  // var driller = document.getElementById("selectDriller").value;
  if (driller == "ALL") {
    var whereDriller = encodeURIComponent("(WELL_DRILLER_COMPANY LIKE '%' OR WELL_DRILLER_COMPANY IS NULL)");
  } else {
    var whereDriller = encodeURIComponent("WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'");
  }
  var extentFilterMapped = '';
  var hideUnknownTownWells = '';
  if ( $('#checkLimitSpatial').is(':checked') ) {
    extentFilterMapped = "&inSR=4326&outSR=4326&geometryType=esriGeometryEnvelope&geometry={" + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "}";
    hideUnknownTownWells = "%20AND%20WELL_LOCATION_TOWN%3C%3E%27UNKNOWN%27"
  }

  // var uriChartDataLayerByClass = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/0/query?where=WELL_YIELD_CLASS%3C%3E%27%27%20AND%20" + whereDriller + extentFilterMapped + "&returnGeometry=false&orderByFields=ListOrder&groupByFieldsForStatistics=WELL_DRILLER_COMPANY," + dataLayerClass[dataLayer] + "&outStatistics=%5B%7B%22statisticType%22%3A%20%22sum%22%2C%22onStatisticField%22%3A%20%22WELL_COUNT%22%2C%22outStatisticFieldName%22%3A%20%22WELLS%22%7D%2C%7B%22statisticType%22%3A%20%22avg%22%2C%22onStatisticField%22%3A%20%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22ListOrder%22%7D%5D&f=pgeojson"
  var uriChartDataLayerByClass = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=" + dataLayerClass[dataLayer] + "%3C%3E%27%27%20AND%20" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&orderByFields=ListOrder&groupByFieldsForStatistics=" + dataLayerClass[dataLayer] + "&outStatistics=%5B%7B%22statisticType%22%3A%20%22count%22%2C%22onStatisticField%22%3A%20%22WELLNO%22%2C%22outStatisticFieldName%22%3A%20%22WELLS%22%7D%2C%7B%22statisticType%22%3A%20%22avg%22%2C%22onStatisticField%22%3A%20%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22ListOrder%22%7D%5D&f=pgeojson"
  // console.log(uriChartDataLayerByClass);

  $.ajax(uriChartDataLayerByClass, {
    dataType: "json",
    success: function(response){
      // console.log(response);
      // console.log(response.features.length);
      removeData(objChartDataLayerByClass);
      objChartDataLayerByClass.options.title.text = 'Wells by ' + $('#selectDataLayer :selected').text() + ' Class';
      // objChartDataLayerByClass.data.datasets[0].label = 'Map Class';
      for (var i=0; i < response.features.length; i++) {
        // console.log(response.features[i].properties[dataLayerClass[dataLayer]]);
        // console.log(response.features[i].properties.WELLS);
        addData(objChartDataLayerByClass, response.features[i].properties[dataLayerClass[dataLayer]], [response.features[i].properties.WELLS]);
      }
    }
  })
}



// function loadChartDataLayerByClass() {
//   var ctx = document.getElementById('chartDataLayerByClass').getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//       datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(255, 206, 86, 0.2)',
//           'rgba(75, 192, 192, 0.2)',
//           'rgba(153, 102, 255, 0.2)',
//           'rgba(255, 159, 64, 0.2)'
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       title: {
//         display: true,
//         text: '[Data Layer] by Map Class'
//       },
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     }
//   });
// }


function reloadTable() {
  var table = $('#tableDataTable').DataTable();
  table.clear();
  table.draw();
  table.ajax.url("https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=OBJECTID%3C100&outFields=*&returnGeometry=false&f=json").load();
};

function loadDataTable () {
  $('#tableDataTable').DataTable( {
    "ajax": {"url":"https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=OBJECTID%3C100&outFields=*&returnGeometry=false&f=json",
    "dataSrc": "features"},
    "columns": [
					{ data: "attributes.WELLNO" },
					{ data: "attributes.DRILL_DATE" },
          { data: "attributes.WELL_LOCATION_TOWN" },
          { data: "attributes.WELL_LOCATION_ADDRESS" },
          { data: "attributes.TAX_MAP_NO" },
          { data: "attributes.TAX_LOT_NO" },
          { data: "attributes.WELL_USE" },
          { data: "attributes.WELL_TYPE" },
          { data: "attributes.WELL_DEVELOPMENT" },
          { data: "attributes.WELL_DEPTH_FT" },
          { data: "attributes.WELL_YIELD_GPM" },
          { data: "attributes.OVERBURDEN_THICKNESS_FT" },
          { data: "attributes.CASING_LENGTH_FT" },
          { data: "attributes.WELL_DRILLER_COMPANY" },
          { data: "attributes.LOCATED" }
					],
    "scrollY": "18vh",
    // "scrollY": "150px",
    "scrollX": true,
    // "scrollCollapse": true,
    "paging": false,
    // "autoWidth": true,
    // "bFilter": false,
    "bInfo" : false,
    // responsive: true
  });
  $('#table').DataTable().columns.adjust().draw();
}



$('#selectDataLayer').on('change', function () {
	// var driller = document.getElementById("selectDriller").value;
  // getDataTotalWellsMapped(driller);
  // getDataTotalWellsUnMapped(driller);
  // getDataCurrentYearWells(driller);
  // console.log(document.getElementById("selectDataLayer").value)
  // console.log($('#selectDataLayer :selected').val())
  // console.log($('#selectDataLayer :selected').text())
  dataLayer = $('#selectDataLayer :selected').val();
  // console.log(dataLayer)
  // getData();
  getSummaryStatsData();
  loadMapTownsLayer();
  loadMapWellsLayer();
  // loadChartLocatedByYear();
  loadChartDataLayerByClass();
});
$('#selectDriller').on('change', function () {
	// var driller = document.getElementById("selectDriller").value;
  // getDataTotalWellsMapped(driller);
  // getDataTotalWellsUnMapped(driller);
  // getDataCurrentYearWells(driller);
  // console.log(document.getElementById("selectDataLayer").value)
  // console.log($('#selectDataLayer :selected').val())
  // console.log($('#selectDataLayer :selected').text())
  driller = document.getElementById("selectDriller").value;
  // getData();
  getSummaryStatsData();
  loadMapTownsLayer();
  loadMapWellsLayer();
  loadChartLocatedByYear();
  loadChartDataLayerByClass();
});

$('#checkLimitSpatial').on('change', function () {
  // getData();
  getSummaryStatsData();
  loadChartLocatedByYear();
  loadChartDataLayerByClass();
});

var dataLayer = $('#selectDataLayer :selected').val();
var driller = document.getElementById("selectDriller").value;

// map.on('zoomend', function(e) { console.log(map.getZoom()); });
map.on('moveend', function() {
     // console.log(map.getBounds());
     // console.log(map.getZoom());
     // console.log($('#checkLimitSpatial').is(':checked'));
     // console.log(document.getElementById("checkLimitSpatial").checked);
     if ( $('#checkLimitSpatial').is(':checked') ) {
       getSummaryStatsData();
       loadChartLocatedByYear();
       loadChartDataLayerByClass();
     }
});

$(document).ready(function() {
  loadWellDrillers();
  loadDataTable();
  loadMapTownsLayer();
  loadMapWellsLayer();
  loadChartLocatedByYear();
  loadChartDataLayerByClass();
} );

})(); //last line of main.js - self-executing anonymous function
