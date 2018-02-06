var express        = require('express');
var app            = express();
var server = require('http').createServer(app);
var io 			   = require('socket.io').listen(server);

// var io = require('socket.io')();
// io.listen(8001);



users=[];
connections = [];

server.listen(process.env.PORT || 3000, '0.0.0.0');
console.log("Server running...",3000);

app.get('/',function(req,res){
	res.sendFile(__dirname +'/index.html' );
});

io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('connected: %s sockets connected',connections.length);

	//disconnected
	socket.on('disconnected',function(data){
		// if (!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
	    console.log('disconnected: %s sockets connected',connections.length);
	});
	(function() {
	  var c = 0;
	  var timeout = setInterval(function() {
	    //do thing
	    console.log("hiiii")
	    for (var i = 0; i < connections.length; i++) {
	    	console.log(connections[i])
	    };
	    io.sockets.emit('new message',{msg:"hello evevryone"});
	    c++;
	    if (c > 10) {
	    	console.log("Stop calling......")
	      clearInterval(timeout);
	    }
	  }, 20000);
	})();
	//send masssaage
	// socket.on('send message',function(data){
	// 	io.sockets.emit('new message',{msg:"ashok"+data,user:socket.username});
	// });
	socket.on('new user',function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});
	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});

//app.listen(9000, '0.0.0.0', function() {
  //  console.log('Listening to port:  ' + 9000);
//});
