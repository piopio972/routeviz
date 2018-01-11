<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 15.11.2017
 * Time: 20:38
 */

$samples = [[1, 1], [8, 7], [1, 2], [7, 8], [2, 1], [8, 9]];



$dbscan = new DBSCAN($epsilon = 0.03, $minSamples = 10, new Haversine());

$clusters = $dbscan->cluster($samples);