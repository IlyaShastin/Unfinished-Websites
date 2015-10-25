
<?php
    class SubForum extends Forum {
        
        public $parent;
        public $topics = [];
        
        public function setParentForum( $id ) {
            $this->parent = $id;
        }
        
        public function getParentForum() {
            return $this->parent;
        }
        
        public function getTopics() {
            return $this->topics;
        }
        
        public function setTopics( $topics ) {
            $this->topics = $topics;
        }
        
    }
?>