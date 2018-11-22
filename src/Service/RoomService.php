<?php

namespace App\Service;

use App\Entity\Room;
use App\Helper\LoggerTrait;
use App\Repository\RoomRepositoryInterface;
use Psr\Log\LoggerInterface;

final class RoomService
{
    use LoggerTrait;

    private $repo;
    private $logger;

    public function __construct(RoomRepositoryInterface $repo, LoggerInterface $logger)
    {
        $this->repo = $repo;
        $this->logger = $logger;
    }

    public function save(Room $room)
    {
        return $this->repo->save($room);
    }

    public function createSeats(Room $room)
    {
        return $this->repo->createSeats($room);
    }

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL){
        return $this->repo->findBy($criteria, $orderBy, $limit, $offset);
    }

    public function findAll(){
        return $this->repo->findAll();
    }
}
