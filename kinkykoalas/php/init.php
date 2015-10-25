<?php
    include "openid.php";
    include "mysql.php";
    include "functions.php";
    
    include "classes/user.php";
    include "classes/forum.php";
    include "classes/subforum.php";
    include "classes/post.php";
    include "classes/topic.php";
    
    global $loggedIn;
    global $localUser;
    global $logInButton;
    global $API;
    
    $API = "11E0EBF493157B550E17F323DE133855";
    $loggedIn = false;
    $OpenID = new LightOpenID("mycho.de");
    
    session_start();
    ini_set('default_socket_timeout', 120);
    
    spl_autoload_register(function($class){
           require preg_replace('{\\\\|_(?!.*\\\\)}', DIRECTORY_SEPARATOR, ltrim($class, '\\')).'.php';
    });
    
    if(!$OpenID->mode) {
        
        if(isset($_GET['login'])) {
            $OpenID->identity = "http://steamcommunity.com/openid";
            header("Location: {$OpenID->authUrl()}");
        }

        if(!isset($_SESSION['gSteamAuth'])) {
            $logInButton = "<a id = \"login\" href = \"?login\"><img src = '../img/sits_large_noborder.png' /></a>";
        }

    } elseif($OpenID->mode == "cancel"){
        
        echo "Authentication failed: Canceled";
        
    } else {
         if(!isset($_SESSION['gSteamAuth'])){
             
            $_SESSION['gSteamAuth'] = $OpenID->validate() ? $OpenID->identity : null;
            $_SESSION['gSteamID64'] = end(explode('/', $_SESSION['gSteamAuth']));

            if($_SESSION['gSteamAuth'] !== null){
                $selected_db = mysql_select_db("Kinky Koalas Main", $mysql_conn) or die("Could not select users database!");
                $query = mysql_query("INSERT INTO Users( STEAMID ) VALUES( '{$_SESSION['gSteamID64']}' )");
            }

            header("Location: ../index.php");
        }
    }

    if(isset($_SESSION['gSteamAuth'])){
        global $loggedIn;
        global $localUser;
        
        $loggedIn = true;
        $localUser = new User( $_SESSION['gSteamID64'] );
    }

    if(isset($_GET['logout'])){
        unset($_SESSION['gSteamAuth']);
        unset($_SESSION['gSteamID64']);
        header("Location: index.php");
    }
?>