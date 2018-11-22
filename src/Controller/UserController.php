<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{

	public function __construct(UserService $UserService){
		$this->UserService = $UserService;
	}

    /**
     * @Route("/user", name="user")
     */
    public function index()
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    /**
     * @Route("/user/list/{online}", name="userlist")
     */
    public function list($online)
    {
    	$userList = $this->UserService->findBy(["online"=>$online], ["username"=>"ASC"]);
        $nbUser = sizeof($userList);

        return $this->render('user/list.html.twig', [
            'controller_name' => 'UserController',
            'userList' => $userList,
            'nbUser' => $nbUser
        ]);
    }
}
