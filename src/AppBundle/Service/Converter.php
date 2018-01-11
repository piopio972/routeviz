<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 17.11.2017
 * Time: 09:33
 */

namespace AppBundle\Service;


class Converter
{

    public function convertPoints($points){

        $result = [];

        foreach ($points as $key => $value){

            $result[] = [(float)$value["latitude"], (float)$value["longitude"]];
        }

        return $result;
    }

}