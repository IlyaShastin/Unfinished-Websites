$( window ).load( function() {
    var modal = $( "#replyModal" ),
        editModal = $( "#editModal" ),
        delModal = $( "#deleteModal" );
    
    modal.hide();
    modal.css( "opacity", 1 );
    
    editModal.hide();
    editModal.css( "opacity", 1 );
    
    delModal.hide();
    delModal.css( "opacity", 1 );
    
    $( ".post" ).each( function( index, elem ) {
        var self = $(elem);
        
        self.find( "#quote" ).click( function() {
            modal.show();
            
            var ava = self.find( "#postAvatar" ).attr( "src" );
            var nme = self.find( "#postName" ).html();
            var msg = self.find( "#message" ).html();
            var id = self.find( "#postid" ).html();
            
            modal.find( "#replyAvatar" ).attr( "src", ava );
            modal.find( "#replyName" ).html( nme );
            modal.find( "#message" ).html( msg );
            modal.find( "#replyid" ).attr( "value", id );
            
            $('body').css({'overflow':'hidden'});
            $(document).bind('scroll',function () { 
                window.scrollTo(0,0); 
            });
        } );
        
        self.find( "#edit" ).click( function() {
            editModal.show();
            
            var msg = self.find( "#message pre" ).html();
            var id = self.find( "#postid" ).html();
            
            editModal.find( "#message" ).val( msg );
            editModal.find( "#postid" ).attr( "value", id );
            
            $('body').css({'overflow':'hidden'});
            $(document).bind('scroll',function () { 
                window.scrollTo(0,0); 
            });
        } );
        
        self.find( "#delete" ).click( function() {
            delModal.show();
            
            var id = self.find( "#postid" ).html();
            
            delModal.find( "#postid" ).attr( "value", id );
            
            $('body').css({'overflow':'hidden'});
            $(document).bind('scroll',function () { 
                window.scrollTo(0,0); 
            });
        } );
    } );
    
    $( ".cancel" ).each( function( index, elem ) {
        var self = $(elem);
        
        self.click( function() {
            modal.hide();
            editModal.hide();
            delModal.hide();
            $(document).unbind('scroll'); 
            $('body').css({'overflow':'visible'});
        } );
    } );
});