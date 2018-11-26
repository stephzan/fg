<?php

namespace App\Controller;

use App\Entity\Seat;
use App\Service\SeatService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class SeatController extends AbstractController
{
    /**
     * @Route("/seat", name="seat")
     */
    public function index()
    {
        return $this->render('seat/index.html.twig', [
            'controller_name' => 'SeatController',
        ]);
    }

    /**
    * @Route("/seat/assign", name="seat_assign")
    */
    public function assign(Request $Request, SeatService $SeatService){
    	if ($Request->isXMLHttpRequest()) {
    		$return = ["data"=>"", "error"=>""];

    		$params = json_decode($Request->request->get('params'));
    		$data = $params->data[0];

    		if(!$seat = $SeatService->find($data->idSeat)){
    			$return["error"] = "no-seat";
    		}else{
    			if(!empty($seat->getUserId())){
    				$return["error"] = "no-assigned";
    			}else{
    				$seat->setUserId($this->getUser());

    				$SeatService->save($seat);
    				$return["data"] = $seat->getRoomId()->getId();
    			}
    		}

    		return new JsonResponse($return);
    	}else{
    		return new Response('Not AJAX', 400);
    	}
    	
    }
}
