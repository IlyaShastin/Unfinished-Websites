
<?php
    class User {
        
        public $name;
        public $steamID;
        public $steamID64;
        public $profileLink;
        public $lastOnline;
        public $avatar;
        public $avatarMedium;
        public $avatarFull;
        public $personaState;
        public $friends;
        
        public $isFriend;
        public $friendSince;
        public $relationship;
        
        public function __construct( $st, $f = false ) {
            global $API;
            
            $this->isFriend = $f;
            $this->steamID64 = $st;
            
            // We'll see how fast this is when calling the api every page load for each person
            // My guess... not too fast...
            $context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
            $json = file_get_contents("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={$API}&steamids={$st}", false, $context);
            $json_decode = json_decode($json, true);
            
            if (isset($json_decode["response"]["players"][0])) {
                $this->profileLink      = $json_decode["response"]["players"][0]["profileurl"];
                $this->lastOnline       = $json_decode["response"]["players"][0]["lastlogoff"];
                $this->name             = $json_decode["response"]["players"][0]["personaname"];
                $this->avatar           = $json_decode["response"]["players"][0]["avatar"];
                $this->avatarMedium     = $json_decode["response"]["players"][0]["avatarmedium"];
                $this->avatarFull       = $json_decode["response"]["players"][0]["avatarfull"];
                $this->personaState     = $json_decode["response"]["players"][0]["personastate"];
            }
            
            // Don't want a recursive loop of never ending friends of friends...
            // if(!$f){
            //     // Friend's list query not working for some reason
            //     $friendContext = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
            //     $jsonFriends = file_get_contents("http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key={$API}&steamids={$st}&relationship=friend", false, $friendContext);
            //     $json_decode_friends = json_decode($jsonFriends, true);
                
            //     if ( isset($json_decode_friends) ) {
            //         foreach( $json_decode_friends as $key => $value ) {
            //             $friend = new User( $value['steamid'], true );
            //             $friend->friendSince = $value['friend_since'];
            //             $friend->relationship = $value['relationship'];
                        
            //             $this->friends[] = $friend;
            //         }
            //     }
            // }
        }
        
        public function isLocalUser() {
            return ($_SESSION['gSteamID64'] == $this->steamID64);
        }
        
        public function isFriend() {
            return $this->isFriend;
        }
        
        public function getName() {
            return $this->name;
        }
        
        public function getSteamID64() {
            return $this->steamID64;
        }
        
        public function getAvatar() {
            return $this->avatar;
        }
        
        public function getAvatarMedium() {
            return $this->avatarMedium;
        }
        
        public function getAvatarFull() {
            return $this->avatarFull;
        }
        
        public function getSteamID() {
            return $this->steamID;
        }
        
        public function getPersonaState() {
            return $this->personastate;
        }
        
        public function getProfileLink() {
            return $this->profileLink;
        }
        
        public function getFriends() {
            return $this->friends;
        }
        
        public function __toString() {
            return "User [" . $this->steamID64 . "] " . $this->name;
        }
    }
?>