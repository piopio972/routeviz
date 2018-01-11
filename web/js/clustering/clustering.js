/**
 * Created by Piotr on 26.10.2017.
 */

var myRenderer = L.canvas({ padding: 0.5 });

var myWorker = new Worker('/js/historical/DBSCANworker.js')
var pointsWorker = new Worker('/js/clustering/PointsWorker.js')
var linesWorker = new Worker('/js/clustering/LineWorker.js')

var pointsToFormLine;

var groupLayer = new L.LayerGroup();
var polyline = new L.Polyline(new L.LatLng(0,0), {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
});

function haversine_distance(point1, point2) {
    // default 4 sig figs reflects typical 0.3% accuracy of spherical model

    if (typeof precision === 'undefined') {
        var precision = 4;
    }

    var R = 6371;
    var lat1 = point1.location.latitude * Math.PI / 180,
        lon1 = point1.location.longitude * Math.PI / 180;
    var lat2 = point2.location.latitude * Math.PI / 180,
        lon2 = point2.location.longitude * Math.PI / 180;

    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d.toPrecision(precision);
}

function getLineFromPoints(points, startingPoint) {
    var linePoints = points;
    var currentPoint = startingPoint;
    var line = [];


    while(linePoints.length > 0){
        var nextPoint;
        var distanceToNextPoint = Number.POSITIVE_INFINITY;

        for(var i = 0; i < linePoints.length; i++){

            var distance = haversine_distance(linePoints[i], currentPoint);
            if(distance < distanceToNextPoint){
                nextPoint = linePoints[i];
                distanceToNextPoint = distance;
            }
        }

        var i = points.indexOf(nextPoint);
        if(i != -1) {
            linePoints.splice(i, 1);
        }

        currentPoint = nextPoint;
        var pPoint = [currentPoint.location.latitude, currentPoint.location.longitude];
        line.push(pPoint);
    }

    return line;
}

function getEndPoint(points) {
    var pointsForFindingLineEnd = points;
    var currentPoint = points[Math.floor(Math.random()*points.length)];

    var i = points.indexOf(currentPoint);
    if(i != -1) {
        pointsForFindingLineEnd.splice(i, 1);
    }

    while(pointsForFindingLineEnd.length > 0){
        var nextPoint;
        var distanceToNextPoint = Number.POSITIVE_INFINITY;

        for(var i = 0; i < pointsForFindingLineEnd.length; i++){

            var distance = haversine_distance(pointsForFindingLineEnd[i], currentPoint);
            if(distance < distanceToNextPoint){
                nextPoint = pointsForFindingLineEnd[i];
                distanceToNextPoint = distance;
            }
        }

        var i = points.indexOf(nextPoint);
        if(i != -1) {
            pointsForFindingLineEnd.splice(i, 1);
        }

        currentPoint = nextPoint;
    }

    return currentPoint;
}



$( document ).ready(function() {


    // $.ajax({
    //     method: "POST",
    //     url: 'http://test.roadmatching.com/rest/mapmatch/?app_id=e5ce8b2f&app_key=0fa00e2b498069aa3fdc2cd1d4909b8d',
    //     data: "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
    //     "<gpx xmlns=\"http://www.topografix.com/GPX/1/1\">\n" +
    //     "<trk>\n" +
    //     "<name>Example Track</name>\n" +
    //     "<trkseg>\n" +
    //     "<trkpt lat=\"54.9328621088893\" lon=\"9.860624216140083\">\n" +
    //     "<time>2009-10-17T18:37:26Z</time>\n" +
    //     "</trkpt>\n" +
    //     "<trkpt lat=\"54.93293237320851\" lon=\"9.86092208681491\">\n" +
    //     "<time>2009-10-17T18:37:26Z</time>\n" +
    //     "</trkpt>\n" +
    //     "<trkpt lat=\"54.93327743521187\" lon=\"9.86187816543752\">\n" +
    //     "<time>2009-10-17T18:37:26Z</time>\n" +
    //     "</trkpt>\n" +
    //     "<trkpt lat=\"54.93342326167919\" lon=\"9.862439849679859\">\n" +
    //     "<time>2009-10-17T18:37:26Z</time>\n" +
    //     "</trkpt>\n" +
    //     "</trkseg>\n" +
    //     "</trk>\n" +
    //     "</gpx>",
    //
    //     crossDomain: true,
    //
    //     beforeSend: function(xhr) {
    //         xhr.setRequestHeader("Content-Type", "application/gpx+xml");
    //         xhr.setRequestHeader("Accept", "application/json");
    //
    //     }, success: function(data){
    //         alert(data);
    //         //process the JSON data etc
    //     }
    // });

    // polyline.setOptions({
    //     color: 'red',
    //     weight: 3,
    //     opacity: 0.5,
    //     smoothFactor: 1
    // });

    var dbscanEpsilon = $('#dbscan_epsilon').slider({
        formatter: function(value) {
            return 'Current value: ' + value + ' meters';
        }
    });

    var dbscanPoints = $('#dbscan_points').slider({
        formatter: function(value) {
            return 'Current value: ' + value + ' points';
        }
    });


    $('#submit_dbscan').on("click", function () {

        $(".overlay").show();

        var date_from = $("#datetime_from").data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss");
        var date_to = $("#datetime_to").data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss");

        var line = $('.flex-list').find('.chosen').text();

        var epsilon = dbscanEpsilon.slider('getValue') / 1000;
        var points = dbscanPoints.slider('getValue');

        console.log(date_from);
        console.log(date_to);
        console.log(line);
        console.log(epsilon);
        console.log(points);

        $.ajax({

            type        : "POST",
            url         : Routing.generate('getHistorical'),
            dataType    : 'json',
            data        : {"line": line, "from": date_from, "to": date_to},

            success: function(ret) {

                // console.log(ret);
                myWorker.postMessage([ret, epsilon, points]);

            },
            complete: function(jqXHR) {


            },
            error: function(jqXHR, errorText, errorThrown) {

            }

        });

    });

    $('#datetime_from').datetimepicker({

        // showClose: true,
        keepOpen: true,
        debug: true,
        useCurrent: false,
        maxDate: moment(),
        defaultDate: moment().add(-3,'days'),

    });


    $('#datetime_to').datetimepicker({

        minDate: $("#datetime_from").data("DateTimePicker").date(),
        maxDate: moment(),
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'auto'
        }
    });

    $("#datetime_from").on("dp.change", function (e) {
        $('#datetime_to').data("DateTimePicker").minDate(e.date);
    });

    $(".flex-list").on("click", ".line",  function () {
        var line = $(this).text();
        // console.log($(this).parent());
        $(this).parent().find('.line').removeClass('chosen');
        $(this).addClass("chosen");

        // console.log($(this).text() + " clicked");
    });


    myWorker.onmessage = function (e) {

        $(".overlay").hide();

        if(map.hasLayer(groupLayer)){
            map.removeLayer(groupLayer);
        }

        pointsToFormLine = e.data[0];
        groupLayer.clearLayers();



        $.each(e.data[0], function (key, value) {

            // L.marker([value.location.latitude,value.location.longitude], {"title" : [value.location.latitude,value.location.longitude].toString()});
            // groupLayer.addLayer(L.marker([value.location.latitude,value.location.longitude], {"title" : [value.location.latitude,value.location.longitude].toString()}));

            groupLayer.addLayer(L.circleMarker([value.location.latitude,value.location.longitude], {radius : '1', renderer: myRenderer}));


        });

        groupLayer.addTo(map);

        pointsWorker.postMessage(e.data[0]);

        // var point = getEndPoint(e.data[0]);
        // var line = getLineFromPoints(e.data[0], point);
        // console.log(line);
        // console.log(point);

    };


    pointsWorker.onmessage = function (e) {

        console.log(e.data);
        linesWorker.postMessage([e.data[0], pointsToFormLine]);
    };

    linesWorker.onmessage = function (e) {

        console.log(e.data);

        var pointList = [];

        if(map.hasLayer(polyline)){
            map.removeLayer(polyline);
        }

        for(var i = 0; i < e.data.length; i++){
            pointList.push(new L.LatLng(e.data[i][0], e.data[i][1]));
        }

        L.Routing.control({
            waypoints: pointList
        }).addTo(map);

        // polyline.setLatLngs(pointList);


        // polyline.addTo(map);

    };

    app.sendAjax('GET', Routing.generate('getLines'), {"type": "all"}, function (data) {
        addLine(data, "line-list")
    });

});


