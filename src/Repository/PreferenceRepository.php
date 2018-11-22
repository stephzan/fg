<?php

namespace App\Repository;

use App\Entity\Preference;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Preference|null find($id, $lockMode = null, $lockVersion = null)
 * @method Preference|null findOneBy(array $criteria, array $orderBy = null)
 * @method Preference[]    findAll()
 * @method Preference[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PreferenceRepository extends ServiceEntityRepository implements PreferenceRepositoryInterface
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Preference::class);
    }

    
}
