<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    public function getCurrentPositionAction(Request $request){

        $url = "https://62.233.178.84:8088/mobile?function=getPositions";
        $username = "android-mpk";
        $password = "g5crehAfUCh4Wust";

        $options = array(
            CURLOPT_URL            => $url,
//            CURLOPT_HEADER         => true, // to include the header in raw_response
//            CURLOPT_VERBOSE        => true,
            CURLOPT_RETURNTRANSFER      => true,     //return as a string, not directly
            CURLOPT_FOLLOWLOCATION      => true,
            CURLOPT_SSL_VERIFYPEER      => false,    // for https, false to stop cURL from veryfying peer certificate
            CURLOPT_SSL_VERIFYHOST      => false,
            CURLOPT_SSL_VERIFYSTATUS    => false,    // to verify certificate status
            CURLOPT_USERPWD             => $username . ":" . $password,
            CURLOPT_HTTPAUTH            => CURLAUTH_DIGEST,
            CURLOPT_TIMEOUT             => 400

        );

        $ch = curl_init();
        curl_setopt_array( $ch, $options );

        /*try {


            if(curl_errno($ch))
                throw new Exception(curl_error($ch), 500);

            // validate HTTP status code (user/password credential issues)
            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($status_code != 200)
                throw new Exception("Response with Status Code [" . $status_code . "].", 500);
        }
        catch (Exception $ex){

//            if ($ch != null) curl_close($ch);
//            throw new Exception($ex);
        }*/

        $raw_response = curl_exec($ch);

        $data = json_decode($raw_response);
        unset($data[0]);

        return new JsonResponse($data);
    }
}
