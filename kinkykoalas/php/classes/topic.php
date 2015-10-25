
<?php 
    
    class Topic {
        
        public $id;
        public $title;
        public $creator;
        public $creationDate;
        public $stickied;
        public $closed;
        
        public $posts;
        public $subForumParent;
        
        public function __construct( $i, $t, $c, $d, $s, $cl ) {
            $this->id = $i;
            $this->title = $t;
            $this->creator = new User ( $c );
            $this->creationDate = $d;
            $this->stickied = $s;
            $this->closed = $cl;
        }
        
        public function getID() {
            return $this->id;
        }
        
        public function getTitle() {
            return $this->title;
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
        
        public function isStickied() {
            return $this->stickied == 1;
        }
        
        public function isClosed() {
            return $this->closed == 1;
        }
        
        public function setSubForumParent( $subForum ) {
            $this->subForumParent = $subForum;
        }
        
        public function getSubForumParent() {
            return $this->subForumParent;
        }
        
        public function setPosts( $posts ) {
            $this->posts = $posts;
        }
        
        public function getPosts() {
            return $this->posts;
        }
    }
    
?>