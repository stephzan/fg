<?php

namespace App\Controller;

use App\Entity\Room;
use App\Service\RoomService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class RoomController extends AbstractController
{
    /**
     * @Route("/room", name="room")
     */
    public function index()
    {
        return $this->render('room/index.html.twig', [
            'controller_name' => 'RoomController',
        ]);
    }

    /**
     * @Route("/room/list/{online}", name="roomlist")
     */
    public function list($online, RoomService $RoomService)
    {
    	$list = ($online === '1') ? $RoomService->findBy(["status"=>1]) : $RoomService->findAll();    	
    	$nbRoom = sizeof($list);
        return $this->render('room/list.html.twig', [
            'controller_name' => 'RoomController',
            'roomList' => $list,
            'nbRoom' => $nbRoom
        ]);
    }
}
