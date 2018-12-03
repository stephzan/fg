<?php

namespace App\Controller;

use App\Entity\Room;
use App\Service\RoomService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class RoomController extends AbstractController
{
    /**
     * @Route("/room/{id}", name="room")
     */
    public function index($id, RoomService $RoomService)
    {
    	if(!$room = $RoomService->find($id)){

    	}else{
            $room->setNbSeats(sizeof($room->getSeats()));
            
    		return $this->render('room/index.html.twig', [
    		    'controller_name' => 'RoomController',
    		    'room' => $room
    		]);
    	}
        
    }

    /**
     * @Route("/room/list/{online}", name="roomlist")
     */
    public function list($online, RoomService $RoomService)
    {
    	$list = ($online === '1') ? $RoomService->findBy(["status"=>1]) : $RoomService->findAll();	
    	$nbRoom = sizeof($list);

        foreach ($list as $k => $room) {
            $list[$k]->getGame()->setTextRules(json_encode($room->getGame()->getRule()->getRules()));
        }

        return $this->render('room/list.html.twig', [
            'controller_name' => 'RoomController',
            'roomList' => $list,
            'nbRoom' => $nbRoom
        ]);
    }
}
