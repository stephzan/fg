<?php

namespace App\Service;

use App\Entity\User;
use App\Helper\LoggerTrait;
use App\Repository\UserRepositoryInterface;
use Psr\Log\LoggerInterface;

final class UserService
{
    use LoggerTrait;

    private $repo;
    private $logger;

    public function __construct(UserRepositoryInterface $repo, LoggerInterface $logger)
    {
        $this->repo = $repo;
        $this->logger = $logger;
    }

    public function exists(User $user): bool
    {
        return $this->repo->exists($user);
    }

    public function createNew(User $user)
    {
        return $this->repo->createNew($user);
    }

    public function find($id): User{
        return $this->repo->find($id);
    }

    public function findOneBy(array $criteria, array $orderBy = null){
        return $this->repo->findOneBy($criteria, $orderBy);
    }

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL){
        return $this->repo->findBy($criteria, $orderBy, $limit, $offset);
    }

    public function save(User $user)
    {
        return $this->repo->save($user);
    }

    public function findAll(){
        return $this->repo->findAll();
    }

    public function removeElement($element){
        return $this->repo->removeElement($element);
    }
}
