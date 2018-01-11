<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 15.11.2017
 * Time: 17:42
 */

namespace AppBundle\Service;

use Phpml\Clustering\DBSCAN;
use Phpml\Math\Distance\Euclidean;

class DBSCANService
{

    public function calculate($samples){

        ini_set('memory_limit', '1024M');

//        dump($samples1);
//        dump($samples);


//        $dbscan1 = new DBSCAN($epsilon = 2, $minSamples = 3);
//        $clusters1 = $dbscan1->cluster($samples1);
//
//        dump($clusters1);
//        die();


        $dbscan = new DBSCAN($epsilon = 0.01, $minSamples = 20, new Haversine());

        $clusters = $dbscan->cluster($samples);

        foreach ($clusters as $cluster) {

            $centroids[] = $this->getCentroid($cluster);
        }
        return $centroids;

    }

    public function cluster($samples)
    {
        $clusters = [];
        $visited = [];

        foreach ($samples as $index => $sample) {
            if (isset($visited[$index])) {
                continue;
            }
            $visited[$index] = true;

            $regionSamples = $this->getSamplesInRegion($sample, $samples);
            if (count($regionSamples) >= $this->minSamples) {
                $clusters[] = $this->expandCluster($regionSamples, $visited);
            }
        }

        return $clusters;
    }

    private function getSamplesInRegion($localSample, $samples)
    {
        $region = [];

        foreach ($samples as $index => $sample) {
//            if ($this->getDistance($localSample, $sample) < $this->epsilon) {
                if ($this->getDistance($localSample, $sample) < 0.03) {
                $region[$index] = $sample;
            }
        }

        return $region;
    }

    private function expandCluster(array $samples, array &$visited) : array
    {
        $cluster = [];

        $clusterMerge = [[]];
        foreach ($samples as $index => $sample) {


            if (!isset($visited[$index])) {
                $visited[$index] = true;
                $regionSamples = $this->getSamplesInRegion($sample, $samples);
                if (count($regionSamples) > $this->minSamples) {
                    $clusterMerge[] = $regionSamples;
                }
            }



            $cluster[$index] = $sample;
        }
        $cluster = \array_merge($cluster, ...$clusterMerge);

        return $cluster;
    }

    function getDistance($sample1, $sample2) {

        $earth_radius = 6371;

        $dLat = deg2rad((float)$sample2["latitude"] - (float)$sample1["latitude"]);
        $dLon = deg2rad((float)$sample2["longitude"] - (float)$sample1["longitude"]);


        $a = sin($dLat/2) * sin($dLat/2) + cos(deg2rad((float)$sample1["latitude"])) * cos(deg2rad((float)$sample2["latitude"])) * sin($dLon/2) * sin($dLon/2);
        $c = 2 * asin(sqrt($a));
        $d = $earth_radius * $c;

        var_dump($d);


        return $d;

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