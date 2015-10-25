
var QuickOptions = React.createClass({
    
    render: function() {
        return(
        	<div id = "QuickOptions">
	        	<a href = "#" id = "profile" >Profile</a>
	        	<a href = "#" id = "notifications" >Notifications</a>
	        	<a href = "#" id = "roster" >Roster</a>
	        	<a href = "#" id = "recent" >Recent Games</a>
	        	<a href = "?logout" id = "out" >Logout</a>
	        </div>
        );
    }

});