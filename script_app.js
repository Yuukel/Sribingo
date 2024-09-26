import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

console.log("Fichier app.js chargé et exécuté");

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
    updatePlayerScore();
}

// Fonction pour mettre à jour le score d'un joueur
function updatePlayerScore() {
    const roomId = document.getElementById('waitingRoom').firstChild.id;
    const scoreList = document.getElementById('scoreList');

    scoreList.innerHTML = "";

    const playersRef = ref(database, `rooms/${roomId}/players`);
    
    // Écoute en temps réel les changements dans la liste des joueurs
    onValue(playersRef, (snapshot) => {
        const players = snapshot.val();
        scoreList.innerHTML = '';  // Vide la liste avant de la remplir

        if (players) {
            // Parcours des joueurs récupérés
            Object.keys(players).forEach((playerKey) => {
                const player = players[playerKey];
                const li = document.createElement('div');
                li.innerText = `${playerKey} : ${player.score}`;
                scoreList.appendChild(li);  // Ajoute chaque joueur à la liste
            });
        } else {
            // Si aucun joueur n'est trouvé
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
                const li = document.createElement('div');
                const btn = document.createElement('button');
                btn.innerText = `Rejoindre la room`;
                btn.addEventListener('click', joinRoom);
                btn.id = roomId;
                li.innerText = `Room ID: ${roomId}`;
                li.appendChild(btn);
                roomsList.appendChild(li);
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
    const roomId = document.getElementById("waitingRoom").firstChild.id;
    var started = ref(database, `rooms/${roomId}/started`);

    onValue(started, (snapshot) => {
        const isStarted = snapshot.val();
        console.log(isStarted);

        if(isStarted){
            const game = document.getElementById("game");
            const waitingRoom = document.getElementById("waitingRoom");
        
            waitingRoom.classList.add("hidden");
            game.classList.remove("hidden");

            updatePlayerScore()
        }
    });
}

document.getElementById('createRoomBtn').addEventListener('click', createRoom);
document.getElementById('displayRoomsBtn').addEventListener('click', displayRooms);