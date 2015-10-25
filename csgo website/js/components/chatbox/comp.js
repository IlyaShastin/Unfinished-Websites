
var ChatBox = React.createClass({
	getInitialState: function() {
	    return { messages: [] };
	},

	componentDidMount: function() {
        this.props.socket.on('lobby:receiveChat', this._newMessage);
    },

    _newMessage: function(data) {
    	var msgs = this.state.messages;

    	msgs.push(
    		<ChatMessage name={data['name']} message={data['msg']} ></ChatMessage>
    	);

    	this.replaceState({ messages: msgs });

    	var msglist = this.refs.msglst.getDOMNode();
    	msglist.scrollTop = msglist.scrollHeight;
    },

    _sendMessage: function( msg ) {
    	this.props.socket.emit('lobby:sendChat', {
    		steamId: this.props.steamId,
    		lobbyId: this.props.lobbyId,
    		message: msg
    	});
    },

    render: function() {
        return(
        	<div id = "ChatBox">
        		<h1 id = "heading" >CHAT</h1>
	        	<div ref = "msglst" id = "messageList" >{this.state.messages}</div>
	        	<ChatInput sendMessage={this._sendMessage} /> 
	        </div>
        );
    }
});



var ChatMessage = React.createClass({
    render: function() {
        return(
        	<div id = "ChatMessage">
	        	<h1 id = "name" >{this.props.name}:</h1>
	        	<p id = "msg" >{this.props.message}</p>
	        </div>
        );
    }
});

var ChatInput = React.createClass({
	getInitialState: function() {
	    return { text: '' };
	},

	_handleSubmit: function(e) {
		e.preventDefault();

		if(this.state.text.trim() == '' ) return;

		this.props.sendMessage( this.state.text );
		this.replaceState({ text: '' });
	},

	_changeHandler: function(e) {
		this.replaceState({ text : e.target.value });
	},

    render: function() {
        return(
        	<div id = "ChatInput">
				<form onSubmit={this._handleSubmit}>
					<input
						onChange = {this._changeHandler}
						value = {this.state.text}
						placeholder = "Chat"
					/>
				</form>
	        </div>
        );
    }
});