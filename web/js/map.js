/**
 * Created by Piotr on 26.10.2017.
 */
var lines =  new L.layerGroup();
var markers = [];
var map = L.map('mapid').setView([51.106952, 17.035020], 13);

function ajaxCall() {

    $.ajax({
        type     : "GET",
        url      : Routing.generate('getPositions'),
        dataType: 'json',
        timeout: 5000,
        success: function(ret) {

            console.log(markers);

            $.each(ret, function (key, value) {

                // console.log(markers[value["code"]]);
                if(markers.hasOwnProperty(value["code"])){
                    markers[value["code"]].setLatLng([value["y"],value["x"]]);
                }
                else{
                    var marker = L.marker([value["y"],value["x"]], {"code" : value["code"]});
                    markers[value["code"]] = marker;
                    if(lines.hasOwnProperty(value["line"])){
                        lines[value["line"]].addLayer(marker);
                    }
                    else{
                        lines[value["line"]] = new L.LayerGroup().addLayer(marker).addTo(map);
                    }

                }

                // markers[value["code"]].setLatLng([value["y"],value["x"]]).update();
            });

        },
        complete: function(jqXHR) {

            // console.log(markers);
            setTimeout(ajaxCall,15000);
            // console.log(lines);
        },
        error: function(jqXHR, errorText, errorThrown) {
            //ten fragment wykona się w przypadku BŁĘDU
            //do zmiennej errorText zostanie przekazany błąd
        }
    });
}


$( document ).ready(function() {


    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);


    $("#btn").on("click", function () {
        // var x = document.getElementById("myDIV");
        if (map.hasLayer(lines["0L"])) {
            map.removeLayer(lines["0L"]);
        } else {
            map.addLayer(lines["0L"]);
        }
    });

    $.ajax({
        type     : "GET",
        url      : Routing.generate('getPositions'),
        dataType: 'json',

        success: function(ret) {

            $.each(ret, function (key, value) {

                var marker = L.marker([value["y"],value["x"]], {"code" : value["code"]});
                markers[value["code"]] = marker;


                if(!lines.hasOwnProperty(value["line"]))
                {
                                        // console.log(marker.getLayerId());


                    // L.marker.setLatLng().update()
                    // somemarker.setLatLng([latitude,longitude]).update();
                    // markers[value["line"]] = new L.LayerGroup().addLayer(new L.marker([value["y"],value["x"]], {"code" : value["code"]}));
                    lines[value["line"]] = new L.LayerGroup().addLayer(marker).addTo(map);
                    // var line = value["line"];
                    // markers[line].push(L.LayerGroup().addLayer(L.marker([value["y"],value["x"]])));
                }
                else {

                    lines[value["line"]].addLayer(marker);


                }
                // lines._add()
                // var marker = L.marker([value["y"],value["x"]]);
                // markers.push(marker);
                // markers.push(marker);
            });

            // map.addLayer(markers["145"]);
            // console.log(markers);
        },
        complete: function(jqXHR) {

            // markers["2201"].setLatLng([0,0]).update();
            // console.log(markers);
            // console.log(lines);

            setTimeout(ajaxCall, 15000);

        },
        error: function(jqXHR, errorText, errorThrown) {
            //ten fragment wykona się w przypadku BŁĘDU
            //do zmiennej errorText zostanie przekazany błąd
        }
    });

});