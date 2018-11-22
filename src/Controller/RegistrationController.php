<?php

namespace App\Controller;

use App\Form\UserType;
use App\Entity\User;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class RegistrationController extends AbstractController
{
    /**
     * @Route("/register", name="user_registration")
     */
    public function register(Request $request, UserPasswordEncoderInterface $passwordEncoder, UserService $UserService)
    {
        $error = "";
        
        $user = new User();
        $form = $this->createForm(UserType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            if(!$UserService->exists($user)){
                $UserService->createNew($user);
                $this->addFlash(
                    'notice',
                    'Registration complete!'
                );
                
                return $this->redirectToRoute('app_login');


            }else{
                $error = "User exists";
            }                    
        }

        return $this->render(
            'registration/index.html.twig',
            array(
                'form' => $form->createView(),
                'page_title' => 'Registration',
                'error' => $error
            )
        );
    }
}