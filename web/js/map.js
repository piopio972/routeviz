/**
 * Created by Piotr on 26.10.2017.
 */


$( document ).ready(function() {

    var map = L.map('mapid').setView([51.106952, 17.035020], 13);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);


    $.ajax({
        type     : "GET",
        url      : Routing.generate('getPositions'),
        dataType: 'json',

        success: function(ret) {
            //ten fragment wykona się po pomyślnym zakończeniu połączenia - gdy dostaliśmy odpowiedź od serwera nie będącą błędem (404, 400, 500 itp)
            //atrybut ret zawiera dane zwrócone z serwera
            console.log(ret);
        },
        complete: function() {
            //ten fragment wykona się po zakończeniu łączenia - nie ważne czy wystąpił błąd, czy sukces
        },
        error: function(jqXHR, errorText, errorThrown) {
            //ten fragment wykona się w przypadku BŁĘDU
            //do zmiennej errorText zostanie przekazany błąd
        }
    });
});