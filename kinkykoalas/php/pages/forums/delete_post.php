<?php 

    include "../../mysql.php";
    
	$post = $_POST["postid"];
	$topic = $_POST["topic"];
	
	$returnURL = "http://" . $_SERVER['HTTP_HOST'] . "?page=forums&topic=" . $topic;
	
	$selected = mysql_select_db("Kinky Koalas Main", $mysql_conn) or die("Could not select forums DB");
	$return = mysql_query("UPDATE Post SET LASTEDIT = '-1' WHERE ID = '{$post}'") or die(mysql_error());
    
    header("Refresh: 0.5; URL = {$returnURL}");
?>