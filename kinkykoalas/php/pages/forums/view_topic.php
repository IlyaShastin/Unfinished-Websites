
<?php
    $topic = getTopicFromDB( $_GET["topic"] );
    $currentPage = 1;
    $pageAmount = 10;
    
    if(isset($_GET['pagenum'])) {
        $currentPage = $_GET['pagenum'];
    }
    
    $topic->setPosts( getPostsFromTopic( $topic->getID(), ($currentPage*$pageAmount) - ($pageAmount-1), $pageAmount) );
    $returnURL = $_SERVER['HTTP_HOST'] . "?page=forums&topic=" . $_GET["topic"];
    
    $selected = mysql_select_db("Kinky Koalas Main", $mysql_conn) or die("Could not select forums DB");
	$returnToSubforum = "?page=forums&subforum=" . $topic->getSubForumParent();
	$returnToTopic = "?page=forums&topic=" . $topic->getID();
    
    // check if player is admin
    $topicID = $topic->getID();
	if (true) {
		if(isset($_GET["pin"])) {
			$query = mysql_query("UPDATE Topic SET STICKIED = 1 WHERE ID = '{$topicID}'") or die(mysql_error());
			$topic->stickied = 1;
		}

		if(isset($_GET["unpin"])) {
			$query = mysql_query("UPDATE Topic SET STICKIED = 0 WHERE ID = '{$topicID}'") or die(mysql_error());
			$topic->stickied = 0;
		}

		if(isset($_GET["lock"])) {
			$query = mysql_query("UPDATE Topic SET CLOSED = 1 WHERE ID = '{$topicID}'") or die(mysql_error());
			$topic->closed = 1;
		}

		if(isset($_GET["unlock"])) {
			$query = mysql_query("UPDATE Topic SET CLOSED = 0 WHERE ID = '{$topicID}'") or die(mysql_error());
			$topic->closed = 0;
		}

		if(isset($_GET["delete"])) {
			$query = mysql_query("DELETE FROM Topic WHERE ID = '{$topicID}'") or die(mysql_error());

			$query2 = mysql_query("DELETE FROM Post WHERE TOPIC = '{$topicID}'") or die(mysql_error());

			header("Refresh: 0.01; URL = http://{$_SERVER['HTTP_HOST']}{$returnToSubforum}");
		}
	}
	
	$ratings = [
	    "agree",
	    "artistic",
	    "baby",
	    "disagree",
	    "dumb",
	    "late",
	    "love",
	    "winner"
	];
?>

<link href="../../css/topic.css" rel="stylesheet" type="text/css"/>
<script src = "../../js/post_reply.js" ></script>

<div id = "container" >
    
    <div id = "header" >
        <?php if( $topic->isStickied() ): ?>
            <img src = "../../img/pin.png" />
        <?php endif; ?>
        <?php if( $topic->isClosed() ): ?>
            <img src = "../../img/lock.png" />
        <?php endif; ?>
        <h1 id = "title"><?php echo $topic->getTitle(); ?></h1>
        
        <div id = "options" >
            
            <?php if( $topic->isClosed() ) : ?>
                <a href = <?php echo $returnToTopic . "&unlock"; ?> ><img src = "../../img/unlock.png" /></a>
            <?php else : ?>
                <a href = <?php echo $returnToTopic . "&lock"; ?> ><img src = "../../img/lock.png" /></a>
            <?php endif; ?>
            
            <?php if( $topic->isStickied() ) : ?>
                <a href = <?php echo $returnToTopic . "&unpin"; ?> ><img src = "../../img/unpin.png" /></a>
            <?php else : ?>
                <a href = <?php echo $returnToTopic . "&pin"; ?> ><img src = "../../img/pin.png" /></a>
            <?php endif; ?>
            
            <a href = <?php echo $returnToTopic . "&delete"; ?> ><img src = "../../img/delete.png" /></a>
        </div>
    </div>
    
    <?php foreach( $topic->getPosts() as $k => $post ) : ?>
        
        <div id = "post" class = "post" >
            <p id = "postid" style = "display:none;" ><?php echo $post->getID(); ?></p>
            
            <div id = "avatar" >
                <a href = "#" >
                    <img id = "postAvatar" src = <?php echo $post->getCreator()->getAvatarFull(); ?> />
                    <p id = "postName" ><?php echo $post->getCreator()->getName(); ?></p>
                </a>
            </div>
            
            <div id = "postdata" >
                <span> </span>
                <div id = "postcont" >
                    <?php if( $post->isReply() ): ?>
                        <div id = "replypost" >
                            <div id = "left" >
                                <img id = "postAvatar" src = <?php echo $post->getReplyTo()->getCreator()->getAvatarFull(); ?> />
                                <br>
                                <p><?php echo $post->getReplyTo()->getCreator()->getName(); ?></p>
                            </div>
                            <div id = "right" >
                                <span> </span>
                                <div id = "msg" >
                                    <?php if($post->getReplyTo()->isRemoved()): ?>
                                        <b><font face = "Roboto" size = "2" color = "#D64541" >[REMOVED]</font></b>
                                    <?php else: ?>
                                        <pre><?php echo $post->getReplyTo()->getMessage(); ?></pre>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                    <div id = "message" >
                        <?php if($post->isRemoved()): ?>
                            <b><font face = "Roboto" size = "2" color = "#D64541" >[REMOVED]</font></b>
                        <?php else: ?>
                            <pre><?php echo $post->getMessage(); ?></pre>
                        <?php endif; ?>
                    </div>
                    <?php if($post->wasEdited() && !$post->isRemoved()) : ?>
                        <div id = "lastedit">
                            Last edited <?php echo $post->getFormattedEditDate(); ?>
                        </div>
                        <br>
                    <?php endif; ?>
                    
                    <div id = "ratings" >
                        <!--<?php foreach( $ratings as $rating ): ?>-->
                            <!--<a href = "#" ><img src = <?php echo "../../img/ratings/" . $rating . ".png"; ?> /></a>-->
                        <!--<?php endforeach; ?>-->
                    </div>
                    
                    <div id = "options" >
                        <?php if( $post->getCreator()->getSteamID64() == $localUser->getSteamID64() && !$post->isRemoved() ): ?>
                            <a href = "#" id = "edit" ><img src = "../../img/edit.png" /></a>
                        <?php endif; ?>
                        <?php if($loggedIn && !$topic->isClosed()) : ?>
                            <a href = "#" id = "quote" ><img src = "../../img/quote.png" /></a>
                        <?php endif; ?>
                        <?php if( !$post->isRemoved() ): ?>
                            <a href = "#" id = "delete" ><img src = "../../img/delete.png" /></a>
                        <?php endif; ?>
                    </div>
                </div>
                <p><?php echo $post->getFormattedCreationDate(); ?></p>
            </div>
        </div>
        
    <?php endforeach; ?>
    
    <?php if($loggedIn && !$topic->isClosed()) : ?>
        <div id = "replytopic" >
            <form action = "php/pages/forums/post_reply.php" method = "post" >
                <h2>Reply to this topic</h2>
        	    <a id = "markdown" target = "_blank" href = "https://guides.github.com/features/mastering-markdown/" >Uses Markdown formatting*</a>
        	    <textarea name = "message" placeholder = "Message" ></textarea>
        	    
        		<input type = "hidden" name = "topic" value = <?php echo $topic->getID(); ?> />
        		<input type = "hidden" name = "creator" value = <?php echo $localUser->getSteamID64(); ?> />
        	    
        	    <input type = "submit" id = "submit" value = "POST">
            </form>
        </div>
    <?php endif; ?>
    
</div>

<div id = "replyModal" >
    <div id = "post" class = "reply" >
        <div id = "avatar" >
            <a href = "#" >
                <img id = "replyAvatar" src = "" />
                <p id = "replyName" class = "reply" >name</p>
            </a>
        </div>
        
        <div id = "postdata" >
            <span> </span>
            <div id = "postcont" >
                <div id = "message" >
                    
                </div>
            </div>
        </div>
    </div>
    <div id = "replytopic" class = "reply" >
        <form action = "php/pages/forums/post_reply.php" method = "post" >
            <h2>Reply to this post</h2>
    	    <a id = "markdown" target = "_blank" href = "https://guides.github.com/features/mastering-markdown/" >Uses Markdown formatting*</a>
    	    <textarea name = "message" placeholder = "Message" ></textarea>
    	    
    		<input type = "hidden" name = "topic" value = <?php echo $topic->getID(); ?> />
    		<input type = "hidden" name = "creator" value = <?php echo $localUser->getSteamID64(); ?> />
    		<input id = "replyid" type = "hidden" name = "replyto" value = "0" />
    	    
    	    <a href = "#" class = "cancel" >CANCEL</a>
    	    <input type = "submit" id = "submit" value = "POST">
        </form>
    </div>
</div>

<div id = "editModal" >
    <div id = "edit" >
        <form action = "php/pages/forums/edit_post.php" method = "post" >
            <h2>Edit this post</h2>
    	    <a id = "markdown" target = "_blank" href = "https://guides.github.com/features/mastering-markdown/" >Uses Markdown formatting*</a>
            <textarea id = "message" name = "message" value = " " ></textarea>
            <input id = "postid" type = "hidden" name = "postid" value = "0" />
            <input id = "topic" type = "hidden" name = "topic" value = <?php echo $topic->getID(); ?> />
            
            <a href = "#" class = "cancel" >CANCEL</a>
            <input type = "submit" id = "submit" value = "EDIT">
        </form>
    </div>
</div>

<div id = "deleteModal" >
    <div id = "delete" >
        <h2>Delete Post</h2>
        <p>Are you sure you want to delete this post?</p>
        
        <form action = "php/pages/forums/delete_post.php" method = "post" >
            <input id = "postid" type = "hidden" name = "postid" value = "0" />
            <input id = "topic" type = "hidden" name = "topic" value = <?php echo $topic->getID(); ?> />
            
            
            <a href = "#" class = "cancel" >CANCEL</a>
            <input type = "submit" id = "submit" value = "DELETE">
        </form>
    </div>
</div>