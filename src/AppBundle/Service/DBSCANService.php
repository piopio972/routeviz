<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 15.11.2017
 * Time: 17:42
 */

namespace AppBundle\Service;

use Phpml\Clustering\DBSCAN;

class DBSCANService
{
/*
    public function haversine_distance($point1, $point2) {
        // default 4 sig figs reflects typical 0.3% accuracy of spherical model

    $R = 6371;
    $lat1 = $point1[0] * pi() / 180;
    $lon1 = $point1[1] * pi() / 180;
    $lat2 = $point2[0] * pi() / 180;
    $lon2 = $point2[1] * pi() / 180;

    $dLat = $lat2 - $lat1;
    $dLon = $lon2 - $lon1;

    $a = sin($dLat / 2) * sin($dLat / 2) +
            cos($lat1) * cos($lat2) *
            sin($dLon / 2) * sin($dLon / 2);

    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    $d = $R * $c;

    return $d;
}

    public function getLineFromPoints($points, $startingPoint) {
        $linePoints = $points;
        $currentPoint = $startingPoint;
        $line = array();


        while(count($linePoints) > 0){
            $nextPoint = null;
            $distanceToNextPoint = INF;

            for($i = 0; $i < count($linePoints); $i++){

                $distance = $this->haversine_distance($linePoints[$i], $currentPoint);
                if($distance < $distanceToNextPoint){
                    $nextPoint = $linePoints[$i];
                    $distanceToNextPoint = $distance;
                }
            }

            $i = array_search($nextPoint, $points);


            if($i != -1) {
                array_slice($linePoints, $i, 1);
            }


        $currentPoint = $nextPoint;
        $pPoint = [$currentPoint[0], $currentPoint[1]];
        array_push($line, $pPoint);
    }

        return $line;
    }

    function getEndPoint($points) {
        $pointsForFindingLineEnd = $points;
        $currentPoint = array_rand($points, 1);

        $i = array_search($currentPoint, $points);
        if($i != -1) {
            array_slice($pointsForFindingLineEnd, $i, 1);
        }

        while(count($pointsForFindingLineEnd) > 0){
            $nextPoint = null;
            $distanceToNextPoint = INF;

            for($i = 0; $i < count($pointsForFindingLineEnd); $i++){

                $distance = $this->haversine_distance($pointsForFindingLineEnd[$i], $currentPoint);
                if($distance < $distanceToNextPoint){
                    $nextPoint = $pointsForFindingLineEnd[$i];
                    $distanceToNextPoint = $distance;
                }
            }

            $i = array_search($nextPoint, $points);

            if($i != -1) {
                array_slice($pointsForFindingLineEnd, $i, 1);
            }


        $currentPoint = $nextPoint;
    }

        return $currentPoint;
    }*/
    public function calculate($samples, $eps, $min){

        ini_set('memory_limit', '1024M');


        $dbscan = new DBSCAN($eps, $min, new Haversine());

        $clusters = $dbscan->cluster($samples);

        $centroids = array();

        foreach ($clusters as $cluster) {

            $centroids[] = $this->getCentroid($cluster);
        }

        return $centroids;

    }


    function getCentroid($coord)
    {
        $centroid = array_reduce( $coord, function ($x,$y) use ($coord) {
            $len = count($coord);
            return [$x[0] + $y[0]/$len, $x[1] + $y[1]/$len];
        }, array(0,0));
        return $centroid;
    }


}