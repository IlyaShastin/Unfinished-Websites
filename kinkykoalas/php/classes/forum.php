
<?php
    class Forum {
        
        public $name;
        public $id;
        public $permission;
        public $description;
        
        public $subForums;
        
        public function __construct( $i, $n, $p, $d ) {
            $this->id = $i;
            $this->name = $n;
            $this->permission = $p;
            $this->description = $d;
        }
        
        public function getID() {
            return $this->id;
        }
        
        public function getName() {
            return $this->name;
        }
        
        public function getPermission() {
            return $this->permission;
        }
        
        public function getDescription() {
            return $this->description;
        }
        
        public function rankCanAccess( $rankPerm = 0) {
            return $rankPerm >= $this->permission;
        }
        
        public function getSubForums() {
            return $this->subForums;
        }
        
        public function setSubForums( $subs ) {
            $this->subForums = $subs;
        }
    }
?>