<?php
//AppBundle\Listener\LogoutListener.php
 
namespace App\Listener;

use App\Service\UserService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Logout\LogoutHandlerInterface;
 
class LogoutListener implements LogoutHandlerInterface
{

	private $UserService;

	public function __construct(UserService $UserService){
		$this->userRep = $UserService;
	}
 
    /**
     * @{inheritDoc}
     */
    public function logout(Request $request, Response $response, TokenInterface $token)
    {
        $user = $token->getUser();
        $user->setOnline(0);
        $this->userRep->save($user);
    }
}