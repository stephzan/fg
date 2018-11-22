<?php

namespace App\Repository;

use App\Entity\Seat;

interface SeatRepositoryInterface
{

    public function save(Seat $seat);

    public function findAll();

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL);

}
