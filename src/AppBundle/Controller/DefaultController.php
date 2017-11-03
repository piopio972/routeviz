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
            CURLOPT_HTTPAUTH            => CURLAUTH_DIGEST
        );

        $ch = curl_init();
        curl_setopt_array( $ch, $options );

        try {
            $raw_response = curl_exec($ch);

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
        }

        $data = json_decode($raw_response);
        $timestamp = $data[0];
        unset($data[0]);

        $pdo = new PDO('mysql:host=localhost;dbname=test', 'sua', '', array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ));



//We start our transaction.
        $pdo->beginTransaction();
        foreach ($data as $value){
//            dump($value);

            $sql = "INSERT INTO test(Code, Course, X, Y, Line, Type, Symbol, Direction, Delay, Timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array(
                    $value->code,
                    $value->course,
                    $value->x,
                    $value->y,
                    $value->line,
                    $value->type,
                    $value->symbol,
                    $value->direction,
                    $value->delay,
                    $timestamp
                )
            );

        }

        //We've got this far without an exception, so commit the changes.
        $pdo->commit();
//        dump($data);
//        dump($data[1]->course);
        die();

        return new JsonResponse(array('data' => $data));
    }
}
