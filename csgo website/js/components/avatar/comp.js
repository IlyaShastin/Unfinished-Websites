
var Avatar = React.createClass({
    
    render: function() {
        return(
        	<a href = "#" id = "Avatar" className = {this.props.avClass}>
        		<img src = {this.props.user} width = {this.props.wide} ></img>
        	</a>
        );
    }

});