<?php
    include "openid.php";
    include "mysql.php";
    include "sync.php";
    
    include "classes/user.php";
    
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
            $logInButton = "<a id = \"login\" href = \"?login\"><div><img src = '../../img/steam.png' ><p>Sign in through Steam</p></div></a>";
        }

    } elseif($OpenID->mode == "cancel"){
        
        echo "Authentication failed: Canceled";
        
    } else {
         if(!isset($_SESSION['gSteamAuth'])){
             
            $_SESSION['gSteamAuth'] = $OpenID->validate() ? $OpenID->identity : null;
            $_SESSION['gSteamID64'] = end(explode('/', $_SESSION['gSteamAuth']));

            if($_SESSION['gSteamAuth'] !== null){
                $curTime = time();
                $selected_db = mysql_select_db("csgo_sync_main", $mysql_conn) or die("Could not select users database!");
                $query = mysql_query("INSERT INTO Users( STEAMID, STAFF_STATUS, VIP_STATUS, DATE ) VALUES( '{$_SESSION['gSteamID64']}', '{Sync::$STAFF_STATUS_NONE}', '{Sync::$VIP_STATUS_NONE}', '{$curTime}' )");
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