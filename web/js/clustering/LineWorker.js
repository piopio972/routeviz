

self.addEventListener('message', function(e) {


    var line = getLineFromPoints(e.data[1],e.data[0]);


    self.postMessage(line);
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
