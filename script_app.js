import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { scrollToBottom } from './script.js'

const firebaseConfig = {
  apiKey: "AIzaSyBJe-cl2j0LOsM4hIJUByibMnZVz-tUC5E",
  authDomain: "sri-bingo.firebaseapp.com",
  databaseURL: "https://sri-bingo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sri-bingo",
  storageBucket: "sri-bingo.appspot.com",
  messagingSenderId: "907376839088",
  appId: "1:907376839088:web:bc1883a3c572eaf88f6e75"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function createRoom() {
    const hostName = document.getElementById('playerName').value;
    const roomId = document.getElementById('roomName').value;
    const roomData = { host: hostName, started: false , players: {} };

    const playerName = document.getElementById('playerName').value;
    if(playerName && playerName != ""){
        set(ref(database, 'rooms/' + roomId), roomData)
        .then(() => {
            const playerRef = ref(database, 'rooms/' + roomId + '/players/' + playerName);
            set(playerRef, { score: 0 })
            .then(() => {
                const waitingRoom = document.getElementById('waitingRoom');
                const lobby = document.getElementById("lobby");

                lobby.classList.add("hidden");
                waitingRoom.classList.remove("hidden");
                waitingRoom.firstChild.id = roomId;
                showPlayers();

                const playBtn = document.createElement("button");
                playBtn.innerText = `Lancer la partie`;
                playBtn.addEventListener('click', startGameBtn);

                waitingRoom.appendChild(playBtn);

                startGame();
            })
        })
    }
}

function joinRoom() {
    const roomId = this.id;
    const playerName = document.getElementById('playerName').value;

    if(playerName && playerName != ''){
        const playerRef = ref(database, 'rooms/' + roomId + '/players/' + playerName);
        set(playerRef, { score: 0 })
        .then(() => {
            const waitingRoom = document.getElementById('waitingRoom');
            const lobby = document.getElementById("lobby");

            lobby.classList.add("hidden");
            waitingRoom.classList.remove("hidden");
            waitingRoom.firstChild.id = roomId;
            showPlayers();
            startGame();
        })
    }
}

export function sendScore(score){
    const roomId = document.getElementById('waitingRoom').firstChild.id;
    const playerName = document.getElementById('playerName').value;

    const scoreRef = ref(database, `rooms/${roomId}/players/${playerName}/score`);
    set(scoreRef, score);
}

function updatePlayerScore() {
    const roomId = document.getElementById('waitingRoom').firstChild.id;
    const scoreList = document.getElementById('scoreList');

    scoreList.innerHTML = "";

    const playersRef = ref(database, `rooms/${roomId}/players`);
    
    onValue(playersRef, (snapshot) => {
        const players = snapshot.val();
        scoreList.innerHTML = '';

        if (players) {
            Object.keys(players).forEach((playerKey) => {
                const player = players[playerKey];
                const li = document.createElement('div');
                li.innerText = `${playerKey} : ${player.score}`;
                li.classList.add(
                    'text-lg',
                    'font-semibold',
                    'text-teal-700',
                    'mb-2',
                    'p-2',
                    'bg-white',
                    'rounded-lg',
                    'shadow-md'
                );
                scoreList.appendChild(li);
            });
        } else {
            scoreList.innerText = "Aucun joueur dans cette room.";
        }
    });
}

function displayRooms() {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = '';

    const roomsRef = ref(database, 'rooms');
    onValue(roomsRef, (snapshot) => {
        const rooms = snapshot.val();
        if (rooms) {
            Object.keys(rooms).forEach(roomId => {
                const cont = document.createElement('div');

                const li = document.createElement('div');
                li.innerText = `Room ID: ${roomId}`;
                
                li.classList.add(
                    "text-lg",
                    "font-semibold",
                    "text-teal-700",
                    "mr-10"
                );

                const btn = document.createElement('button');
                btn.innerText = `Rejoindre la room`;
                
                btn.addEventListener('click', joinRoom);
                btn.id = roomId;

                btn.classList.add(
                    "rounded-lg",
                    "border",
                    "border-2",
                    "border-teal-600",
                    "bg-teal-500",
                    "hover:bg-teal-600",
                    "text-white",
                    "font-semibold",
                    "px-4",
                    "py-2",
                    "transition-all",
                    "duration-300",
                    "shadow-md"
                );

                cont.appendChild(li);
                cont.appendChild(btn);

                cont.classList.add(
                    "flex",
                    "justify-between",
                    "items-center",
                    "bg-white",
                    "p-4",
                    "rounded-lg",
                    "shadow-lg",
                    "mb-4",
                    "hover:bg-gray-100",
                    "transition-all",
                    "duration-300"
                );

                roomsList.appendChild(cont);
            });
        }
    });
}

var interval = setInterval(displayRooms, 10000);

function showPlayers() {
    const roomId = document.getElementById('waitingRoom').firstChild.id;
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';

    const playersRef = ref(database, 'rooms/' + roomId + '/players/');
    onValue(playersRef, (snapshot) => {
        const players = snapshot.val();
        playersList.innerHTML = '';

        if (players) {
            Object.keys(players).forEach(playerName => {
                const li = document.createElement('div');
                li.innerText = `${playerName}`;
                playersList.appendChild(li);
            });
        }
    });
}

function startGameBtn(){
    const roomId = document.getElementById("waitingRoom").firstChild.id;
    set(ref(database, `rooms/${roomId}/started`),true);
}

function startGame(){
    const chatBtn = document.getElementById("toggleChatBtn");
    chatBtn.classList.remove('hidden');
    const adminBtn = document.getElementById("toggleAdminBtn");
    adminBtn.classList.add('hidden');

    const roomId = document.getElementById("waitingRoom").firstChild.id;
    var started = ref(database, `rooms/${roomId}/started`);

    onValue(started, (snapshot) => {
        const isStarted = snapshot.val();

        if(isStarted){
            const game = document.getElementById("game");
            const waitingRoom = document.getElementById("waitingRoom");
        
            waitingRoom.classList.add("hidden");
            game.classList.remove("hidden");

            updatePlayerScore()
            clearInterval(interval);
        }
    });
}

export function displayChat() {
    const roomId = document.getElementById("waitingRoom").firstChild.id;
    const chatRef = ref(database, `rooms/${roomId}/chatbox`);
    const chatBox = document.getElementById("chatMessages");

    // Clear previous messages in chatBox
    chatBox.innerHTML = '';

    // Listen for changes in the chatbox in real-time
    onValue(chatRef, (snapshot) => {
        const messages = snapshot.val();
        if (messages) {
            // Clear the chatbox before appending new messages
            chatBox.innerHTML = '';

            // Loop through the messages and display each one
            Object.values(messages).forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('mb-2');

                // Format the message
                messageDiv.innerHTML = `
                    <span class="text-gray-600 font-bold">${message.username}:</span>
                    <span>${message.text}</span>
                `;

                // Append the message to the chatBox
                chatBox.appendChild(messageDiv);
            });

            // Scroll to the bottom of the chat after messages are loaded
            scrollToBottom();
        }
    });

    // Ensure that the event listener is only added once
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');

    // Remove any previous event listener to avoid multiple triggers
    chatInput.removeEventListener('keyup', handleKeyUp);
    chatInput.addEventListener('keyup', handleKeyUp);
    sendBtn.removeEventListener('click', sendMessage);
    sendBtn.addEventListener('click', sendMessage);
}

function handleKeyUp(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    const roomId = document.getElementById("waitingRoom").firstChild.id;
    const chatInput = document.getElementById('chatInput');
    const playerName = document.getElementById('playerName').value;
    const messageText = chatInput.value;

    // Check if the message and playerName are not empty
    if (messageText.trim() !== '' && playerName.trim() !== '') {
        const newMessageRef = push(ref(database, `rooms/${roomId}/chatbox/`));

        // Save the message to the database
        set(newMessageRef, {
            username: playerName,
            text: messageText
        }).then(() => {
            // Clear the input field after sending the message
            chatInput.value = '';
        });
    }
}


document.getElementById("closeAdminBtn").addEventListener("click", function() {
    document.getElementById("adminbox").classList.add("hidden");
});

// Gérer la connexion
document.querySelector("#adminlogin button").addEventListener("click", function() {
    const identifiant = document.getElementById("identifiant").value;
    const motdepasse = document.getElementById("motdepasse").value;

    // Vérification des identifiants
    if (identifiant === "admin" && motdepasse === "admin") {
        // Si authentifié, remplacer le formulaire par la liste des rooms
        loadRooms();
    } else {
        alert("Identifiant ou mot de passe incorrect");
    }
});

function loadRooms() {
    // Masquer le formulaire de connexion
    document.getElementById("adminlogin").innerHTML = '';

    // Créer un conteneur pour afficher la liste des rooms
    const roomsListDiv = document.createElement("div");
    roomsListDiv.id = "roomsListAdmin";
    roomsListDiv.classList.add("flex", "flex-col", "space-y-4", "w-full", "p-4", "overflow-y-auto");

    // Ajouter le conteneur dans l'adminbox
    document.getElementById("adminlogin").appendChild(roomsListDiv);

    // Récupérer les rooms depuis Firebase
    const roomsRef = ref(database, 'rooms');
    onValue(roomsRef, (snapshot) => {
        const rooms = snapshot.val();
        roomsListDiv.innerHTML = ''; // Réinitialiser la liste

        if (rooms) {
            // Parcourir les rooms et les afficher dans l'adminbox avec un bouton de suppression
            Object.keys(rooms).forEach(roomId => {
                const roomDiv = document.createElement('div');
                roomDiv.classList.add("flex", "justify-between", "items-center", "bg-gray-100", "p-2", "rounded", "flex-1");

                const roomInfo = document.createElement('span');
                roomInfo.innerText = `Room ID: ${roomId}`;
                roomDiv.appendChild(roomInfo);

                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = "Supprimer";
                deleteBtn.classList.add("bg-red-500", "text-white", "px-4", "py-2", "rounded", "hover:bg-red-600");
                deleteBtn.addEventListener("click", function() {
                    deleteRoom(roomId);
                });

                roomDiv.appendChild(deleteBtn);
                roomsListDiv.appendChild(roomDiv);
            });
        } else {
            roomsListDiv.innerText = 'Aucune room trouvée.';
        }
    });
}

function deleteRoom(roomId) {
    const roomRef = ref(database, `rooms/${roomId}`);
    remove(roomRef).then(() => {
        alert(`Room ${roomId} supprimée avec succès`);
        loadRooms(); // Recharger la liste des rooms
    }).catch((error) => {
        alert("Erreur lors de la suppression de la room : " + error.message);
    });
}


document.getElementById('createRoomBtn').addEventListener('click', createRoom);
document.getElementById('displayRoomsBtn').addEventListener('click', displayRooms);

displayRooms();