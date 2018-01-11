self.importScripts('/js/jDBSCAN.js');


// onmessage = function (e) {
//     console.log(e.data);
//     var circles = e.data.map( function (t) { return {'location' : {'latitude' : parseFloat(t["latitude"]), 'longitude' : parseFloat(t["longitude"]), 'accuracy' : 1}}; });
//     var dbscanner = jDBSCAN().eps(0.03).minPts(20).distance('HAVERSINE').data(circles);
//     var start = new Date().getTime();
//
//     dbscanner();
//
//     var end = new Date().getTime();
//     var cluster_centers = dbscanner.getClusters();
//
//     postMessage([cluster_centers, end - start]);
// }

self.addEventListener('message', function(e) {


    console.log(e.data);

    var circles = e.data[0].map( function (t) { return {'location' : {'latitude' : parseFloat(t["latitude"]), 'longitude' : parseFloat(t["longitude"]), 'accuracy' : 1}}; });
    var dbscanner = jDBSCAN().eps(e.data[1]).minPts(e.data[2]).distance('HAVERSINE').data(circles);
    var start = new Date().getTime();

    dbscanner();

    var end = new Date().getTime();
    var cluster_centers = dbscanner.getClusters();

    self.postMessage([cluster_centers, end - start]);
}, false);

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

    console.log(points);
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