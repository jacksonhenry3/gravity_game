w = $( window ).width();
h = $( window ).height();

absolute_mouse_position = new vector([0,0])
center                  = new vector([w/2,h/2])


function convert_abs_to_rel(abs_vec){
  rel_vec = new vector([abs_vec.x-center.x,-abs_vec.y+center.y]);
  return(rel_vec)
}

function convert_rel_to_abs(rel_vec){
  abs_vec = new vector([rel_vec.x+center.x,-rel_vec.y+center.y]);
  return(abs_vec)
}


$( "html" ).mousemove(function( event ) {
  absolute_mouse_position.x = event.pageX
  absolute_mouse_position.y = event.pageY
  relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)

  $("#mAbsCoords").html("The absolute mouse cooridnates are "+ absolute_mouse_position.x+","+absolute_mouse_position.y)
  $("#mRelCoords").html("The relative mouse cooridnates are "+ relative_mouse_position.x+","+relative_mouse_position.y)
});
