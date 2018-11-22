<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CommunityController extends AbstractController
{
    /**
     * @Route("/community", name="community")
     */
    public function index()
    {
        return $this->render('community/index.html.twig', [
            'controller_name' => 'CommunityController',
        ]);
    }
}
