// curl -k https://localhost:8000/
var express = require( "express" );
var http = require( "http" );
var logger = require( "morgan" );

var app = express();

app.use( logger( "dev" ) );
app.use( express.static( __dirname + "/public" ) );

http.createServer( app ).listen( 8000 );
