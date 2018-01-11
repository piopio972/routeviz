<?php
/**
 * Created by PhpStorm.
 * User: Emilia
 * Date: 04.11.2017
 * Time: 14:22
 */


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
            CURLOPT_SSL_VERIFYSTATUS    => false,// to verify certificate status
            CURLOPT_USERPWD             => $username . ":" . $password,
            CURLOPT_HTTPAUTH            => CURLAUTH_DIGEST
        );

        $ch = curl_init();
        curl_setopt_array( $ch, $options );

        try {
            $raw_response = curl_exec($ch);

//            echo $raw_response;
//            die();

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

//        echo $data;

        $timestamp = $data[0];

        unset($data[0]);

        $pdo = new PDO('mysql:host=localhost;dbname=routeviz', 'root', 'pass', array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        ));


           $latitude = "/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,8}$/";
           $longitude = "/^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,8}$/";


//We start our transaction.
        $pdo->beginTransaction();

        foreach ($data as $value){

            if(preg_match($longitude, $value->x) &&  preg_match($latitude, $value->y)){

                $line_numer = "SELECT line_id FROM routeviz.Lines WHERE line= :thisline";
                $first_stmt = $pdo->prepare($line_numer);
                $first_stmt->execute(array(':thisline' => $value->line));
                $result = $first_stmt->fetchAll();


                $sql = "INSERT INTO Positions(line_id, code, course, longitude, latitude, timestamp) VALUES ( ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute(array(
                        $result['0']['line_id'],
                        $value->code,
                        $value->course,
                        $value->x,
                        $value->y,
                        $timestamp
                    )
                );
            }
        }

        //We've got this far without an exception, so commit the changes.
        $pdo->commit();