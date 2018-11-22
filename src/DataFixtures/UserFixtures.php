<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Profile;
use App\Entity\Preference;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
	private $encoder;

	public function __construct(UserPasswordEncoderInterface $encoder)
	{
	    $this->encoder = $encoder;
	}

    public function load(ObjectManager $manager)
    {
        for($i=0; $i<150; $i++){
        	$u = new User();
        	$password = $this->encoder->encodePassword($u, "test");
        	$u->setPassword($password)
        		->setEmail("user-".$i."@gg.ff")
        		->setUsername("John-Mickael Doe-".$i)
        		->setDateC(new \DateTime(date("Y-m-d H:i:s")))
        		->setDateU(new \DateTime(date("Y-m-d H:i:s")))        		
        		->setOnline(0);

        	$rand = rand(1,10);
        	if($rand === 7){
        		$u->setRoles(["ROLE_USER_PREMIUM"]);
        	}else{
        		$u->setRoles(["ROLE_USER"]);
        	}

        	$profile = new Profile();
        	$profile->setLevel(1);
        	$profile->setScore(0);

        	$preference = new Preference();
        	$preference->setLang("en_EN");

        	$u->setProfile($profile);
        	$u->setPreference($preference);

        	$manager->persist($u);
        }

        $manager->flush();
    }
}
