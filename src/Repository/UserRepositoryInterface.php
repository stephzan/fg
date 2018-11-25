<?php

namespace App\Repository;

use App\Entity\User;

interface UserRepositoryInterface
{

    public function exists(User $user);

    public function createNew(User $user);

    public function save(User $user);

    public function findAll();

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL);

    public function findOneBy(array $criteria, array $orderBy = null);

}
