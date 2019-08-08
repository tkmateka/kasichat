const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve the PUBLIC directory
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/app.html'));
});

// connect to socket io 
io.on('connection', socket => {
    console.log('a user connected...');

    socket.on('disconnect', () => {
        console.log('user disconnetced...');
    });

    socket.on('message', (message) => {
        console.log('message', message);
        // Broadcast the message to everyone!
        io.emit('message', message);
    });
});

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})



