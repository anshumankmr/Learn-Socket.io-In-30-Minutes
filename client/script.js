import { io } from "socket.io-client";
const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000");
const userSocket = io("http://localhost:3000/user",{ auth: { token: "Test" }});// Namespace can allow you to separate between admin and normal userss
socket.on('connect',() => {
    displayMessage(`You Connected with Socket ID: ${socket.id}`)
}); 
socket.on('receive-message', message => {
    displayMessage(message);
})
userSocket.on('connect_error',error => {
    displayMessage(error);
});
form.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value;
    const room = roomInput.value;
    if (message === "") return;
    displayMessage(message);
    socket.emit("send-message",message, room);

    messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
    const room = roomInput.value;
    socket.emit("join-room", room, msgFromServer => {
        displayMessage(msgFromServer);
        alert(msgFromServer);//Make Sure that the Callback Function is the Last Thing Passed to this emit() function
    });
});

function displayMessage(message) {
    const div = document.createElement("div");
    div.textContent = message;
    document.getElementById("message-container").append(div);
}

let count = 0;
setInterval(() => {
    socket.volatile.emit('ping',++count);
},1000);

document.addEventListener('keydown', e => {
    if (e.target.matches('input')) return;
    if (e.key === 'c') socket.connect();
    if (e.key === 'd') socket.disconnect();
})