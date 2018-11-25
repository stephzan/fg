<?php
namespace App\Security;

use App\Entity\User; // your user entity
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Security\Authenticator\SocialAuthenticator;
use KnpU\OAuth2ClientBundle\Client\Provider\DiscordClient;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class DiscordAuthenticator extends SocialAuthenticator
{
    private $clientRegistry;
    private $em;

    public function __construct(ClientRegistry $clientRegistry, EntityManagerInterface $em, UserService $UserService)
    {
        $this->clientRegistry = $clientRegistry;
        $this->em = $em;
        $this->userService = $UserService;
    }

    public function supports(Request $request)
    {
        // continue ONLY if the current ROUTE matches the check ROUTE
        return $request->attributes->get('_route') === 'connect_discord_check';
    }

    public function getCredentials(Request $request)
    {
        // this method is only called if supports() returns true

        // For Symfony lower than 3.4 the supports method need to be called manually here:
        // if (!$this->supports($request)) {
        //     return null;
        // }

        return $this->fetchAccessToken($this->getDiscordClient());
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        /** @var DiscordUser $discordUser */
        $discordUser = $this->getDiscordClient()
            ->fetchUserFromToken($credentials);

        $email = $discordUser->getEmail();
        $username = $discordUser->getName();

        // 1) have they logged in with Discord before? Easy!
        $existingUser = $this->userService->findOneBy(['discordId' => $discordUser->getId()]);
        if ($existingUser) {
            //die(var_dump($existingUser));
            return $existingUser;
        }

        // 2) do we have a matching user by email?
        $existingUser = $this->userService->findOneBy(['email' => $email]);

        if($existingUser){
            $user = $existingUser;
            $user->setDiscordId($discordUser->getId());
            $this->userService->save($user);
        }else{
            $user = new User();
            $user->setEmail($email);
            $user->setUsername($username);
            $user->setDiscordId($discordUser->getId());
            $this->userService->createNew($user);
        }
        

        return $user;
    }

    /**
     * @return DiscordClient
     */
    private function getDiscordClient()
    {
        return $this->clientRegistry
            // "discord_main" is the key used in config/packages/knpu_oauth2_client.yaml
            ->getClient('discord_main');
	}

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // on success, let the request continue
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
		$message = strtr($exception->getMessageKey(), $exception->getMessageData());

        return new Response($message, Response::HTTP_FORBIDDEN);
    }

    /**
     * Called when authentication is needed, but it's not sent.
     * This redirects to the 'login'.
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new RedirectResponse(
            '/connect/', // might be the site, where users choose their oauth provider
            Response::HTTP_TEMPORARY_REDIRECT
        );
    }

    // ...
}