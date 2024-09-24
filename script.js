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
    "Couscous"
];

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
}

function showFloatingMessage() {
    floatingMessage.style.display = "block"; // Affiche le message
}

for(let i = 0 ; i < x ; i++){
    const row = document.createElement("tr");

    for(let j = 0 ; j < x ; j++){
        const cell = document.createElement("td");

        cell.textContent = phrases[0];
        phrases.shift();

        cell.classList.add("border","border-black", "border-4", "text-slate-50", "bg-red-900", "text-2xl");

        cell.addEventListener('click', toggleClass);

        row.appendChild(cell);
    }
    table.appendChild(row);
}