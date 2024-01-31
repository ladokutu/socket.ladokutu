const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const serverless = require('serverless-http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || 8000;
const list_users = [];
const io = new Server(
	server,{
	  cors: {
		origin: ["https://core.ladokutu.info","https://node.ladokutu.info","https://ladokutu.info","https://apps.tatamulia.co.id:7443","http://localhost:5000"],
		methods: ["GET", "POST"]
	  }
	});


io.on('connection', (socket) => {
  ///add new command here
	
	socket.on("connected", function (data) {
		var new_data = {"id_socket":socket.id,"user_name":data.user_name};
		var user_name = data.user_name;
		list_users.filter(x => x.user_name === user_name).forEach(x => list_users.splice(list_users.indexOf(x), 1));
		list_users.push(new_data);
		if (socket.id) { 
			console.log('Connected',socket.id)
		}
		console.log(list_users)
	});
	
	
	socket.on('new_data', function(data){
	  data.recepient.forEach((elem) => {
        var picked = list_users.filter(function(item) {
		  return  item.user_name.includes(elem);
		});
		picked.forEach((ele) => {
			io.sockets.to(ele.id_socket).emit( 'new_data', {
				id_data: data.id_data,
				name_data: data.name_data,
				alert: data.alert,
				status:data.status
			});
		});
      });
	});
	
	
});	


runn = server.listen(port)
module.exports.handler = serverless(runn);