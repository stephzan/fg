<?php 
namespace App\Socket\Topics;

use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;
use Gos\Bundle\WebSocketBundle\Topic\SecuredTopicInterface;
use Gos\Bundle\WebSocketBundle\Server\Exception\FirewallRejectionException;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;

class AcmeSecuredTopic implements TopicInterface, SecuredTopicInterface
{
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
        //this will broadcast the message to ALL subscribers of this topic.
        $topic->broadcast(['msg' => $connection->resourceId . " has joined acmesecure " . $topic->getId()]);
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
        return 'acme.securetopic';
    }
}