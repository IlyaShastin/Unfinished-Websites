
<div id = "main" >
	<?php if($loggedIn) : ?>
		<script>
			var localUserName = '<?php echo $localUser->getName(); ?>';
			var localUserAvatar = '<?php echo $localUser->getAvatarFull(); ?>';
			var localUserSteamID64 = '<?php echo $localUser->getSteamID64(); ?>';

			var localUser = {
				name: localUserName,
				avatar: localUserAvatar,
				steamid: localUserSteamID64
			};

			var socketio = io.connect("mycho.de:1337");

			socketio.emit("connectId", { 
				steamId: localUserSteamID64
			});

			function joinLobby( id ) {
				socketio.emit("lobby:join", { 
					steamId: localUserSteamID64,
					lobbyId: id
				});
			}
		</script>

		<div id = "lobby" style="display:inline-block;float:left;width:calc( 60vw - 10px );" ></div>
		<div id = "friendlist" style="display:inline-block;float:right;" ></div>
		<script type="text/jsx" >
			$(document).ready(function() {
				React.render(
			        <TenManLobby socket={socketio} localUser={localUser} />,
			        document.getElementById('lobby')
			    );

				React.render(
			        <Friends socket={socketio} localUser={localUser} />,
			        document.getElementById('friendlist')
			    );
			});
		</script>
	<?php else : ?>

	<?php endif; ?>
</div>
