const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };

// Chat Stuff
const chatWindow = document.getElementById('chat');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Login Stuff
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('loginWindow');

const messages = []; // {author, data, content, type}

// Socket IO
var socket = io();

// Handle incoming messages
socket.on('message', message => {
    console.log(message);
    if(message.type !== messageTypes.LOGIN) {
        if(message.author === username) {
            message.type = messageTypes.RIGHT;
        } else {
            message.type = messageTypes.LEFT;
        }
    }

    messages.push(message);
    displayMessages();
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Take in message object, and return corresponding message HTML
const createMessageHTML = (message) => {
    if (message.type === messageTypes.LOGIN) {
        return `
            <p class="secondaryText textCenter marginBottom_2">${message.author} has joined the chat</p>
        `;
    }

    return `
        <div class="message ${message.type === messageTypes.LEFT ? 'messageLeft' : 'messageRight'}">
            <div class="messageDetails flex">
                <p class="flexGrow_1 messageAuthor">${message.type === messageTypes.RIGHT ? '' : message.author}</p>
                <p class="messageDate">${message.date}</p>
            </div>
            <p class="messageContent">${message.content}</p>
        </div>
    `;
}

const displayMessages = () => {
    const messageHTML = messages
        .map((message) => createMessageHTML(message))
        .join('');
    messageList.innerHTML = messageHTML;
    console.log('display message')
}

displayMessages();

// Send Button Callback
sendBtn.addEventListener('click', (e) => {
    // Prevent form default
    e.preventDefault();
    // Set the username and display the logged in message
    if(!messageInput.value) {
        return console.log('Must supply a message')
    }

    const date = new Date();
    const day = ('0' + date.getDate());
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const dateString = `${day}-${month}-${year}`;

    const message = {
        author: username,
        date: dateString,
        content: messageInput.value
    }

    socket.emit('message', message);

    messageInput.value = '';
})

const sendMessage = message => {
    socket.emit('message', message);
}

// Login Button Callback
loginBtn.addEventListener('click', e => {
    // Prevent form default
    e.preventDefault();
    // Set the username and display the logged in message
    if(!usernameInput.value) {
        return console.log('Must supply a username')
    }
    username = usernameInput.value;

    sendMessage({
        author: username,
        type: messageTypes.LOGIN
    });
    // Hide Login and show chat
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');

    usernameInput.value = '';

})



