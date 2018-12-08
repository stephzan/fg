<?php 
namespace App\Service;

use Psr\Container\ContainerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class SecurityService
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getUser()
    {
        $user = $this->container->get('security.token_storage')->getToken()->getUser();

        return $user;
    }}