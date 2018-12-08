<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Profile;
use App\Entity\Preference;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements UserRepositoryInterface
{
    public function __construct(RegistryInterface $registry, UserPasswordEncoderInterface $UserPasswordEncoderInterface)
    {
        parent::__construct($registry, User::class);
        $this->UserPasswordEncoderInterface = $UserPasswordEncoderInterface;
        
    }

    public function exists(User $user){
        $e = $this->findOneBy(['email' => $user->getEmail()]);

        return (!empty($e)) ? true : false;
    }

    public function createNew(User $user){
    	$password = $this->UserPasswordEncoderInterface->encodePassword($user, $user->getPlainPassword());
    	$profile = new Profile();
    	$preference = new Preference();

    	$profile->setLevel(1);
    	$profile->setScore(0);

    	$preference->setLang("en_EN");

    	$user->setPassword($password)
    		 ->setRoles(["ROLE_USER"])
    		 ->setOnline(0)
    		 ->setDateC(new \DateTime(date("Y-m-d H:i:s")))
    		 ->setDateU(new \DateTime(date("Y-m-d H:i:s")))
    		 ->setProfile($profile)
    		 ->setPreference($preference);

    	return $this->save($user);
    }

    public function save(User $user): void
    {
        $this->_em->persist($user);
        $this->_em->flush();
    }

    public function removeElement($element){
        $this->_em->remove($element);
    }
}
