<?php
    error_reporting(E_ALL ^ E_DEPRECATED);

    $mysql_username = "root";
    $mysql_password = "letmein69";
    $mysql_hostname = "mycho.de";
    
    global $mysql_conn;
    $mysql_conn = mysql_connect($mysql_hostname, $mysql_username, $mysql_password) or die("Unable to connect to MySQL Server.");
?>