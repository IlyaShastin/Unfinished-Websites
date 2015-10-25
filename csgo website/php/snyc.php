
<?php
	// Class for static functions used throughout the website.
	class Snyc {

		private function __construct() {}

		public static $STAFF_STATUS_NONE 		= 0;
		public static $STAFF_STATUS_MOD 		= 1;
		public static $STAFF_STATUS_ADMIN 		= 2;
		public static $STAFF_STATUS_OWNER 		= 3;

		public static $VIP_STATUS_NONE			= 0;
		// to:do add more vip types

		public static function timeAgo($time) {
	       $periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
	       $lengths = array("60","60","24","7","4.35","12","10");

	       $now = time();

	           $difference     = $now - $time;
	           $tense         = "ago";

	       for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
	           $difference /= $lengths[$j];
	       }

	       $difference = round($difference);

	       if($difference != 1) {
	           $periods[$j].= "s";
	       }

	       return "$difference $periods[$j] ago";
	    }

	}	
?>