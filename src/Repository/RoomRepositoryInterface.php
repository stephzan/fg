<?php

namespace App\Repository;

use App\Entity\Room;

interface RoomRepositoryInterface
{

    public function save(Room $room);

    public function find($id);

    public function findAll();

    public function createSeats(Room $room);

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL);

}

