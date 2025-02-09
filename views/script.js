let socket;
let username = "";

function signup() {
    const usernameInput = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, email, password }),
    })
    .then(res => res.json())
    .then(data => alert(data.msg));
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            username = data.username;
            document.getElementById("auth").style.display = "none";
            document.getElementById("chat").style.display = "block";
            startChat();
        } else {
            alert(data.msg);
        }
    });
}

function startChat() {
    socket = new WebSocket("ws://localhost:5000");

    socket.onmessage = (event) => {
        const messages = document.getElementById("messages");
        messages.innerHTML += `<p>${event.data}</p>`;
    };
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    socket.send(username + ": " + input.value);
    input.value = "";
}
