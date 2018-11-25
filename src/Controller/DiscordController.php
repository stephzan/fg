<?php

namespace App\Controller;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DiscordController extends Controller
{
    /**
     * Link to this controller to start the "connect" process
     *
     * @Route("/connect/discord", name="connect_discord_start")
     */
    public function connectAction(ClientRegistry $clientRegistry)
    {
        // will redirect to Facebook!
        return $clientRegistry
            ->getClient('discord') // key used in config/packages/knpu_oauth2_client.yaml
            ->redirect([
	    	'identify', 'email' // the scopes you want to access
            ])
        ;
	}

    /**
     * After going to Facebook, you're redirected back here
     * because this is the "redirect_route" you configured
     * in config/packages/knpu_oauth2_client.yaml
     *
     * @Route("/connect/discord/check", name="connect_discord_check")
     */
    public function connectCheckAction(Request $request, ClientRegistry $clientRegistry)
    {
        //Can do something here befor to signing user
        
        return $this->redirectToRoute('home');   
    }
}