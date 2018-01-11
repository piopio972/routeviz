/**
 * Created by Piotr on 26.10.2017.
 */
var tramIcon = L.icon({
    iconUrl: '/tram.png',
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [-30, -76] // point from which the popup should open relative to the iconAnchor
});
var busIcon = L.icon({
    iconUrl: '/bus.png',
    iconSize:     [25, 25], // size of the icon
    iconAnchor:   [12, 25], // point of the icon which will correspond to marker's location
    popupAnchor:  [-25, -76] // point from which the popup should open relative to the iconAnchor
});

var lines = new Array();
var markers = [];




function refreshMarkers() {

    $.ajax({
        type     : "GET",
        url      : Routing.generate('getPositions'),
        dataType: 'json',
        // timeout: 5000,
        success: function(ret) {

            $.each(ret, function (key, value) {

                if(markers.hasOwnProperty(value["code"])){
                    markers[value["code"]].setLatLng([value["y"],value["x"]]);
                }
                else{

                    var marker;

                    if(value["type"] == "TRAM"){
                        marker = new L.marker([value["y"],value["x"]], {"code" : value["code"], "icon" : tramIcon});

                    }
                    else {
                        marker = new L.marker([value["y"],value["x"]], {"code" : value["code"], "icon" : busIcon});

                    }
                    markers[value["code"]] = marker;

                    if(lines.hasOwnProperty(value["line"])){
                        lines[value["line"]].addLayer(marker);
                    }
                    else{
                        lines[value["line"]] = new L.LayerGroup().addLayer(marker);
                    }
                }
            });

        },
        complete: function(jqXHR) {

            setTimeout(refreshMarkers,15000);
        },
        error: function(jqXHR, errorText, errorThrown) {
            alert(errorText);
        }
    });
}

function addMarkers() {

    $.ajax({
        type     : "GET",
        url      : Routing.generate('getPositions'),
        dataType: 'json',

        success: function(ret) {

            $.each(ret, function (key, value) {

                var marker;

                if(value["type"] =="TRAM"){
                    marker = new L.marker([value["y"],value["x"]], {"code" : value["code"], "icon" : tramIcon, "title" : value["line"]});

                }
                else {
                    marker = new L.marker([value["y"],value["x"]], {"code" : value["code"], "icon" : busIcon, "title" : value["line"]});

                }
                markers[value["code"]] = marker;

                if(!lines.hasOwnProperty(value["line"]))
                {

                    lines[value["line"]] = new L.LayerGroup().addLayer(marker);
                }
                else {
                    lines[value["line"]].addLayer(marker);
                }
            });

        },
        complete: function(jqXHR) {

            setTimeout(refreshMarkers, 15000);

        },
        error: function(jqXHR, errorText, errorThrown) {

        }
    });

}


$( document ).ready(function() {

    addMarkers();


    // $(".flex-list .line").on("click", function () {
    //     var line = $(this).text();
    //     console.log($(this).parent());
    //     $(this).parent().find('.line').removeClass('chosen');
    //     $(this).addClass("chosen");
    //
    //     console.log($(this).text() + " clicked");
    // });

    $(".flex-list").on("click", ".line", function(event){


        var line = $(this).text();

        $(this).toggleClass("chosen");

        if(lines != undefined){
            if(lines.hasOwnProperty(line)){
                if (map.hasLayer(lines[line])) {
                    map.removeLayer(lines[line]);
                } else {
                    map.addLayer(lines[line]);
                }
            }
        }


    });


    app.sendAjax('GET', Routing.generate('getLines'), {"type": "bus"}, function (data) {
        addLine(data, "bus-list")
    });

    app.sendAjax('GET', Routing.generate('getLines'), {"type": "tram"}, function (data) {
        addLine(data, "tram-list")
    });

});