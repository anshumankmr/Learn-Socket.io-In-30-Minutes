const { instrument } = require('@socket.io/admin-ui');
const io = require('socket.io')(3000,{
    cors: {
        origin: ['http://localhost:8080','https://admin.socket.io'] // Solve CORS issue by giving an array  of allowed domain names
        //Added second URL to solve XHR issue on client side
    }
})
io.on('connection',socket => {
    console.log(socket.id);//Print the Random ID given to a Socket
    socket.on('send-message',(string,roomnumber,object) => {// send any number of argument and receive any number
        console.log(string,roomnumber,object);
        if (roomnumber === ''){
            // io.emit('receive-message', string);//Multi cast message to every receiver
            socket.broadcast.emit('receive-message', string)    // send to everyone but yourself    
        } else {
            socket.to(roomnumber).emit('receive-message', string);// send to specific socket only
            // broadcast function is implicity applied
        }
    });
    socket.on('join-room',(room,cb) => {
        socket.join(room);//Join a Specific Room by binding two or more sockets to a particular socket label???
        // a particular socket can be a part  of multiple rooms as well
        cb(`Joined Room Number ${room}`);
    })

})

instrument(io, {auth: false});