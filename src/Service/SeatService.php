<?php

namespace App\Service;

use App\Entity\Seat;
use App\Helper\LoggerTrait;
use App\Repository\SeatRepositoryInterface;
use Psr\Log\LoggerInterface;

final class SeatService
{
    use LoggerTrait;

    private $repo;
    private $logger;

    public function __construct(SeatRepositoryInterface $repo, LoggerInterface $logger)
    {
        $this->repo = $repo;
        $this->logger = $logger;
    }

    public function save(Seat $seat)
    {
        return $this->repo->save($seat);
    }

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL){
        return $this->repo->findBy($criteria, $orderBy, $limit, $offset);
    }

    public function findAll(){
        return $this->repo->findAll();
    }
}
