

self.addEventListener('message', function(e) {

    console.log(e.data);

    var point = getEndPoint(e.data);


    self.postMessage([point]);
}, false);

function haversine_distance(point1, point2) {
    // default 4 sig figs reflects typical 0.3% accuracy of spherical model

    if (typeof precision === 'undefined') {
        var precision = 4;
    }

    var R = 6371;
    var lat1 = point1[0] * Math.PI / 180,
        lon1 = point1[1] * Math.PI / 180;
    var lat2 = point2[0] * Math.PI / 180,
        lon2 = point2[1] * Math.PI / 180;

    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d.toPrecision(precision);
}


function getEndPoint(points) {
    console.log(points);
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