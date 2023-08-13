import { createServer } from "http"
import { Server, Socket } from "socket.io"
//import { readFileSync } from "fs"


// Load the SSL certificate and private key
//const serverOpt = {
//    key: readFileSync('server.key'),
//    cert: readFileSync('server.cert')
//}
//
//const server = createServer(serverOpt, (req, res) => {
//    // Handle HTTP requests
//    res.writeHead(200)
//    res.end('Hello, HTTPS!')
//})

const server = createServer((req, res) => {
    // Handle HTTP requests
    res.writeHead(200)
    res.end('Hello, HTTPS!')
})

const io = new Server(server)

// Handle socket connections
io.on('connection', (socket: Socket) => {
    console.log('User connected!')

    // Listen for 'chat message' event from the client
    socket.on('chat messages', (msg: string) => {
        console.log('Message: ', msg)

        // Broadcast the message to all connected clients
        io.emit('chat message', msg)
    })

    // Listen for disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

// Start the server
const PORT = 4000
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
