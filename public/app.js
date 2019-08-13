const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };

// Chat Stuff
const displayContainer = document.getElementById('displayContainer');
const chatWindow = document.getElementById('chat');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const friends = document.getElementById('userContainer');

// Login Stuff
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('loginWindow');
const errorMessage = document.getElementById('errorMessage');

const users = []; // {name, email, gender, image}
const messages = []; // {author, data, content, type}

// Socket IO
var socket = io();

// Get users
socket.on('users', (users) => {

    friends.innerHTML = '';

    // Filter Through users to find duplicate
    function removeDuplicates(users, prop) {
        let newArray = [];
        let lookupObject = {};

        for (let i in users) {
            lookupObject[users[i][prop]] = users[i];
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    // Loop through users and display
    for (let user of removeDuplicates(users, "name")) {
        console.log(username, 'User name');
        // Friends Info
        friends.innerHTML += `
            <div id="user" class="${user.name === username ? 'hidden' : ''}">
                <div class="userImage">
                    <img id="friendImg" src="${user.image}" alt="Pro Pic">
                </div>
                <div class="userDetails">
                    <p id="friendName"><b>${user.name}</b></p>
                    <p id="friendEmail"><i>${user.email}</i></p>
                </div>
            </div>
        `
    }
})

// Handle incoming messages
socket.on('message', message => {
    console.log(message);
    if (message.type !== messageTypes.LOGIN) {
        if (message.author === username) {
            message.type = messageTypes.RIGHT;
        } else {
            message.type = messageTypes.LEFT;
        }
    }

    messages.push(message);
    displayMessages();
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Login Button Callback
loginBtn.addEventListener('click', e => {
    // Prevent form default
    e.preventDefault();
    // Set the username and display the logged in message
    if (!usernameInput.value) {
        return console.log('Must supply a username')
    }

    username = usernameInput.value;

    // Generate Message
    const user = {
        name: username,
        email: 'user@gmail.com',
        gender: 'male',
        image: '/assets/proPic.jpg'
    }

    // Handle login
    socket.emit('login', user, function (isUnique) {
        console.log(isUnique, 'isUnique');

        if (isUnique) {
            // Hide Login and show chat
            loginWindow.classList.add('hidden');
            displayContainer.classList.remove('hidden');

            // Clear Input
            usernameInput.value = '';
        } else {
            errorMessage.classList.remove('hidden');
        }
    });
})

// Send Button Callback
sendBtn.addEventListener('click', (e) => {
    // Prevent form default
    e.preventDefault();
    // Set the username and display the logged in message
    if (!messageInput.value) {
        return console.log('Must supply a message')
    }

    // Create date
    const date = new Date();
    const day = ('0' + date.getDate());
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const dateString = `${day}-${month}-${year}`;

    // Generate Message
    const message = {
        author: username,
        date: dateString,
        content: messageInput.value
    }

    socket.emit('message', message);

    messageInput.value = '';
})

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

// Display Messgages
const displayMessages = () => {
    const messageHTML = messages
        .map((message) => createMessageHTML(message))
        .join('');
    messageList.innerHTML = messageHTML;
    console.log('display message')
}

displayMessages();



