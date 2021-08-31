var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 80));

var server = app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

var io = require('socket.io')(server);

app.use("/static", express.static('./static/'));
app.use(express.static("./views"));


app.get('/', function (req, res) {
    var path = __dirname + '/views/gossip.html';
    console.log(path);
    res.sendFile(path);
});

const users = {};

io.on("connection", socket => {

    // notify everyone about new user
    socket.on("new-user", name => {
        users[socket.id] = name;
        console.log(name);
        socket.emit('entry');
        socket.broadcast.emit('user-joined-notification',name);
        socket.broadcast.emit('every-online',users);
        socket.emit('online',users);
        
      });

    socket.on('send',msg=>{
        socket.broadcast.emit('receive',{message:msg,username:users[socket.id]});
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',users[socket.id]);
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];

    })
    
})