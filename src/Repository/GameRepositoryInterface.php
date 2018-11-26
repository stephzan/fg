<?php

namespace App\Repository;

use App\Entity\Game;

interface GameRepositoryInterface
{

    public function save(Game $game);

    public function findAll();

    public function find($id);

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL);

}
