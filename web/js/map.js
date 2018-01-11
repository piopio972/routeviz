/**
 * Created by Piotr on 26.10.2017.
 */


    var map = L.map('mapid', {
    renderer: L.canvas()
    }).setView([51.106952, 17.035020], 13);


    var app = new App();

    function addLine(data, line) {

        var html = '';
        $.each(data, function (index, element) {
            html += '<div class="line">' + element.line + '</div>';
        });
        $('#' + line).append(html);

    }

    $(document).ready(function () {

        var path = window.location.pathname;
        var target = $('[href="'+path+'"].nav-link').parent();
        target.addClass('active');

        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);

        $('#sidebarCollapse').on('click', function () {
            $("#sidebar").animate({
                width: "toggle"
            }, 350, function () {
                map.invalidateSize();
            });

        });


    });
