// ============================================
// Water Drop Challenge
// Inspired by charity: water
// ============================================

// ===============================
// Game Variables
// ===============================

let gameRunning = false;
let score = 0;
let timeLeft = 30;
let winningScore = 20;
let dropInterval = 1000;
let dropMaker;
let timer;

// ===============================
// HTML Elements
// ===============================

const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const message = document.getElementById("message");
const gameContainer = document.getElementById("game-container");
const difficultySelect =
document.getElementById("difficulty");
const progress =
document.getElementById("progress");

// ===============================
// Milestones
// ===============================

const milestones = [
    {
        score:5,
        message:"🌱 Great Start! Every drop counts!"
    },

    {
        score:10,
        message:"💧 Halfway There!"
    },

    {
        score:15,
        message:"🚰 You're making a difference!"
    }

];

// Prevent milestone messages from repeating
let reachedMilestones = [];

// ===============================
// Button Events
// ===============================

startButton.addEventListener(
    "click",
    startGame
);

resetButton.addEventListener(
    "click",
    resetGame
);

// ===============================
// Start Game
// ===============================

function startGame(){

    if(gameRunning) return;
    // Start Sound
    startSound.currentTime = 0;
    startSound.play();

    // Background music
    gameplayMusic.currentTime = 0;
    gameplayMusic.play();

    gameRunning = true;
    startButton.disabled = true;
    score = 0;
    reachedMilestones = [];

    // --------------------------
    // Difficulty
    // --------------------------

    const difficulty =
    difficultySelect.value;
    // Easy Difficulty
    if(difficulty === "easy"){
        timeLeft = 50;
        winningScore = 15;
        dropInterval = 1200;

    }
    // Normal Difficulty
    else if(difficulty === "normal"){
        timeLeft = 40;
        winningScore = 20;
        dropInterval = 1000;
    }
    // Hard Difficulty
    else{
        timeLeft = 30;
        winningScore = 25;
        dropInterval = 700;

    }

    // --------------------------
    // Reset UI
    // --------------------------

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    progress.value = 0;
    gameContainer.innerHTML = "";
    showMessage(
        "💧 Collect clean water and avoid dirty water!"
    );

    // --------------------------
    // Start creating drops
    // --------------------------

    dropMaker =
    setInterval(
        createDrop,
        dropInterval
    );

    // --------------------------
    // Countdown Timer
    // --------------------------

    timer = setInterval(()=>{

        timeLeft--;
        timeDisplay.textContent =
        timeLeft;
        if(timeLeft <= 0){
            endGame();
        }
    },1000);
}

// ===============================
// Reset Game
// ===============================

function resetGame(){
    clearInterval(dropMaker);
    clearInterval(timer);
    gameplayMusic.pause();
    gameplayMusic.currentTime = 0;
    gameRunning = false;
    startButton.disabled = false;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    progress.value = 0;
    gameContainer.innerHTML = "";
    reachedMilestones = [];
    showMessage(
        "Game reset! Click Start Game."
    );
}

// ============================================
// Create Water Drops
// ============================================

function createDrop(){
    const drop =
    document.createElement("div");

    // 25% chance of dirty water

    const isBadDrop =
    Math.random() < 0.25;
    if(isBadDrop){
        drop.className =
        "water-drop bad-drop";
        drop.innerHTML =
        "🟤";
    }
    else{
        drop.className =
        "water-drop";
        drop.innerHTML =
        "💧";
    }

    // --------------------------
    // Random Size
    // --------------------------

    const size =
    Math.random() * 25 + 45;
    drop.style.width =
    size + "px";
    drop.style.height =
    size + "px";
    drop.style.fontSize =
    size * 0.8 + "px";

    // --------------------------
    // Random Position
    // --------------------------

    const gameWidth = gameContainer.offsetWidth;
    const xPosition = Math.random() * (gameWidth - size);
    drop.style.left = xPosition + "px";

    // --------------------------
    // Falling Speed
    // --------------------------

    drop.style.animationDuration =
    Math.random() * 2 + 3 + "s";

    // Add drop to game
    gameContainer.appendChild(drop);

    // ==========================
    // Player Click Interaction
    // ==========================

    drop.addEventListener(
        "click",
        ()=>{
        if(!gameRunning) return;
        if(drop.classList.contains("bad-drop")){
            score -= 5;
            errorSound.currentTime = 0;
            errorSound.play();
            showMessage(
                "⚠️ Dirty water! -5 points"
            );
        }
        else{
            score++;
            splashSound.currentTime = 0;
            splashSound.play();
            showMessage(
                "💧 Great catch! +1 clean water"
            );
        }
        updateScore();
        drop.remove();
        checkWin();
    });

    // ==========================
    // Remove Missed Drops
    // ==========================

    drop.addEventListener(
        "animationend",
        ()=>{
            drop.remove();
        }
    );
}

// ============================================
// Update Score
// ============================================

function updateScore(){
    scoreDisplay.textContent = score;

    // --------------------------
    // Progress Bar
    // --------------------------

    let percentage =
    (score / winningScore) * 100;
    if(percentage < 0){
        percentage = 0;
    }
    progress.value = Math.min(
        percentage,
        100
    );

    // --------------------------
    // Score Animation
    // --------------------------

    scoreDisplay.style.color =
    "#2E9DF7";
    setTimeout(()=>{
        scoreDisplay.style.color =
        "#000";
    },300);

    // --------------------------
    // Milestones
    // --------------------------

    milestones.forEach(
        milestone=>{
        if(
            score >= milestone.score &&
            !reachedMilestones.includes(
                milestone.score
            )
        ){
            showMessage(
                milestone.message
            );
            reachedMilestones.push(
                milestone.score
            );
        }
    });
}

// ============================================
// Check Win Condition
// ============================================

function checkWin(){
    if(score >= winningScore){
        gameRunning = false;
        clearInterval(dropMaker);
        clearInterval(timer);
        gameplayMusic.pause();
        gameplayMusic.currentTime = 0;
        startButton.disabled = false;
        showMessage(
            "🎉 Mission Complete! You helped bring clean water to communities! 💧"
        );
        createConfetti();
        winSound.currentTime = 0;
        winSound.play();
    }
}

// ============================================
// Game Over
// ============================================

function endGame(){
    gameRunning = false;
    clearInterval(dropMaker);
    clearInterval(timer);
    // Stop background music
    gameplayMusic.pause();
    gameplayMusic.currentTime = 0;
    startButton.disabled = false;
    // Play Game Over sound
    if(score >= winningScore){
      showMessage(
            `🎉 Time's Up! You reached the goal with ${score} points!`
        );
      createConfetti();
      winSound.currentTime = 0;
      winSound.play();
      gameOverSound.currentTime = 0;
      gameContainer.play();
    }else{
      gameOverSound.currentTime = 0;
      gameOverSound.play();
      showMessage(
          `⏰ Time's Up! You collected ${score} clean water drops! 💧`
      );
    }
}

// ============================================
// Confetti Celebration
// ============================================
function createConfetti(){
    const colors = [
        "#FFC907",
        "#2E9DF7",
        "#8BD1CB",
        "#4FCB53",
        "#FF902A"
    ];

    for(let i = 0; i < 50; i++){
        const confetti =
        document.createElement("div");
        confetti.className =
        "confetti";
        confetti.style.background =
        colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];

        confetti.style.left =
        Math.random() * 100 + "vw";
        confetti.style.animationDuration =
        Math.random() * 3 + 2 + "s";
        confetti.style.width =
        Math.random() * 10 + 8 + "px";
        confetti.style.height =
        confetti.style.width;
        document.body.appendChild(
            confetti
        );
        setTimeout(()=>{
            confetti.remove();
        },5000);
    }
}

// ============================================
// Message Display
// ============================================

function showMessage(text){
    if(message){
        message.textContent =
        text;
    }
}

// ============================================
// Audio System
// ============================================

// Start Game Sound

const startSound =
new Audio(
    "sound/freesound_community-game-start-6104.mp3"
);

// Gameplay Background Music

const gameplayMusic =
new Audio(
    "sound/xtremefreddy-game-music-loop-7-145285.mp3"
);

// Loop gameplay music

gameplayMusic.loop = true;

// Default music volume

gameplayMusic.volume = 0.3;

// Collect Water Sound

const splashSound = new Audio(
    "sound/freesound_community-water-drip-45622.mp3"
);

// Dirty Water Sound

const errorSound =
new Audio(
    "sound/alexis_gaming_cam-alerte-346112.mp3"
);

// Win Sound

const winSound =
new Audio(
    "sound/puyopuyomegafan1234-winner-game-sound-404167.mp3"
);

// Win Sound

const gameOverSound =
new Audio(
    "sound/alphix-game-over-417465.mp3"
);

// ============================================
// Volume Control
// ============================================

const volumeControl =
document.getElementById("volume");
if(volumeControl){
    volumeControl.addEventListener(
        "input",
        ()=>{
            gameplayMusic.volume =
            volumeControl.value;
        }
    );
}