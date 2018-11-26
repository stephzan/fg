<?php

namespace App\Repository;

use App\Entity\Rule;

interface RuleRepositoryInterface
{

    public function save(Rule $rule);

    public function findAll();

    public function find($id);

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL);

}
