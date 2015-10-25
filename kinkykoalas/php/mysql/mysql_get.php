
<?php
    global $forums;

    $selected_db = mysql_select_db("Kinky Koalas Main", $mysql_conn) or die("Could not select forums database!");
    
    //
    //  Get all the forums from the database
    //
    function getForumsFromDB() {
        $return = mysql_query("SELECT * FROM Forums") or die(mysql_error());
        $array = [];
        $row;
        
        while ($row = mysql_fetch_assoc( $return )) {
            $array[] = new Forum( $row['ID'], $row['NAME'], $row['PERMISSION'], $row['DESCRIPTION'] );
            end($array)->setSubForums( getSubForumsFromDB( $row['ID'] ) );
        }
        
        return $array;
    }
    
    //
    //  Get all the sub forums from a forum from the database
    //
    function getSubForumsFromDB( $forum ) {
        $return = mysql_query("SELECT * FROM SubForums WHERE FORUM = '{$forum}'") or die(mysql_error());
        $array = [];
        $row;
        
        while ($row = mysql_fetch_assoc( $return )) {
            $array[] = new SubForum( $row['ID'], $row['NAME'], $row['PERMISSION'], $row['DESCRIPTION'] );
            end($array)->setParentForum( $forum );
        }
        
        return $array;
    }
    
    
    //
    //  Get the topics for a subforum from the DB
    // 
    function getTopicsFromDB( $subForum, $start, $amount ) {
        $start = max( $start-1, 0 );
        
        $return = mysql_query("SELECT * FROM Topic WHERE SUBFORUM = '{$subForum}' ORDER BY STICKIED DESC, DATE DESC LIMIT {$start}, {$amount}") or die(mysql_error());
        $array = [];
        $row;
        
        while ($row = mysql_fetch_assoc( $return )) {
            $array[] = new Topic( $row['ID'], $row['TITLE'], $row['CREATOR'], $row['DATE'], $row['STICKIED'], $row['CLOSED'] );
            end($array)->setSubForumParent( $subForum );
        }
        
        return $array;
    }
    
    //
    //  Get a single topic from the database
    //
    function getTopicFromDB( $topic ) {
        $return = mysql_query("SELECT * FROM Topic WHERE ID = '{$topic}'") or die(mysql_error());
        $row = mysql_fetch_assoc( $return );
        
        $t = new Topic( $row['ID'], $row['TITLE'], $row['CREATOR'], $row['DATE'], $row['STICKIED'], $row['CLOSED'] );
        $t->setSubForumParent( $row['SUBFORUM'] );
        
        return $t;
    }
    
    //
    //  Get all the posts from a specific topic
    //
    function getPostsFromTopic( $topic, $start, $amount ) {
        $start = max( $start-1, 0 );
        
        $return = mysql_query("SELECT * FROM Post WHERE TOPIC = '{$topic}' ORDER BY DATE ASC LIMIT {$start}, {$amount}") or die(mysql_error());
        $array = [];
        $row;
        
        while ($row = mysql_fetch_assoc( $return )) {
            $array[] = new Post( $row['ID'], $row['CREATOR'], $row['DATE'], $row['MESSAGE'], $row['TOPIC'], $row['LASTEDIT'], $row['REPLYTO'] );
        }
        
        return $array;
    }
    
    //
    //  Get a single sub forum by its id
    //
    function getSubForumFromDB( $id ) {
        $return = mysql_query("SELECT * FROM SubForums WHERE ID = '{$id}'") or die(mysql_error());
        $row = mysql_fetch_assoc( $return );
        $subForum = new SubForum( $row['ID'], $row['NAME'], $row['PERMISSION'], $row['DESCRIPTION'] );
        $subForum->setParentForum( $row['FORUM'] );
        
        return $subForum;
    }
    
    //
    //  Get a single post from the db by its id
    //
    function getPostFromDB( $id ) {
        $return = mysql_query("SELECT * FROM Post WHERE ID = '{$id}'") or die(mysql_error());
        $row = mysql_fetch_assoc( $return );
        
        $post = new Post( $row['ID'], $row['CREATOR'], $row['DATE'], $row['MESSAGE'], $row['TOPIC'], $row['LASTEDIT'], $row['REPLYTO'] );
        
        return $post;
    }
    
    //
    //  Get total topic count from a sub forum
    //
    function getPostCountFromDB( $topic ) {
        $return = mysql_query("SELECT ID FROM Post WHERE TOPIC = '{$topic}'") or die(mysql_error());
        $count = 0;

        while ($row = mysql_fetch_assoc( $return ))
        {
            $count++;
        }

        return $count;
    }
    
    //
    //  Get topic count for a subforum from the DB
    //
    function getTopicCountFromDB( $subforum ) {
        $return = mysql_query("SELECT ID FROM Topic WHERE SUBFORUM = '{$subforum}'") or dir(mysql_error());
        $count = 0;
        
        while ($row = mysql_fetch_assoc( $return )) {
            $count++;
        }
        
        return $count;
    }
    
    //
    //  Get total post count from a subforum
    //
    function getPostCountForumFromDB( $subforum ) {
        $return = mysql_query("SELECT ID FROM Topic WHERE SUBFORUM = '{$subforum}'") or dir(mysql_error());
        $count = 0;
        $topics = [];
        
        while ($row = mysql_fetch_assoc( $return )) {
            $topics[] = $row['ID'];
        }
        
        foreach( $topics as $topic ) {
            $q = mysql_query("SELECT ID FROM Post WHERE TOPIC = '{$topic}'") or die(mysql_error());
            while ($r = mysql_fetch_assoc( $q )) {
                $count++;
            }
        }
        
        return $count;
    }
    
    //
    //  Get last activity from a subforum
    //
    function getLastActivityFromDB( $subforum ) {
        $return = mysql_query("SELECT ID FROM Topic WHERE SUBFORUM = '{$subforum}'") or dir(mysql_error());
        $topics = [];
        $posts = [];
        $lastActivity;
        
        while ($row = mysql_fetch_assoc( $return )) {
            $topics[] = $row['ID'];
        }
        
        foreach( $topics as $topic ) {
            $q = mysql_query("SELECT * FROM Post WHERE TOPIC = '{$topic}' ORDER BY DATE DESC LIMIT 1") or die(mysql_error());
            while ($r = mysql_fetch_assoc( $q )) {
                $posts[] = new Post($r['ID'], $r['CREATOR'], $r['DATE'], $r['MESSAGE'], $r['TOPIC'], $r['LASTEDIT'], $r['REPLYTO']);
            }
        }
        
        usort($posts, function( $a, $b ) {
            return strcmp($a->getCreationDate(), $b->getCreationDate());
        });
        
        return $posts[0];
    }
?>