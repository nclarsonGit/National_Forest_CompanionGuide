//	Nick Larson
// WEB Programming
// April 28th 2023
// Forest Mapping

// Setup HTTP and Express
// ----------------------
var url = require('url');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var https = require('https');
var io = require('socket.io')(http);

// We will serve a static HTML file from the /public directory
// -----------------------------------------------------------
app.use(express.static(__dirname + "/public"));

// Use the bodyparser middleware.  
// -----------------------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('socketio', io);


// On an initial connection from the broswer, initialize an
//  instance of our server-side web-app
// ------------------------------------
io.on('connection', function(socket) {

  // Print a status message to the console when a new browser 
  //   instance connects.
  // -----------------------------
  console.log('a user connected ' + __dirname);

	// grab JSON file, name it something, use JSON.parse to get info
	// with JSON.parse call, can treat the "body" variable as the file.
	socket.on('reminder', function(data){
			console.log('Recieved initial message from browser.' + data.theMess);
			https.get('https://data-usfs.hub.arcgis.com/datasets/usfs::forest-common-names-feature-layer.geojson?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D', 
			(res2) =>{
			let body = "";

			res2.on('data', (chunk)=>{
				body += chunk;
			});

			res2.on("end", ()=>{
				try{
					let json = JSON.parse(body);
					// Send data to HTML
					socket.emit('forestData', json);
				} catch (error) {
		            console.error(error.message);
		        };
			});
		}).on('error', (e) => {
		  console.error(e);
		});
	});

	socket.on('filter', function(data){
		https.get('https://data-usfs.hub.arcgis.com/datasets/usfs::recreation-sites-feature-layer.geojson?outSR=%7B%22latestWkid%22%3A4269%2C%22wkid%22%3A4269%7D',
			(res)=>{
				let body = "";
				res.on('data', (chunk)=>{
					body+=chunk;
				});

				res.on('end', ()=>{
					try{
							let json = JSON.parse(body)	
							socket.emit('recData', json);						
					} catch(error){
						console.error(error.message);
					};
				});
				}).on('error', (e)=>{
					console.error(e);
			});
	});



	// set up the root route  (only seen if app.use is commented out above!)
	app.get("/", function (req, res) {
	    res.send("This is the root route!");
	});

	// All of these get methods reroute the user to the respective 
	// browser for whatever region they selected to view
	// -----------------------------------------------------------
	app.get('/public/north.html', function(req, res){
		res.sendFile(__dirname + '/public/north.html');
	});

	app.get('/south', function(req, res){
		res.sendFile(__dirname +'/public/south.html');
	});

	app.get('/midwest', function(req, res){
		res.sendFile(__dirname +'/public/midwest.html');
	});

	app.get('/southwest', function(req, res){
		res.sendFile(__dirname +'/public/southwest.html');
	});

	app.get('/rockies', function(req, res){
		res.sendFile(__dirname +'/public/rockies.html');
	});	

	app.get('/cali', function(req, res){
		res.sendFile(__dirname +'/public/cali.html');
	});	

	app.get('/pnw', function(req, res){
		res.sendFile(__dirname +'/public/pnw.html');
	});	

	app.get('/upperEast', function(req, res){
		res.sendFile(__dirname +'/public/upperEast.html');
	});	

	app.get('/alaska', function(req, res){
		res.sendFile(__dirname +'/public/alaska.html');
	});	
	
	app.get('/browse',function(req, res){
		res.sendFile(__dirname + '/public/browseMap.html');
	});


  // On broswer disconnect (page close), clean up
  //   after yourself!
  // -------------------------------------
  socket.on('disconnect', function() {
  	console.log('user disconnected');
  });
});

// Have our application listen on port 3011
// ----------------------------------------
http.listen(3011, function() {
  console.log('Listening on port 3011');
});