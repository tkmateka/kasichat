const express = require('express');
const app = express();
const http = require('http').Server(app); // Can also use .createServer(app)
const io = require('socket.io')(http);
const path = require('path');
const users = [];

const PORT = process.env.PORT || 3000;

// Serve the PUBLIC directory
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/app.html'));
});

// connect to socket io 
io.on('connection', socket => {
    // log
    console.log('a user connected...');

    // On loggin
    socket.on('login', function (data, callback) {
        console.log('login', data.name);
        if (users && (users.indexOf(data) != -1)) {
            callback(false);
            console.log(false)
        } else {
            callback(true);
            console.log(true)
            socket.user = data;
            users.push(socket.user);
            io.emit('users', users);
            console.log('users', users);
        }    
    });

    // On send message
    socket.on('message', (message) => {
        console.log('message', message);
        // Broadcast the message to everyone!
        io.emit('message', message);
    });

    // On disconnect
    socket.on('disconnect', () => {
        console.log('user disconnetced...');
    });
});

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})



