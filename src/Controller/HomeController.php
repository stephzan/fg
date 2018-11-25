<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;

use App\Entity\Room;
use App\Service\RoomService;


use App\Form\RoomType;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class HomeController extends AbstractController
{
    /**
     * @param $request
     * @param $RoomService
     * @return render
     * @Route("/", name="home")
     */
    public function index(Request $request, RoomService $RoomService)
    {
    	$this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $user = $this->getUser();

        if(empty($user->getRoom())){
            $room = new Room();        

            $roomFormError = "";
            $roomForm = $this->createForm(RoomType::class, $room);

            $roomForm->handleRequest($request);

            if($roomForm->isSubmitted()&& $roomForm->isValid()){
                $room->setStatus(1)
                    ->setUserId($user);

                $RoomService->createSeats($room);
                $RoomService->save($room);
     
                $user->setRoom($room);

                return $this->redirect($request->getUri());

            }else{
                $roomFormError = $roomForm->getErrors(true, false);
            }

            return $this->render('home/index.html.twig', [
                'controller_name' => 'HomeController',
                'user' => $user,
                'room_form' => $roomForm->createView(),
                'room_form_error' => $roomFormError
            ]);
        }

                
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'user' => $user
        ]);
    }
}
