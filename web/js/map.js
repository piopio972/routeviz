/**
 * Created by Piotr on 26.10.2017.
 */


$( document ).ready(function() {

    var markers = [];
    var line145 = L.layerGroup();
    var map = L.map('mapid').setView([51.106952, 17.035020], 13);

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);


    /*$("#btn").on("click", function () {
        // var x = document.getElementById("myDIV");
        console.log("clicked");
        if (map.hasLayer(markers["146"])) {
            map.removeLayer(markers["146"]);
        } else {
            map.addLayer(markers["146"]);
        }
    });*/

    $.ajax({
        type     : "GET",
        url      : Routing.generate('getPositions'),
        dataType: 'json',

        success: function(ret) {

/*            $.each(ret, function (key, value) {
                // console.log(value["x"]);
                // console.log(value["line"]);
                if(!markers.hasOwnProperty(value["line"]))
                {
                    // console.log("true");
                    // markers[value["line"]] = new L.LayerGroup().addLayer(L.marker([value["y"],value["x"]]));
                    // var line = value["line"];
                    // markers[line].push(L.LayerGroup().addLayer(L.marker([value["y"],value["x"]])));
                }
                else {
                    // markers[value["line"]].addLayer(L.marker([value["y"],value["x"]]));
                }
                // lines._add()
                // var marker = L.marker([value["y"],value["x"]]);
                // markers.push(marker);
                // markers.push(marker);
            });

            // map.addLayer(markers["145"]);
            // console.log(markers["145"]);*/
        },
        complete: function(jqXHR) {
            console.log(jqXHR.responseJSON);
            // map.addLayer(line145);
            // mapp.removeLayer(line145);

            // setTimeout(function(){  console.log("remove layer"); map.removeLayer(line145); }, 3000);
            // setTimeout(function(){  console.log("add layer"); map.addLayer(line145); }, 3000);
            // line145.addTo(map)
            // line145.remove();
            // $.each(markers, function (key, value) {
            //     // console.log(value);
            //     value.addTo(map);
            // });
            // console.log(value);
            //ten fragment wykona się po zakończeniu łączenia - nie ważne czy wystąpił błąd, czy sukces
        },
        error: function(jqXHR, errorText, errorThrown) {
            //ten fragment wykona się w przypadku BŁĘDU
            //do zmiennej errorText zostanie przekazany błąd
        }
    });
});