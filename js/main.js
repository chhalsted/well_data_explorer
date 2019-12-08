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

//add layer control for base map and reference geoJSON layers
L.control.layers(
  {
    "MapBox Grayscalse":baseLayerMBGrayscale,
    "Open Street Map":baseLayerOSM,
    "Stamen Terrain":baseLayerStamen,
    "Esri Imagery":baseLayerEsri,
  },
  {
    // "Road Names":layerRoadNamess,
    // "Parcels":layerParcels,
    // "Parcesl UT":layerParcelsUT
  },
  {
    sortLayers: false,
    collapsed: true,
    autoZIndex: true,
  }).addTo(map);


//loads the default Maine Towns layer into the map to show outlines when zoomed in viewing well point locations, will not show in Layer Control
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
}).addTo(map);


//color ramp arrays for data layer classes, one with opacity
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
var dataLayerClassLabels = {
  'WELL_DEPTH_FT':["0 - 50", "50.1 - 100", "100.1 - 150", "150.1 - 200", "200.1 - 300", "300.1 - 400", "400.1 - 500", "500.1 - 1000", "1000+"],
  'WELL_YIELD_GPM':["0 - 2", "2.1 - 4", "4.1 - 6", "6.1 - 10", "10.1 - 15", "15.1 - 30", "30.1 - 60", "60.1 - 100", "100+"],
  'OVERBURDEN_THICKNESS_FT':["0 - 5", "5.1 - 10", "10.1 - 20", "20.1 - 30", "30.1 - 40", "40.1 - 50", "50.1 - 75", "75.1 - 100", "100+"],
  'CASING_LENGTH_FT':["0 - 10", "10.1 - 20", "20.1 - 30", "30.1 - 50", "50.1 - 75", "75.1 - 100", "100.1 - 250", "250.1 - 500", "500+"]
}

// match the current feature's class attribute value for selected data layer to get the symbol color
function mapTownsSymbolizeByClass ( feature ) {
  for ( var i=0; i < 9; i++ ) {
    if (feature.properties[dataLayerClass[dataLayer]]==dataLayerClassLabels[dataLayer][i]) {
      return {fill: true, color: colorRampSolid[i]}
    }
  }
}

// adds the towns layer with summary data to the map and formats the tool tip
var layerWellTowns = '';
function loadMapTownsLayer() {
  // console.log('loadMap ' + url);
  if (layerWellTowns){
    map.removeLayer(layerWellTowns)
  };
  layerWellTowns = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/0',
    simplifyFactor: 0.5,
    precision: 5,
    maxZoom: 12,
    minZoom: 6,
    where: "WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'",
    style: function (feature) {
      return mapTownsSymbolizeByClass(feature);
    },
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(
        '<table class="toolTipTable">' +
        '<tr><td><u>Town Summary:</u></td><td>' + feature.properties.WELL_LOCATION_TOWN + '</td>' +
        '<tr><td>Total Wells:</td><td>' + feature.properties.WELL_COUNT + '</td>' +
        '<tr><td>Average Well Depth (ft):</td><td>' + Math.round(feature.properties.WELL_DEPTH_FT,0)   + '</td>' +
        '<tr><td>Average Well Yield (gpm):</td><td>' + Math.round(feature.properties.WELL_YIELD_GPM,0)   + '</td>' +
        '<tr><td>Average Bedrock Depth (ft):</td><td>' + Math.round(feature.properties.OVERBURDEN_THICKNESS_FT,0)   + '</td>' +
        '<tr><td>Average Casing Length (ft):</td><td>' + Math.round(feature.properties.CASING_LENGTH_FT,0) +
        '</table>',
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

// adds the well points layer to the map and formats the tool tip
var layerWellPoints = '';
function loadMapWellsLayer() {
  if (layerWellPoints){
    map.removeLayer(layerWellPoints)
  };
  if ( document.getElementById("selectDriller").value == 'ALL' ) {
    drillerWhere = "WELL_DRILLER_COMPANY LIKE '%' OR WELL_DRILLER_COMPANY IS NULL";
  } else {
    drillerWhere = "WELL_DRILLER_COMPANY='" + document.getElementById("selectDriller").value + "'";
  }
  layerWellPoints = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/3',
    attribution: '<a href="https://www.maine.gov/dacf/mgs/">Maine Geological Survey</a>',
    minZoom: 13,
    where: drillerWhere,
    pointToLayer: function (geojson, latlng) {
      var layer = L.circleMarker(latlng, {
        fillColor: mapWellsSymbolizeByClass(geojson),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      })
      return layer;
    },
    onEachFeature: function (feature, layer) {
      var fDate = new Date(feature.properties.DRILL_DATE);
      layer.bindTooltip(
        '<u>Well Data:</u><br>' +
        '<table class="toolTipTable">' +
        '<tr><td>Well Number:</td><td>' + feature.properties.WELLNO + '</td>' +
        '<tr><td>Town:</td><td>' + feature.properties.WELL_LOCATION_TOWN + '</td>' +
        '<tr><td>Well Address:</td><td>' + feature.properties.WELL_LOCATION_ADDRESS + '</td>' +
        '<tr><td>Drill Date:</td><td>' + getFormattedDate(fDate) + '</td>' +
        '<tr><td>Driller:</td><td>' + feature.properties.WELL_DRILLER_COMPANY + '</td>' +
        '<tr><td>Well Depth (ft):</td><td>' + feature.properties.WELL_DEPTH_FT + '</td>' +
        '<tr><td>Well Yield (gpm):</td><td>' + feature.properties.WELL_YIELD_MODIFIER + ' ' + feature.properties.WELL_YIELD_GPM + '</td>' +
        '<tr><td>Bedrock Depth (ft):</td><td>' + feature.properties.OVERBURDEN_THICKNESS_FT + '</td>' +
        '<tr><td>Casing Length (ft):</td><td>' + feature.properties.CASING_LENGTH_FT + '</td>' +
        '<tr><td>Well Use:</td><td>' + feature.properties.WELL_USE + '</td>' +
        '<tr><td>Well Type:</td><td>' + feature.properties.WELL_TYPE + '</td>' +
        '<tr><td>Well Construction:</td><td>' + feature.properties.WELL_CONSTRUCTION + '</td>' +
        '<tr><td>Well Development:</td><td>' + feature.properties.WELL_DEVELOPMENT + '</td>' +
        '</table>',
        {sticky: true});
    }
  }).addTo(map);
}

// builds the query and loads the response data into the Summary Stats div
function loadSummaryStatsData() {
  var whereDriller = encodeURIComponent("WELL_DRILLER_COMPANY='" + driller.replace(/'/g,"''") + "'");
  var extentFilterMapped = '';
  var hideUnknownTownWells = '';
  if ( $('#checkLimitSpatial').is(':checked') ) {
    // console.log(map.getBounds());
    extentFilterMapped = "&inSR=4326&outSR=4326&geometryType=esriGeometryEnvelope&geometry={" + map.getBounds()._southWest.lng + "," + map.getBounds()._southWest.lat + "," + map.getBounds()._northEast.lng + "," + map.getBounds()._northEast.lat + "}";
    hideUnknownTownWells = "%20AND%20WELL_LOCATION_TOWN%3C%3E%27UNKNOWN%27"
  }

  var uriTotalWells = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22WELL_COUNT%22%2C%22outStatisticFieldName%22%3A%22TotalWells%22%7D%5D&f=pgeojson";
  var uriTotalWellsMapped = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22LOCATED_YES%22%2C%22outStatisticFieldName%22%3A%22WellsLocated%22%7D%5D&f=pgeojson";
  var uriCurrentYearWells = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22REPORTED_CURRENT_YEAR%22%2C%22outStatisticFieldName%22%3A%22WellsCurrentYear%22%7D%5D&f=pgeojson";
  uriSummaryMinMaxAvg = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/2/query?where=" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&outStatistics=%5B%7B%22statisticType%22%3A%22min%22%2C%22onStatisticField%22%3A%22MIN_" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%22MinDataLayer%22%7D%2C%7B%22statisticType%22%3A%22avg%22%2C%22onStatisticField%22%3A%22AVG_" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%22AvgDataLayer%22%7D%2C%7B%22statisticType%22%3A%22max%22%2C%22onStatisticField%22%3A%22MAX_" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%22MaxDataLayer%22%7D%5D&f=pgeojson";

  var a1 = $.ajax(uriTotalWells, {dataType: "json",success: function(response){ } }),
      a2 = $.ajax(uriTotalWellsMapped, {dataType: "json",success: function(response){ } }),
      a3 = $.ajax(uriCurrentYearWells, {dataType: "json",success: function(response){ } }),
      a4 = $.ajax(uriSummaryMinMaxAvg, {dataType: "json",success: function(response){ } })

  $.when(a1, a2, a3, a4).done(function(r1, r2, r3, r4) {
    // Each returned resolve has the following structure:
    // [data, textStatus, jqXHR]
    // e.g. To access returned data, access the array at index 0
    // console.log(r1[0]);
    $("#strTotalWells").text(r1[0].features[0].properties.TotalWells);
    $("#strTotalWellsMapped").text(r2[0].features[0].properties.WellsLocated + ' (' + Math.round((parseInt(r2[0].features[0].properties.WellsLocated) / (parseInt(r1[0].features[0].properties.TotalWells)))*100, 0) + '%)');
    $("#strTotalWellsCurrentYear").text(parseInt(r3[0].features[0].properties.WellsCurrentYear));
    $("#strMinimumLabel").text($('#selectDataLayer :selected').text());
    $("#strMinimum").text(r4[0].features[0].properties.MinDataLayer);
    $("#strAverageLabel").text($('#selectDataLayer :selected').text());
    $("#strAverage").text(Math.round(r4[0].features[0].properties.AvgDataLayer,0));
    $("#strMaximumLabel").text($('#selectDataLayer :selected').text());
    $("#strMaximum").text(r4[0].features[0].properties.MaxDataLayer);
  });
}


// loads the list of all Well Drillers into the well driller drop down box
function loadWellDrillers() {
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
      loadSummaryStatsData();
    }
  });
}


// global setting to apply font family to all charts
Chart.defaults.global.defaultFontFamily = 'Noto Sans';

//create the Wells Located by Year graph with no data
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

// helper function to add the labels and datasets to the passed graph object
function addData(chart, label, data) {
    chart.data.labels.push(label);
    for (var i=0; i < data.length; i++) {
      chart.data.datasets[i].data.push(data[i]);
    }
    chart.update();
}

// helper function to remove the labels and datasets from passed graph object
function removeData(chart) {
  var l = chart.data.datasets[0].data.length;
  for (var i=0; i < l; i++) {
    chart.data.labels.pop();
    for (var d=0; d < chart.data.datasets.length; d++) {
      chart.data.datasets[d].data.pop();
    }
  }
}

// builds the query and loads the response data into the Wells Located by Year graph
function loadChartLocatedByYear() {
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

  var uriChartLocatedByYear = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=DRILL_DATE_YEAR%20IS%20NOT%20NULL%20AND%20" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&outFields=DRILL_DATE_YEAR&returnGeometry=false&orderByFields=DRILL_DATE_YEAR&groupByFieldsForStatistics=DRILL_DATE_YEAR&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22LOCATED_YES%22%2C%22outStatisticFieldName%22%3A%22WellsLocated%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22LOCATED_NO%22%2C%22outStatisticFieldName%22%3A%22WellsUnlocated%22%7D%5D&f=pgeojson"

  $.ajax(uriChartLocatedByYear, {
    dataType: "json",
    success: function(response){
      removeData(objChartLocatedByYear);
      for (var i=0; i < response.features.length; i++) {
        addData(objChartLocatedByYear, response.features[i].properties.DRILL_DATE_YEAR, [response.features[i].properties.WellsUnlocated, response.features[i].properties.WellsLocated]);
      }
    }
  })
};


// create the data_layer map class graph with no data
var canvasChartDataLayerByClass = document.getElementById('chartDataLayerByClass').getContext('2d');
var objChartDataLayerByClass = new Chart(canvasChartDataLayerByClass, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: colorRampSolid,
      borderColor: colorRampSolid,
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


// builds the query and loads the response data into the Wells by Class graph
function loadChartDataLayerByClass() {
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

  var uriChartDataLayerByClass = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=" + dataLayerClass[dataLayer] + "%3C%3E%27%27%20AND%20" + whereDriller + hideUnknownTownWells + extentFilterMapped + "&returnGeometry=false&orderByFields=ListOrder&groupByFieldsForStatistics=" + dataLayerClass[dataLayer] + "&outStatistics=%5B%7B%22statisticType%22%3A%20%22count%22%2C%22onStatisticField%22%3A%20%22WELLNO%22%2C%22outStatisticFieldName%22%3A%20%22WELLS%22%7D%2C%7B%22statisticType%22%3A%20%22avg%22%2C%22onStatisticField%22%3A%20%22" + dataLayer + "%22%2C%22outStatisticFieldName%22%3A%20%22ListOrder%22%7D%5D&f=pgeojson"

  $.ajax(uriChartDataLayerByClass, {
    dataType: "json",
    success: function(response){
      removeData(objChartDataLayerByClass);
      objChartDataLayerByClass.options.title.text = 'Wells by ' + $('#selectDataLayer :selected').text() + ' Class';
      // objChartDataLayerByClass.data.datasets[0].label = 'Map Class';
      for (var i=0; i < response.features.length; i++) {
        addData(objChartDataLayerByClass, response.features[i].properties[dataLayerClass[dataLayer]], [response.features[i].properties.WELLS]);
      }
    }
  })
}


// function reloadTable() {
//   var table = $('#tableDataTable').DataTable();
//   table.clear();
//   table.draw();
//   table.ajax.url("https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/1/query?where=OBJECTID%3C100&outFields=*&returnGeometry=false&f=json").load();
// };

function loadDataTable () {
  // loadTableHeaders();
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
    // "bInfo" : false,
    // responsive: true
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Search records"
    },
    // "dom": '<"wrapper"><lfi<t>p>',
    // buttons: [
    //         'copy', 'csv', 'excel', 'pdf', 'print'
    //     ]
  });
  $('#table').DataTable().columns.adjust().draw();
}

// create legend container in the lower right of the map
function loadLegend() {
  $(".legend").remove();
  var legendContainer = L.control({position: 'bottomright'});
  legendContainer.onAdd = function (map) {
    L.DomEvent.addListener(legendContainer, 'mousedown', function(e) {
    	L.DomEvent.stopPropagation(e);
  	});
    var div = L.DomUtil.create('div', 'info legend');
    var units = "(" + (dataLayer.substring( dataLayer.lastIndexOf("_") + 1, dataLayer.lastIndexOf("_") + 4)).toLowerCase() + ")";
    div.innerHTML += "<h3 id='legendTitle'>" + $('#selectDataLayer :selected').text() + " " + units + "</h3>";
    // loop through current data layer color ramp and generate a label with a colored square for each interval
    for (var i = 0; i < colorRampSolid.length; i++) {
        div.innerHTML += '<i style="background:' + colorRampSolid[i] + '"></i> ' + dataLayerClassLabels[dataLayer][i] + '<br>' ;
    }
    return div;
  };
  legendContainer.addTo(map);
}

// function to take a date returned as UNIX-standard and convert to m/d/yyyy format
function getFormattedDate(date) {
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  // month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  // day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}

// fires after the data layer selection is changed
$('#selectDataLayer').on('change', function () {
  dataLayer = $('#selectDataLayer :selected').val();
  loadSummaryStatsData();
  loadMapTownsLayer();
  loadMapWellsLayer();
  loadChartDataLayerByClass();
  loadLegend();
});

// fires after the driller selection is changed
$('#selectDriller').on('change', function () {
  driller = $('#selectDriller :selected').val();
  loadSummaryStatsData();
  loadMapTownsLayer();
  loadMapWellsLayer();
  loadChartLocatedByYear();
  loadChartDataLayerByClass();
});

// fires when the Limit records by map extent is turned on or off and refreshes the summary stats and graphs
$('#checkLimitSpatial').on('change', function () {
  loadSummaryStatsData();
  loadChartLocatedByYear();
  loadChartDataLayerByClass();
});

// function global variables to store the values of the drop down boxes and zoom before/after values
var dataLayer = $('#selectDataLayer :selected').val();
var driller = $('#selectDriller :selected').val();   // var driller = document.getElementById("selectDriller").value;
var mapZoom = map.getZoom();
var mapZoomBefore = 0;

// fires after the map is panned or zoomed, if
map.on('moveend', function() {
     // console.log(map.getBounds());
     // console.log(map.getZoom());
     mapZoomBefore = mapZoom;
     mapZoom = map.getZoom();
     if ( $('#checkLimitSpatial').is(':checked') ) {
       loadSummaryStatsData();
       loadChartLocatedByYear();
       loadChartDataLayerByClass();
     }
     if ((mapZoomBefore == 12 && mapZoom == 13) || (mapZoomBefore == 13 && mapZoom == 12)) {
      console.log('reload table');
      // reloadTable();
    }
});

// initially load well drillers drop down, map, graphs, attribute table
$(document).ready(function() {
  loadWellDrillers();
  loadMapTownsLayer();
  loadMapWellsLayer();
  loadChartLocatedByYear();
  loadChartDataLayerByClass();
  loadLegend();
  loadDataTable();
} );


// //test loading dates
// var uri = "https://services1.arcgis.com/RbMX0mRVOFNTdLzd/ArcGIS/rest/services/MGS_Wells_Database_Dashboard/FeatureServer/3/query?where=WELLNO%3D105790&outFields=WELLNO%2C+WELL_DRILLER_COMPANY%2C+DRILL_DATE&returnGeometry=false&f=pgeojson";
// $.ajax(uri, {
//   dataType: "json"
//   ,success: function(response){
//     console.log(response);
//     var fDate = new Date(response.features[0].properties.DRILL_DATE);
//     // console.log(fDate.toDateString());
//     console.log(getFormattedDate(fDate));
//   }
// });

})(); //last line of main.js - self-executing anonymous function
