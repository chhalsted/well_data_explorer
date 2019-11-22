//Christian Halsted 2019
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
function jQueryAjax(){
    //basic jQuery ajax method
    $.ajax("data/citypop.geojson", {
        dataType: "json",
        success: callback
    });
};

//define callback function
function callback(response, status, jqXHRobject){
    //TASKS USING THE DATA GO HERE
    //console.log(response);
    $(mydiv).append('<br>GeoJSON data:<br>' + JSON.stringify(response));
};

$(document).ready(jQueryAjax);

