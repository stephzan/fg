<?php

namespace App\Controller;

use App\Service\GameService;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    /**
     * @Route("/game", name="game")
     */
    public function index()
    {
        return $this->render('game/index.html.twig', [
            'controller_name' => 'GameController',
        ]);
    }

    /**
     * @Route("/game/show/{id}", name="game_show")
     */
    public function show($id, GameService $GameService)
    {

    	$game = $GameService->find($id);

        return $this->render('game/show.html.twig', [
            'controller_name' => 'GameController',
            'game' => $game
        ]);
    }
}
