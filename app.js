let express = require("express");
let socket = require("socket.io");

const app = express();

app.use(express.static("public"));

let port = process.env.PORT || 5000;
let server = app.listen(port,function(e){
    console.log("listening to port",port);
})

let io = socket(server);

io.on("connection",function(socket){
    socket.on("beginPath",function(obj){
        io.sockets.emit("beginPath",obj);
    })

    socket.on("drawPath",function(obj){
        io.sockets.emit("drawPath",obj);
    })
})