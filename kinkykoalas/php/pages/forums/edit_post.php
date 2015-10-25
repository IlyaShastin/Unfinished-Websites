<?php 

    include "../../mysql.php";
    
    $message = $_POST["message"];
	$post = $_POST["postid"];
	$topic = $_POST["topic"];
	
	$returnURL = "http://" . $_SERVER['HTTP_HOST'] . "?page=forums&topic=" . $topic;
	$date = time();
	
	$selected = mysql_select_db("Kinky Koalas Main", $mysql_conn) or die("Could not select forums DB");
	$return = mysql_query("UPDATE Post SET MESSAGE = '{$message}', LASTEDIT = '{$date}' WHERE ID = '{$post}'") or die(mysql_error());
    
    header("Refresh: 0.5; URL = {$returnURL}");
?>