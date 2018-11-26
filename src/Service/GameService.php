<?php

namespace App\Service;

use App\Entity\Game;
use App\Helper\LoggerTrait;
use App\Repository\GameRepositoryInterface;
use Psr\Log\LoggerInterface;

final class GameService
{
    use LoggerTrait;

    private $repo;
    private $logger;

    public function __construct(GameRepositoryInterface $repo, LoggerInterface $logger)
    {
        $this->repo = $repo;
        $this->logger = $logger;
    }

    public function save(Game $game)
    {
        return $this->repo->save($game);
    }

    public function createSeats(Game $game)
    {
        return $this->repo->createSeats($game);
    }

    public function find($id){
    	return $this->repo->find($id);
    }

    public function findBy(array $criteria, array $orderBy = NULL, $limit = NULL, $offset = NULL){
        return $this->repo->findBy($criteria, $orderBy, $limit, $offset);
    }

    public function findAll(){
        return $this->repo->findAll();
    }
}
