w         = $( window ).width();
h         = $( window ).height();

canvas =  $( "#space" )[0]
canvasCtx = canvas.getContext('2d');

canvas.width  = w;
canvas.height = h;



center                  = new vector([w/2,h/2])
function convert_abs_to_rel(abs_vec){
  rel_vec = new vector([abs_vec.x-center.x,-abs_vec.y+center.y]);
  return(rel_vec)
}

function convert_rel_to_abs(rel_vec){
  abs_vec = new vector([rel_vec.x+center.x,-rel_vec.y+center.y]);
  return(abs_vec)
}
absolute_mouse_position = new vector([0,0])
relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)


$( "html" ).mousemove(function( event ) {
  absolute_mouse_position.x = event.pageX
  absolute_mouse_position.y = event.pageY
  relative_mouse_position = convert_abs_to_rel(absolute_mouse_position)


  $("#mAbsCoords").html("The absolute mouse cooridnates are "+ absolute_mouse_position.x+","+absolute_mouse_position.y)
  $("#mRelCoords").html("The relative mouse cooridnates are "+ relative_mouse_position.x+","+relative_mouse_position.y)
});



a = []
for (var i = 0; i < 20; i++) {
  r = 10+Math.random()*30
  p = new vector([ (Math.random()*2-1)*w/2, (Math.random()*2-1)*h/2])
  a.push({r:r,p:p})
}

for (var i = 0; i < a.length; i++) {
  renderCircle(convert_rel_to_abs(a[i].p),a[i].r,'white')
}
function step()
{
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    dt = 1
    v = relative_mouse_position.scale(-dt/40.)

    renderCircle(convert_rel_to_abs(zeroVector(2)),10,'red')

    for (var i = 0; i < a.length; i++) {
      a[i].p = a[i].p.add(v)
      renderCircle(convert_rel_to_abs(a[i].p),a[i].r,'white')
    }
    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);


function renderCircle(p,r,c){
	canvasCtx.beginPath();
	canvasCtx.arc(p.x, p.y,r, 0, 2 * Math.PI, false);
	canvasCtx.fillStyle = c;
	canvasCtx.fill();
}
