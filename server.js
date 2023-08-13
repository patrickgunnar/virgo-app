"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("https");
var socket_io_1 = require("socket.io");
var fs_1 = require("fs");
// Load the SSL certificate and private key
var serverOpt = {
    key: (0, fs_1.readFileSync)('server.key'),
    cert: (0, fs_1.readFileSync)('server.cert')
};
var server = (0, https_1.createServer)(serverOpt, function (req, res) {
    // Handle HTTP requests
    res.writeHead(200);
    res.end('Hello, HTTPS!');
});
var io = new socket_io_1.Server(server);
// Handle socket connections
io.on('connection', function (socket) {
    console.log('User connected!');
    // Listen for 'chat message' event from the client
    socket.on('chat messages', function (msg) {
        console.log('Message: ', msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });
    // Listen for disconnection
    socket.on('disconnect', function () {
        console.log('User disconnected');
    });
});
// Start the server
var PORT = 4000;
server.listen(PORT, function () {
    console.log("Server listening on port ".concat(PORT));
});
