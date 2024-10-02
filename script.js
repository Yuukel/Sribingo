import { sendScore, displayChat } from './script_app.js';

const phrases = [
    "Bravo",
    "Ah oui",
    "Timé",
    "Quitter _____, quitter l'autoroute",
    "Un seul élève, major de la promotion",
    "Personne ne va porter plainte contre moi ?",
    "Ca va ?",
    "Notez ça",
    "Messieurs dames",
    "Il raconte une blague",
    "Il raconte une énigme",
    "Il fait son bruit bizarre avec son nez",
    "Il parle du détecteur de CO2",
    "Step by step",
    "Petit / Costaud",
    "Café",
    "epsilon",
    "Fou rire avec Sriraman",
    "_____ vaut mieux qu'un long discours",
    "Génie",
    "Candidat",
    "Couscous",
    "Copier / Coller",
    "Ne pas déranger",
    "Papa",
    "Joli",
    "Il demande de ne pas écrire",
    "Il raconte une anecdote",
    "Hakuna Matata"
];

var solo = false;
document.getElementById("solo").addEventListener('click', () => {
    const lobby = document.getElementById("lobby");
    const game = document.getElementById("game");

    lobby.classList.add("hidden");
    game.classList.remove("hidden");

    solo = true;
})

var x = 3;
var score = 0;

const table = document.getElementById('bingo');
const scoreText = document.getElementById('score');
const floatingMessage = document.getElementById("floatingMessage");

for (let i = phrases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = phrases[i];
    phrases[i] = phrases[j];
    phrases[j] = temp;
}

function toggleClass(event) {
    const cell = event.target;
    if (cell.classList.contains('bg-red-900')) {
        cell.classList.remove('bg-red-900');
        cell.classList.add('bg-green-600');
        score++;
    } else {
        cell.classList.remove('bg-green-600');
        cell.classList.add('bg-red-900');
        score--;
    }
    scoreText.textContent = "Score : " + score;
    if(score === x*x){
        scoreText.textContent = "BINGO, AH OUIIIIIIIIIIII";
        showFloatingMessage();
    }
    if(!solo) sendScore(score);
}

function showFloatingMessage() {
    floatingMessage.style.display = "block";
}

for(let i = 0 ; i < x ; i++){
    const row = document.createElement("tr");

    for(let j = 0 ; j < x ; j++){
        const cell = document.createElement("td");

        cell.textContent = phrases[0];
        phrases.shift();

        cell.classList.add(
            "border",
            "border-gray-300",
            "bg-red-900",
            "text-white",
            "font-bold",
            "shadow-lg",
            "rounded-md",
            "p-2",
            "transition-all",
            "duration-300",
            "text-center",
            "w-24",
            "h-24",
            "lg:w-28",
            "lg:h-28",
            "text-base",
            "lg:text-xl",
            "overflow-hidden",
            "break-words"
        );

        cell.addEventListener('click', toggleClass);

        row.appendChild(cell);
    }
    table.appendChild(row);
}

const toggleChatBtn = document.getElementById('toggleChatBtn');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatbox = document.getElementById('chatbox');
const chatMessages = document.getElementById('chatMessages');
export function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

toggleChatBtn.addEventListener('click', () => {
    chatbox.classList.toggle('hidden');
    scrollToBottom();
    displayChat();
});

closeChatBtn.addEventListener('click', () => {
    chatbox.classList.add('hidden');
});

const toggleAdminBtn = document.getElementById('toggleAdminBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const adminbox = document.getElementById('adminbox');

toggleAdminBtn.addEventListener('click', () => {
    adminbox.classList.remove('hidden');
});

closeAdminBtn.addEventListener('click', () => {
    adminbox.classList.add('hidden');
});