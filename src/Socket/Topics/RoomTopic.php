<?php 
namespace App\Socket\Topics;

use App\Entity\Room;
use App\Entity\Seat;
use App\Service\RoomService;

use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;
use Gos\Bundle\WebSocketBundle\Topic\SecuredTopicInterface;
use Gos\Bundle\WebSocketBundle\Server\Exception\FirewallRejectionException;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;

use Doctrine\ORM\EntityManager;



class RoomTopic implements TopicInterface, SecuredTopicInterface
{
    protected $RoomService, $room, $player, $resources=[];
    public function __construct($client, EntityManager $em){
        $this->em = $em;
    }

    /**
     * @param ConnectionInterface $conn
     * @param Topic               $topic
     * @param null|string         $payload
     * @param string[]|null       $exclude
     * @param string[]|null       $eligible
     * @param string|null         $provider
     *
     * @return string|null        $error
     */
    public function secure(ConnectionInterface $connection = null, Topic $topic, WampRequest $request, $payload = null, $exclude = null, $eligible = null, $provider = null)
    {
        // check input data to verify if connection must be blocked
        if ( 1 !== 1 ) {
            throw new FirewallRejectionException();
        } else {
            // grant access
        }
    }

    /**
     * This will receive any Subscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        if(!isset($this->resources[$connection->resourceId])){
            $this->resources[$connection->resourceId] = $connection->resourceId;
        }
        //this will broadcast the message to ALL subscribers of this topic.
        //$topic->broadcast(['msg' => $connection->resourceId . " has joined acmesecure " . $topic->getId()]);

        $topicId = $topic->getId();

        $output = $this->handleInstruction("loadUserList", $topicId);
        $topic->broadcast(['msg' => $output]);      
    }

    /**
     * This will receive any UnSubscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        //this will broadcast the message to ALL subscribers of this topic.        
        $topic->broadcast(['msg' => $connection->resourceId . " has left " . $topic->getId()]);
    }

    /**
     * This will handle insctruction received by the channel
     * @param $instruction
     * @param $topicId
     * @return $result
     */
    public function handleInstruction($instruction, $topicId){
        switch($instruction){
            case "loadUserList":            
                $topics = explode("/", $topicId);
                $roomId = $topics[sizeof($topics)-1];

                $roomRepo = $this->em->getRepository(Room::class);        
                $this->room = $roomRepo->find($roomId);        

                $roomRepo->refresh($this->room);

                $seats = $this->room->getSeats();

                $userList = [];
                $userList["users"] = [];
                $userList["comm"] = ["date"=>date("H:i:s"), "type"=>"api_instruction", "instruction"=>$instruction];

                foreach ($seats as $seat) {
                    $seatRepo = $this->em->getRepository(Seat::class);
                    $seatRepo->refresh($seat);
                    $userS = $seat->getUserId();
                    if(!empty($userS)){
                        $user = ["id"=>$userS->getId(), "name"=>$userS->getUsername(), "position"=>$seat->getPosition()];
                        $userList["users"][] = $user;
                    }                    
                }

                return json_encode($userList);
                break;
        }
    }


    /**
     * This will receive any Publish requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @param $event
     * @param array $exclude
     * @param array $eligible
     * @return mixed|void
     */
    public function onPublish(ConnectionInterface $connection, Topic $topic, WampRequest $request, $event, array $exclude, array $eligible)
    {
        /*
            $topic->getId() will contain the FULL requested uri, so you can proceed based on that

            if ($topic->getId() === 'acme/channel/shout')
               //shout something to all subs.
        */

        //$phpEvent = json_decode($event);
        /*switch($event["type"]){
            case "api_instruction":
                $output = $this->handleInstruction($event["msg"], $topic->getId());
                break;
        }

        $topic->broadcast([
            'msg' => $output,
        ]);*/

        $topic->broadcast([
            'msg' => $event,
        ]);
    }

    /**
    * Like RPC is will use to prefix the channel
    * @return string
    */
    public function getName()
    {
        return 'room.topic';
    }
}