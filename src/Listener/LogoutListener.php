<?php
//AppBundle\Listener\LogoutListener.php
 
namespace App\Listener;

use App\Entity\User;
use App\Service\UserService;
use App\Service\SeatService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Logout\LogoutHandlerInterface;
 
class LogoutListener implements LogoutHandlerInterface
{

	private $UserService;

	public function __construct(UserService $UserService, SeatService $SeatService){
		$this->userRep = $UserService;
        $this->seatRep = $SeatService;
	}
 
    /**
     * @{inheritDoc}
     */
    public function logout(Request $request, Response $response, TokenInterface $token)
    {
        $user = $token->getUser();
        $user->setOnline(0);

        //Free seat if exists
        if(!empty($user->getSeat())){
            $seat = $user->getSeat();
            $seat->setUserId();//Reset relation
            $this->seatRep->save($seat);

            $user->setSeat();//Reset relation
        }
        
        $this->userRep->save($user);

        return true;
    }
}