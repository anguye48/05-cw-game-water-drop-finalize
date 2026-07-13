// ===============================
// Water Drop Game
// ===============================

// Game Variables
let gameRunning = false;
let score = 0;
let timeLeft = 50;

let dropMaker;
let timer;

// HTML Elements
const startButton = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");

// Create message area if it exists
const message = document.getElementById("message");

// Start Game Button
startButton.addEventListener("click", startGame);

// Reset Button
const resetButton = document.getElementById("reset-btn");

if(resetButton){
    resetButton.addEventListener("click", resetGame);
}

// ===============================
// START GAME
// ===============================

function startGame(){

    if(gameRunning) return;

    gameRunning = true;

    score = 0;
    timeLeft = 50;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    showMessage("Collect clean water drops! 💧");

    // Create drops every second
    dropMaker = setInterval(createDrop, 1000);

    // Countdown timer
    timer = setInterval(() => {

        timeLeft--;

        timeDisplay.textContent = timeLeft;

        if(timeLeft <= 0){

            endGame();

        }

    },1000);

}

// ===============================
// CREATE WATER DROPS
// ===============================

function createDrop(){

    const drop = document.createElement("div");

    // 25% chance of dirty water
    const isBadDrop = Math.random() < 0.25;

    if (isBadDrop) {

        drop.className = "water-drop bad-drop";
        drop.innerHTML = "🟤";   // Dirty water
    
    } 

    else{

        drop.className = "water-drop";
        drop.innerHTML = "💧";   // Clean water

    }
    if(isBadDrop){

        drop.className = "water-drop bad-drop";

    }
    else{

        drop.className = "water-drop";

    }

    // Random size
    const size = Math.random() * 30 + 40;

    drop.style.width = size + "px";
    drop.style.height = size + "px";

    // Random horizontal position

    const gameWidth = gameContainer.offsetWidth;

    const xPosition = Math.random() * (gameWidth - size);

    drop.style.left = xPosition + "px";

    // Falling speed

    drop.style.animationDuration =
        Math.random() * 2 + 3 + "s";

    gameContainer.appendChild(drop);

    // Click interaction

    drop.addEventListener("click",()=>{

        if(!gameRunning) return;

        if(drop.classList.contains("bad-drop")){

            score -= 5;

            showMessage(
                "Oops! Dirty water! -5 points 💧"
            );

        }
        else{

            score++;

            showMessage(
                "Great catch! +1 clean water 💙"
            );

        }

        updateScore();

        drop.remove();

        checkWin();

    });

    // Remove missed drops

    drop.addEventListener(
        "animationend",
        ()=>{
            drop.remove();
        }
    );

}

// ===============================
// UPDATE SCORE
// ===============================

function updateScore(){

    scoreDisplay.textContent = score;

    // Visual feedback

    scoreDisplay.style.color = "#2E9DF7";

    setTimeout(()=>{

        scoreDisplay.style.color = "#000";

    },300);

}

// ===============================
// GAME OVER
// ===============================

function endGame(){

    gameRunning = false;

    clearInterval(dropMaker);

    clearInterval(timer);

    showMessage(
        `Game Over! Final Score: ${score}`
    );
}

// ===============================
// RESET GAME
// ===============================

function resetGame(){

    clearInterval(dropMaker);

    clearInterval(timer);

    gameRunning = false;

    score = 0;

    timeLeft = 50;

    scoreDisplay.textContent = score;

    timeDisplay.textContent = timeLeft;

    // Remove existing drops

    gameContainer.innerHTML="";

    showMessage(
        "Game reset! Click Start Game."
    );

}

// ===============================
// WIN CELEBRATION
// ===============================

function checkWin(){

    const winningScore = 20;

    if(score >= winningScore){

        showMessage(
            "🎉 Amazing! You helped provide clean water! 💧"
        );

        createConfetti();

    }

}

// Simple celebration effect

function createConfetti(){

    for(let i=0;i<50;i++){

        const confetti =
            document.createElement("div");

        confetti.className="confetti";

        const colors = [
          "#FFC907",
          "#2E9DF7",
          "#8BD1CB",
          "#4FCB53",
          "#FF902A"
        ];

        confetti.style.background =
          colors[Math.floor(Math.random() * colors.length)];

        // Random position

        confetti.style.left =
        Math.random()*100 + "vw";

         // Random falling speed

        confetti.style.animationDuration =
        Math.random()*3 + 2 + "s";

         // Random rotation
        confetti.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

         // Remove after animation

        setTimeout(()=>{

            confetti.remove();

        }, 5000);

    }

}

// ===============================
// MESSAGE DISPLAY
// ===============================

function showMessage(text){

    if(message){

        message.textContent=text;

    }

}