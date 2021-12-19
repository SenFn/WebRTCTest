const express = require('express');
const credentials = require('./credentials');
const app = express();
let server;

let port;

if (credentials.key && credentials.cert) {
    const https = require('https');
    server = https.createServer(credentials, app);
    port = 2910;
} else {
    const http = require('http');
    server = http.createServer(app);
    port = 3000;
}

const io = require('socket.io')(server);
const {v4: uuidV4 } = require('uuid');

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) =>{
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) =>{
    res.render(`room`, {roomId: req.params.room});
});

io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', ()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
    });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));