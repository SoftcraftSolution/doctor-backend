// socket.js (example filename)

const server = require('http').createServer();
const io = require('socket.io')(server);

// Other Socket.IO configurations and event handling can be added here

module.exports = io;
