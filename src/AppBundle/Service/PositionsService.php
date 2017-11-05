<?php


/**
 * Created by PhpStorm.
 * User: Piotr
 * Date: 04.11.2017
 * Time: 23:34
 */

namespace AppBundle\Service;

class PositionsService
{
    public function getCurrentPositions()
    {
        $url = "https://62.233.178.84:8088/mobile?function=getPositions";
        $username = "android-mpk";
        $password = "g5crehAfUCh4Wust";

        $options = array(
//            CURLOPT_VERBOSE             => true,
            CURLOPT_URL                 => $url,
            CURLOPT_RETURNTRANSFER      => true,     //return as a string, not directly
            CURLOPT_FOLLOWLOCATION      => true,
//            CURLOPT_POST                => false,
            CURLOPT_SSL_VERIFYPEER      => false,    // for https, false to stop cURL from veryfying peer certificate
            CURLOPT_SSL_VERIFYHOST      => false,
            CURLOPT_SSL_VERIFYSTATUS    => false,    // to verify certificate status
            CURLOPT_USERPWD             => $username . ":" . $password,
            CURLOPT_HTTPAUTH            => CURLAUTH_DIGEST,
            CURLOPT_TIMEOUT_MS          => 2000
        );

        $ch = curl_init();
        curl_setopt_array( $ch, $options );

        $raw_response = curl_exec($ch);

        curl_close($ch);

        $data = json_decode($raw_response);
        unset($data[0]);

        return $data;
    }
}