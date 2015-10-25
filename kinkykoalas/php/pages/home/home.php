
<link href="../../css/home.css" rel="stylesheet" type="text/css"/>
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>

<script>
	$(document).on('keydown', function(event) {
	    if (event.keyCode == 9) {   //tab pressed
	        event.preventDefault(); // stops its action
	    }
	});

	var currentServer = "website";
	var servers = {
		"website": "0",
		"test server": "24.45.243.255",
	}

	var emotes = {
		"Kappa": "http://vignette4.wikia.nocookie.net/epicrapbattlesofhistory/images/8/81/Kappa.png/revision/latest?cb=20150616204236",
		"dealwithit": "http://i1.kym-cdn.com/entries/icons/original/000/002/686/Deal_with_it_dog_gif.gif",
		"pastaThat": "https://static-cdn.jtvnw.net/emoticons/v1/62842/1.0",
		"KappaHD": "https://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-2867-src-f02f9d40f66f0840-28x28.png",
		"4Head": "https://static-cdn.jtvnw.net/emoticons/v1/354/1.0",
		"BibleThump": "https://static-cdn.jtvnw.net/emoticons/v1/86/1.0",
		"KappaPride": "https://static-cdn.jtvnw.net/emoticons/v1/55338/1.0",
		":)": "https://cdn.vaughnsoft.com/img/emoticons/smile.gif",
		":P": "https://cdn.vaughnsoft.com/img/emoticons/tongue.gif",
		":D": "https://cdn.vaughnsoft.com/img/emoticons/bigsmile.png",
		":O": "https://cdn.vaughnsoft.com/img/emoticons/surprised.gif",
		"8)": "https://cdn.vaughnsoft.com/img/emoticons/sunglasses.gif",
		";(": "https://cdn.vaughnsoft.com/img/emoticons/cry.gif",
		":/": "https://cdn.vaughnsoft.com/img/emoticons/meh.png",
		";)": "https://cdn.vaughnsoft.com/img/emoticons/wink.gif",
		":X": "https://cdn.vaughnsoft.com/img/emoticons/lipssealed.gif",
		"(thankyou)": "https://cdn.vaughnsoft.com/img/emoticons/thankyou.gif",
		"(hippo)": "https://cdn.vaughnsoft.com/img/emoticons/hippo.gif",
		"FrankerZ": "http://vignette3.wikia.nocookie.net/spinpasta/images/6/67/FRANKERZ.PNG/revision/latest?cb=20140619231309",
	}

	<?php if($loggedIn): ?>
		var localUserAvatar = "<?php echo $localUser->getAvatarFull(); ?>";
		var localUserName = "<?php echo $localUser->getName(); ?>";
		var localUserSteamID64 = "<?php echo $localUser->getSteamID64(); ?>";
	<?php endif; ?>

	var connectedUsers = [];
	var currentTargetNum = 0;
	var userTargetList = [];

	var socketio = io.connect("mycho.de:1337");

	<?php if($loggedIn): ?>
		socketio.emit("connect_to_server", { 
			name: localUserName,
			steamID: localUserSteamID64
		});
	<?php endif; ?>

	socketio.on("get_connected_clients", function(data) {
		connectedUsers = data['connections'];
		updateConnectedUserList();
	});

	socketio.on("send_message_history", function(data) {
		var messages = data['messages'];
		for( i = 0; i < messages.length; i++ ) {
			var msg = messages[i];
			createMessage( msg );
		}
	});

	socketio.on("message_to_client", function(data) {
		if(data.hasOwnProperty(['server'])) {
			createServerMessage( data );
		} else {
			createMessage( data );
		}
	});

	function replaceSpaceUnderscore( str ) {
		return str.split(" ").join("_");
	}

	function replaceUnderscoreSpace( str ) {
		return str.split("_").join(" ");
	}

	function isValidConnectedUserName( name ) {
		for( var i in connectedUsers ) {
			var user = connectedUsers[i];
			if ( replaceSpaceUnderscore( user['name'] ) == replaceSpaceUnderscore( name ) ) {
				return user;
			}
		}

		return false
	}

	function createServerMessage( data ) {
		if( currentServer == "website" ) return;
		if( !servers.hasOwnProperty(currentServer) || servers[currentServer] != data['server'] ) return;

		var chat = document.getElementById("chat-content");

		var date = new Date( data['date'] );
    	var hours = date.getHours() > 12 ? date.getHours() % 12 : date.getHours();
    	var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    	var timeofday = date.getHours() > 12 ? "pm" : "am";
    	var fomattedDate = hours + ":" + minutes + timeofday;

    	var formattedText = data['text'].replace(/<\/?[^>]+(>|$)/g, "");
    	var formattedName = data['name'].replace(/<\/?[^>]+(>|$)/g, "");

    	chat.innerHTML = ( chat.innerHTML +
	    "<div id = 'chat-message' >" +
	    	"<span id = 'av-span'>" +
	    		"<div>" +
	    			"<img src = '" + localUserAvatar + "'>" +
	    		"</div>" +
	    	"</span>" +
	    	"<span id = 'data-span'>" +
	    		"<b>" + formattedName + "</b>" + "<i>" + fomattedDate + "</i>" +
		    	"<p>" + formattedText + "</p>" +
		    "</span>" +
	    "</div>"
	    );

		chat.scrollTop = chat.scrollHeight;
	}

	function createMessage( data ) {
		if( currentServer != "website" ) return;

		var chat = document.getElementById("chat-content");

		var date = new Date( data['date'] );
    	var hours = date.getHours() > 12 ? date.getHours() % 12 : date.getHours();
    	var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    	var timeofday = date.getHours() > 12 ? "pm" : "am";
    	var fomattedDate = hours + ":" + minutes + timeofday;

    	var formattedText = data['message'].replace(/<\/?[^>]+(>|$)/g, "");
    	var formattedName = data['name'].replace(/<\/?[^>]+(>|$)/g, "");

    	var isTargeted = false;
    	var words = formattedText.split(" ");

    	// Add @player tagging
    	var taggedUser = isValidConnectedUserName(words[0].substr(1));
    	if ( words[0].indexOf( "@" ) == 0 && taggedUser ) {
    		words[0] = "<font color='#4183D7'>" + replaceUnderscoreSpace( words[0] ) + "</font>";
    		isTargeted = taggedUser['steamID'] == localUserSteamID64;
    	}

    	// Check for emotes
    	for( var index in words ) {
    		var word = words[index];
    		if( emotes.hasOwnProperty( word ) ) {
    			words[index] = " <img src = '" + emotes[word] + "' height = '16px'> ";
    		}
    	}
    	formattedText = words.join(" ");

    	//console.log( formattedText );

    	var chatClass = isTargeted ? "atMe" : "";
	    chat.innerHTML = ( chat.innerHTML +
	    "<div id = 'chat-message' class = '" + chatClass + "' >" +
	    	"<span id = 'av-span'>" +
	    		"<div>" +
	    			"<img src = '" + data['avatar'] + "'>" +
	    		"</div>" +
	    	"</span>" +
	    	"<span id = 'data-span'>" +
	    		"<b>" + formattedName + "</b>" + "<i>" + fomattedDate + "</i>" +
		    	"<p>" + formattedText + "</p>" +
		    "</span>" +
	    "</div>"
	    );

		chat.scrollTop = chat.scrollHeight;
	}

	function sendMessage() {
		if( currentServer != "website" ) return;

		var input = document.getElementById("chat-text-input");
		var targetList = $( "#targetList" );
	    var text = input.value;

	    targetList.html("");
    	targetList.css( "opacity", 0 );

	    if( text.trim().length > 0 ) {
		    socketio.emit("message_to_server", { 
		    	message: text,
		    	date: Date.now(),
		    	avatar: localUserAvatar,
		    	name: localUserName,
		    	steamID: localUserSteamID64
		    });
		}

		input.value = "";
	}

	function searchKeyPress(e)
    {
        // look for window.event in case event isn't passed in
        e = e || window.event;
        if (e.keyCode == 13)
        {
            document.getElementById('chat-send-button').click();
        }
    }

    function getMatchingConnectedUsers( str ) {
    	var matchedUsers = [];

    	if (str == "") return connectedUsers;

    	for( var i in connectedUsers ) {
			var user = connectedUsers[i];
			var contains = replaceSpaceUnderscore( user['name'] ).indexOf( replaceSpaceUnderscore( str ) ) != -1;
			var same = replaceSpaceUnderscore( user['name'] ) == replaceSpaceUnderscore( str );
			if ( contains && !same ) {
				matchedUsers.push( user );
			}
		}


		return matchedUsers;
    }

    function updateTargetList() {
    	currentTargetNum = 0;

    	var input = $("#chat-text-input");
    	var text = input.val();
    	var inputPos = input.position();

    	var targetList = $( "#targetList" );
    	targetList.offset({ top: inputPos.top + 43, left: inputPos.left + 2 });

    	if( text.indexOf( "@" ) != 0 ) {
    		targetList.html("");
    		targetList.css( "opacity", 0 );
    		return;
    	} 

    	userTargetList = getMatchingConnectedUsers( text.substr(1) );

    	createTargetList();
    	
    }

    function createTargetList() {
    	var targetList = $( "#targetList" );

    	if( userTargetList.length > 0 ) {
    		targetList.css( "opacity", 1 );
    	} else {
    		targetList.html("");
    		targetList.css( "opacity", 0 );
    		return;
    	}

    	targetList.html("");
    	for( i in userTargetList ) {
    		var user = userTargetList[i];
    		var isSelected = i == currentTargetNum;
    		var cls = isSelected ? "class = 'selected'" : "";
    		targetList.html( targetList.html() + "<p " + cls + " >@" + replaceSpaceUnderscore( user['name'] ) + "</p>" );
    	}
    }

    function updateConnectedUserList() {
    	var userTargetList = document.getElementById("connectedUsers");
    	userTargetList.innerHTML = "";

    	for( i = 0; i < connectedUsers.length; i++ ) {
    		userTargetList.innerHTML = ( userTargetList.innerHTML +
    			"<b>" + connectedUsers[i]['name'] + "</b>, "
    		);
    	}
    }

    function createServerRooms() {
    	var roomCont = $( "#rooms" );
    	roomCont.html("");

    	for( name in servers ) {
    		var ip = servers[name];
    		var current = currentServer == name;
    		var listClass = current ? "class = 'current'" : ""

    		roomCont.html( roomCont.html() +
    			"<li " + listClass + ">" + name + "</li>"
    		);
    	}

    	$( "#rooms li" ).each( function( index, elem ) {
    		var self = $(elem);

    		self.click( function() {
    			var chat = $("#chat-content");
    			chat.html("");

    			var input = $("#input");

    			var room = self.html();
    			currentServer = room;
    			createServerRooms();

    			if(currentServer != "website") {
    				input.hide();
    			} else {
    				input.show();
    			}
    		});
    	});
    }

    window.onload = function() {
    	var emotesOpen = false;

    	var emotesCont = $("#emotesCont");
    	emotesCont.hide();
    	emotesCont.css( "opacity", 1 );

    	var emotesBtn = $("#emotes");
    	var btnPos = emotesBtn.position();

    	for( var emote in emotes ) {	
    		if (emotes.hasOwnProperty(emote)) {
		        emotesCont.html( emotesCont.html() +
	    			"<a href = '#' class = 'emote' id = 'emote_" + emote + "' ><img src = '" + emotes[emote] + "' height = '16px'></a>"
	    		);
		    }
    	}

    	emotesBtn.click( function() {
    		if (emotesOpen) {
				emotesCont.hide();
    		} else {
    			emotesCont.show();
    			emotesCont.offset({ top: btnPos.top - 110, left: btnPos.left });
    		}

    		emotesOpen = !emotesOpen;
    	});

    	$( ".emote" ).each( function( index, elem ) {
    		var self = $(elem);
    		var input = document.getElementById("chat-text-input");

    		self.click( function() {
    			var text = input.value;

    			input.value = text + " " + self.attr('id').substring(6) + " ";
    		});
    	});

    	$( "#chat-text-input" ).on('keyup', function() {
		    var key = event.keyCode || event.charCode;

		    if ( key != 9 ) {
		    	updateTargetList();
		    }

		    if (key == 13) { // enter
	            document.getElementById('chat-send-button').click();
	        } else if (key == 40) { // down
	        	currentTargetNum = Math.min(currentTargetNum+1, userTargetList.length);
	        	createTargetList();
	        } else if (key == 38) { // up
	        	currentTargetNum = Math.max(currentTargetNum-1, 0);
	        	createTargetList();
	        } else if (key == 9) { // tab
	        	var input = document.getElementById("chat-text-input");
	        	input.value = "@" + replaceSpaceUnderscore(userTargetList[currentTargetNum]['name']) + " ";
	        	updateTargetList();
	        }
		});

		createServerRooms();
    }

</script>

<div id = "emotesCont" >

</div>

<div id = "targetList" ></div>

<div id = "container" >
    <h1>Chatbox</h1>
	<ul id = "rooms" >

	</ul>
	<div id = "chatbox" >
		<div id = "chat-content">

		</div>
		<?php if($loggedIn) : ?>
			<div id = "input">
				<input id = "chat-text-input" type="text" name="message" autocomplete="off">
				<a id = "emotes" href = "#" ><img src = "../../img/logoKoalaVector.png" /></a>
				<button id = "chat-send-button" onclick="sendMessage()">Send</button>
			</div>
		<?php endif; ?>
		<div id = "connectedUsers" >

		</div>
	</div>
</div>