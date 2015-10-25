var NavBar = React.createClass({
	getDefaultProps: function() {
	    return {
	        pages:  ["home","10 mans","scrims","pugs","servers","blog"]
	    };
	},

    render: function() {
		var pageElems = [];
		for( var key in this.props.pages ) {
			var btnClass = 'pageBtn';
			btnClass += this.props.pages[key] == currentPage ? ' current' : '';
			pageElems.push( <a className = {btnClass} href = {"/index.php?page=" + this.props.pages[key]}>{this.props.pages[key]}</a> );
		}

        return(
        	<div id = "navBar">
	        	{pageElems}
	        	<a id = "searchBtn" href = "#" ><img src = "../../img/search.png" ></img></a>
	        	<input type="text" name="search" autoComplete="off" placeholder="SEARCH" ></input>
	        </div>
        );
    }

});