<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 15.11.2017
 * Time: 18:18
 */

namespace AppBundle\Service;


use Phpml\Math\Distance;

class Haversine implements Distance
{


    public function distance(array $a, array $b): float
    {
        $earth_radius = 6371;

        $dLat = deg2rad($b[0] - $a[0]);
        $dLon = deg2rad($b[1] - $a[1]);



        $a = sin($dLat/2) * sin($dLat/2) + cos(deg2rad($a[0])) * cos(deg2rad($a[0])) * sin($dLon/2) * sin($dLon/2);
        $c = 2 * asin(sqrt($a));
        $d = $earth_radius * $c;


        return $d;
    }
}