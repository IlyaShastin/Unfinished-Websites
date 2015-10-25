<?php
    
    class Post {
        
        public $id;
        public $creator;
        public $creationDate;
        public $message;
        public $lastEdit;
        public $replyTo;
        
        public $topicParent;
        
        public function __construct( $i, $c, $d, $m, $t, $l, $r ) {
            $this->id = $i;
            $this->creator = new User( $c );
            $this->creationDate = $d;
            $this->message = $m;
            $this->topic = $t;
            $this->lastEdit = $l;
            
            if ($r != 0) {
                $this->replyTo = getPostFromDB( $r );
            } else {
                $this->replyTo = $r;
            }
        
        }
        
        public function getID() {
            return $this->id;
        }
        
        public function getCreator() {
            return $this->creator;
        }
        
        public function getCreationDate() {
            return $this->creationDate;
        }
        
        public function getFormattedCreationDate() {
            return timeAgo($this->creationDate);
        }
        
        public function getMessage() {
            return $this->message;
        }
        
        public function getLastEdit() {
            return $this->lastEdit;
        }
        
        public function wasEdited() {
            return $this->lastEdit != 0;
        }
        
        public function isRemoved() {
            return $this->lastEdit == -1;
        }
        
        public function getFormattedEditDate() {
            return timeAgo($this->lastEdit);
        }
        
        public function isReply() {
            return gettype($this->replyTo) == "object";
        }
        
        public function getReplyTo() {
            return $this->replyTo;
        }
        
        public function getTopic() {
            return $this->topic;
        }
        
    }
    
?>