<?php

namespace App\Repository;

use App\Entity\Room;
use App\Entity\Seat;
use App\Service\SeatService;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Room|null find($id, $lockMode = null, $lockVersion = null)
 * @method Room|null findOneBy(array $criteria, array $orderBy = null)
 * @method Room[]    findAll()
 * @method Room[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RoomRepository extends ServiceEntityRepository implements RoomRepositoryInterface
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Room::class);
    }

    public function createSeats(Room $room): void{
        for($i=1; $i<=$room->getNbSeats();$i++){
            $s = new Seat();
            $s->setRoomId($room);
            $s->setPosition($i);

            if($i === 1){
                $s->setUserId($room->getUserId());
            }

            $room->addSeat($s);
        }
    }

    public function save(Room $room): void
    {
        $this->_em->persist($room);
        $this->_em->flush();
    }

    public function refresh(Room $room){
        return $this->_em->refresh($room);
    }
}
