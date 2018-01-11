<?php

namespace AppBundle\Controller;

use AppBundle\Service\Converter;
use AppBundle\Service\DBSCANService;
use AppBundle\Service\PositionsService;
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
        return $this->render('Realtime/realtime.html.twig', [
//            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    public function historicalAction(Request $request)
    {
        return $this->render('Historical/historical.html.twig');
    }

    public function clusteringAction(Request $request)
    {
        return $this->render('Clustering/clustering.html.twig');
    }

    public function getCurrentPositionAction(Request $request, PositionsService $positionsService){

        $data = $positionsService->getCurrentPositions();

        return new JsonResponse($data);
    }

    public function getHistoricalDataAction(Request $request)
    {
        $line = $request->request->get("line");
        $from = $request->request->get("from");
        $to = $request->request->get("to");

//        var_dump($line);
//        var_dump($from);
//        var_dump($to);
//        die();

        $em = $this->getDoctrine()->getManager();


//        $line = 2;
//        $date = mktime(20,00,00,11,5,2017);
//        $date = "2017-11-16 00:00:00";
        $date = $from;
        $points = $em->getRepository("AppBundle:Positions")->findPointsForLineOlderThanADate($line,$from,$to);

//        die();
//        $data = json_encode($points);


        return new JsonResponse($points);
    }

    public function getClustersAction(Request $request, DBSCANService $dbscan, Converter $con){

        set_time_limit(0);

        $em = $this->getDoctrine()->getManager();

        $line = $request->request->get("line");
        $from = $request->request->get("from");
        $to = $request->request->get("to");

        $line = 2;
        $from = "2017-11-17 00:00:00";
        $to = "2017-11-18 00:00:00";


        $points = $em->getRepository("AppBundle:Positions")->findPointsForLineOlderThanADate($line,$from,$to);
        $pointscon = $con->convertPoints($points);

        dump(json_encode($pointscon));
        die();
        $pointscon = $con->convertPoints($points);

        $output = $dbscan->calculate($pointscon);

//        dump($output);
//        die();

        return new JsonResponse($output);
    }

    public function getLinesAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository("AppBundle:Lines");

        $type = $request->query->get("type");

        if($type == "bus")
        {
            $lines = $repo->getBuses();
        }
        else if($type == "tram"){
            $lines = $repo->getTrams();
        }
        else {
            $lines = $repo->getAll();
        }

        return new JsonResponse($lines);
    }
}
