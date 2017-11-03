var canvas;
var gl;
var myShaderProgramTriangle;
var myShaderProgramSlider;
var myShaderProgramCircle;
var myShaderProgramPoly41;
var myShaderProgramPoly42;
var myShaderProgramHexagon;
var bPosCir;
var yPosTri;
var sliderPos;
var coinCount;
var gameOver;
var xOrgTri;
var Message;
var times;

function init() {
    canvas = document.getElementById( "gl-canvas"); // set up the canvas
    gl = WebGLUtils.setupWebGL(canvas); // set up the WebGL context
    bPosCir = [ 1.0+Math.random(), 1.0+Math.random(), 1.0+Math.random(), 1.0+Math.random(), 1.0+Math.random() ];
    yPosTri = [ 1.0+Math.random(), 1.0+Math.random(), 1.0+Math.random(), 1.0+Math.random(), 1.0+Math.random() ];
    xOrgTri = [ -0.7, -0.3, 0.1, 0.5, 0.9 ];
    sliderPos = -0.1;
    coinCount=0;
    gameOver=0;
    times=0;
    Message="Catch the gold coins, avoid the arrowheads.";

    if( !gl ) {
        alert( "WebGL is not available." );
    }

    gl.viewport( 0, 0, 512, 512 );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clear(  gl.COLOR_BUFFER_BIT );

    render();
}

function drawSlider( x ) {

    myShaderProgramSlider = initShaders( gl, "vertex-shader" , "fragment-shader-slider" );
    gl.useProgram( myShaderProgramSlider ); // set up the shader program

    var point0 = vec2( x, -0.975 ); // set up the points
    var point1 = vec2( x, -0.875 );
    var point2 = vec2( x+.2, -0.875 );
    var point3 = vec2( x+.2, -0.975 );

    var arrayOfPointsForSlider = [point0, point1, point2, point3] ; //put points in an array

    var bufferId = gl.createBuffer( ); // create the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // bind the buffer
    // buffer the data on the GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPointsForSlider), gl.STATIC_DRAW );
    // set myPosition in vertex—shader to iterate over the slider points
    var myPosition = gl.getAttribLocation( myShaderProgramSlider, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT , false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 ) ; // draw the slider
}

function drawTriangle( startx, starty ) {

    var point0 = vec2( startx, starty );                // set up the points
    var point1 = vec2( startx - 0.075, starty + 0.2 );
    var point2 = vec2( startx + 0.075, starty + 0.2 );
    var arrayOfPointsForTriangle = [point0, point1, point2] ; // put points in an array
    var bufferId = gl.createBuffer( ); // create the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ) ; // bind the buffer

    // buffer the data on the GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPointsForTriangle), gl.STATIC_DRAW );

    // set myPosition in vertex—shader to iterate over the triangle points
    var myPosition = gl.getAttribLocation( myShaderProgramTriangle, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 3 ); // draw the triangle
}

function makeTriangle( ){

    myShaderProgramTriangle = initShaders( gl, "vertex-shader", "fragment-shader-triangle" );
    gl.useProgram( myShaderProgramTriangle ); // set up the shader program

    var i;

    for( i=0; i<5; i++ ){
        drawTriangle( xOrgTri[i], yPosTri[i] );
        yPosTri[i]-=.03;
        if( yPosTri[i] < -1.2 ){
            yPosTri[i] = 1.0+Math.random();
        }
    }
}

function drawCircle( xstart, xend, a, b ) {


    var arrayOfPointsForCircle=[];
    var n = 100;
    var delta = (xend-xstart)/(n-1);
    var xterm;
    var r = 0.1;
    var i;
    var x, y;
    var pt;
    for( i=0; i<n; i++ ){
        x = xstart + delta*i;
        xterm = (x-a)*(x-a);
        y = Math.sqrt( (r*r)-xterm )+b;
        pt = vec2(x,y);
        arrayOfPointsForCircle.push(pt);
    }

    for( i=0; i<n; i++ ){
        x = xstart + delta*i;
        xterm = (x-a)*(x-a);
        y = (-Math.sqrt( (r*r)-xterm ))+b;
        pt = vec2(x,y);
        arrayOfPointsForCircle.push(pt);
    }
    var bufferId = gl.createBuffer(); // create the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // bind the buffer
    // buffer the data on the GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPointsForCircle), gl.STATIC_DRAW  );
    // set myPosition in vertex-shader to iterate over the ellipse points
    var myPosition = gl.getAttribLocation( myShaderProgramCircle, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 2*n );
}

function makeCircle( ){

    myShaderProgramCircle = initShaders( gl, "vertex-shader" , "fragment-shader-circle" );
    gl.useProgram( myShaderProgramCircle ); // set up the shader program

    var i;
    var xstart = -0.975;
    var xend = -0.775;
    var a = -0.875;

    for( i=0; i<5; i++ ){
        drawCircle( xstart, xend, a, bPosCir[i] );
        xstart+=0.4;
        xend+=0.4;
        a+=0.4;
        bPosCir[i]-=.01;

        if( bPosCir[i] < -1.0){
            bPosCir[i] = 1.0+Math.random();
            coinCount--;
        }
    }
}

function drawPoly41() {
	var point0 = vec2( 1.0, -0.975 );                // set up the points
    var point1 = vec2( -0.975, -0.975 );
    var point2 = vec2( -1.0, -1.0 );
	var point3 = vec2( 1.0, -1.0 );
	
    var arrayOfPointsForPoly41 = [point0, point1, point2, point3] ; // put points in an array
    var bufferId = gl.createBuffer( ); // create the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ) ; // bind the buffer

    // buffer the data on the GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPointsForPoly41), gl.STATIC_DRAW );

    // set myPosition in vertex—shader to iterate over the polygon points
    var myPosition = gl.getAttribLocation( myShaderProgramPoly41, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 ); // draw the polygon
}

function makePoly41( ){

    myShaderProgramPoly41 = initShaders( gl, "vertex-shader", "fragment-shader-polygon41" );
    gl.useProgram( myShaderProgramPoly41 ); // set up the shader program

    drawPoly41();
}

function drawPoly42() {
	var point0 = vec2( -1.0, 1.0 );                // set up the points
    var point1 = vec2( -1.0, -1.0 );
    var point2 = vec2( -0.975, -0.975 );
	var point3 = vec2( -0.975, 1.0 );
	
    var arrayOfPointsForPoly42 = [point0, point1, point2, point3] ; // put points in an array
    var bufferId = gl.createBuffer( ); // create the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ) ; // bind the buffer

    // buffer the data on the GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPointsForPoly42), gl.STATIC_DRAW );

    // set myPosition in vertex—shader to iterate over the polygon points
    var myPosition = gl.getAttribLocation( myShaderProgramPoly42, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 ); // draw the polygon
}

function makePoly42( ){

    myShaderProgramPoly42 = initShaders( gl, "vertex-shader", "fragment-shader-polygon42" );
    gl.useProgram( myShaderProgramPoly42 ); // set up the shader program

    drawPoly42();
}

function drawHexagon() {
	var point0 = vec2( 1.0, 1.0 );                // set up the points
    var point1 = vec2( -0.975, 1.0 );
    var point2 = vec2( -0.975, 0.975 );
	var point3 = vec2( 0.975, 0.975 );
	var point4 = vec2( 0.975, -0.975 );
	var point5 = vec2( 1.0, -0.975 );
	
    var arrayOfPointsForHexagon = [point0, point1, point2, point3, point4, point5] ; // put points in an array
    var bufferId = gl.createBuffer( ); // create the buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ) ; // bind the buffer

    // buffer the data on the GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPointsForHexagon), gl.STATIC_DRAW );

    // set myPosition in vertex—shader to iterate over the hexgon points
    var myPosition = gl.getAttribLocation( myShaderProgramHexagon, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 6 ); // draw the hexgon
}

function makeHexagon( ){

    myShaderProgramHexagon = initShaders( gl, "vertex-shader", "fragment-shader-Hexagon" );
    gl.useProgram( myShaderProgramHexagon ); // set up the shader program

    drawHexagon();
}

function moveSquareKeys(event){
    if(event.keyCode == 65){
        if(sliderPos > -1.0)
        sliderPos-=0.05;
        times = 0;
    }
	else if(event.keyCode == 83){
        if( sliderPos < 0.8 )
        sliderPos+=0.05;
        times = 0;
    }
}

function collision(){
    var i;

    for( i=0; i<5; i++ ){
        if( ( bPosCir[i] <= -0.87 ) && ( sliderPos >= (-1.1+(0.4*i)) ) && (sliderPos <= (-0.9+(0.4*i) )) )
            coinCount++;
        if( (yPosTri[i] <= -0.9)&&( yPosTri[i] >= -1.0)&&(sliderPos+0.2 >= xOrgTri[i] )&&(sliderPos <= xOrgTri[i] ) )
            gameOver=1;
    }

}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT);
    makeTriangle( );
    makeCircle( );
	makePoly41( );
	makePoly42( );
    drawSlider( sliderPos );
    makeHexagon( );
    collision();
    if( gameOver == 0)
        requestAnimFrame( render );
    if( gameOver == 1)
        Message="GAME OVER!!";
	document.getElementById("game").innerHTML = Message;
	document.getElementById("score").innerHTML = Math.round(coinCount/10);
    times++;
    if(times > 100){
        sliderPos+=0.05;
        times = 50;
    }
}