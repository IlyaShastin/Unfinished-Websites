$( window ).load( function() {
    $( "#createbg" ).hide();
    $( "#createbg" ).css( "opacity", 1 );
    
    $( "#createTopic" ).click( function() {
        $( "#createbg" ).show();
        $('body').css({'overflow':'hidden'});
        $(document).bind('scroll',function () { 
            window.scrollTo(0,0); 
        });
    } );

    $( "#closeBtn" ).click( function() {
        $( "#createbg" ).hide();
        $(document).unbind('scroll'); 
        $('body').css({'overflow':'visible'});
    } );

});