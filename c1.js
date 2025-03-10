const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

// Basket properties
const basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 60,
    width: 80,
    height: 30,
    speed: 20
};

// Apples array
let apples = [];
const appleRadius = 10;
let score = 0;
let timeLeft = 30;
let gameRunning = true;

// Create new apples
function createApple() {
    if (gameRunning) {
        const apple = {
            x: Math.random() * (canvas.width - appleRadius * 2),
            y: 0,
            speed: 1 + Math.random() * 2
        };
        apples.push(apple);
    }
}

// Draw basket
function drawBasket() {

    ctx.fillStyle = "#bb5e1c";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    // Draw handle
    ctx.beginPath();
    ctx.strokeStyle = "#5A2E0F";
    ctx.lineWidth = 5;
    ctx.arc(
        basket.x + basket.width / 2,
        basket.y,
        basket.width / 2,
        Math.PI,
        2 * Math.PI
    );
    ctx.stroke();
}

// Draw apples
function drawApples() {
    ctx.fillStyle = "red";
    apples.forEach((apple) => {
        ctx.beginPath();
        ctx.arc(apple.x, apple.y, appleRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Move basket left/right
function moveBasket(event) {
    if (gameRunning) {
        if (event.key === "ArrowLeft" && basket.x > 0) {
            basket.x -= basket.speed;
        } else if (event.key === "ArrowRight" && basket.x < canvas.width - basket.width) {
            basket.x += basket.speed;
        }
    }
}

// Update apples
function updateApples() {
    for (let i = 0; i < apples.length; i++) {
        apples[i].y += apples[i].speed;

        // Check if apple falls into the basket
        if (
            apples[i].y + appleRadius >= basket.y &&
            apples[i].x > basket.x &&
            apples[i].x < basket.x + basket.width
        ) {
            score++;
            apples.splice(i, 1);
            i--;
        } 
        // Remove apples that fall off the screen
        else if (apples[i].y > canvas.height) {
            apples.splice(i, 1);
            i--;
        }
    }
}

// Draw score
function drawScore() {
    ctx.fillStyle = "#222";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// Draw Timer
function drawTimer() {
    ctx.fillStyle = "#222";
    ctx.font = "20px Arial";
    ctx.fillText("Time: " + timeLeft + "s", canvas.width - 100, 30);
}

// Timer countdown function
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            gameRunning = false;
            clearInterval(timerInterval);
            showGameOver();
        }
    }, 1000);
}

function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Show "Game Over" text
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);

    // Draw Restart Button in Canvas
    ctx.fillStyle = "#045747";
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 20, 100, 40);
    
    // Button Text
    ctx.fillStyle = "#ad9e9e";
    ctx.font = "20px Arial";
    ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 48);
    
    // Enable Click Detection
    canvas.addEventListener("click", checkButtonClick);
}
function checkButtonClick(event) {
    let rect = canvas.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    let clickY = event.clientY - rect.top;

    // Check if click is inside the restart button
    if (
        clickX >= canvas.width / 2 - 50 &&
        clickX <= canvas.width / 2 + 50 &&
        clickY >= canvas.height / 2 + 20 &&
        clickY <= canvas.height / 2 + 60
    ) {
        restartGame();
    }
}
function restartGame() {
    score = 0;
    timeLeft = 30;
    apples = [];
    basket.x = canvas.width / 2 - 40;
    gameRunning = true;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    canvas.removeEventListener("click", checkButtonClick); // Remove old listener
    
    startTimer();
    update();
}

// Restart the game
function restartGame() {
    score = 0;
    timeLeft = 30;
    apples = [];
    basket.x = canvas.width / 2 - 40;
    gameRunning = true;
    restartButton.style.display = "none"; // Hide button
    startTimer();
    update();
}

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBasket();
    drawApples();
    drawScore();
    drawTimer();
    
    if (gameRunning) {
        updateApples();
        requestAnimationFrame(update);
    } else {
        showGameOver();
    }
}

// Apple spawn interval
setInterval(createApple, 1500);

// Start timer & listen for key events
document.addEventListener("keydown", moveBasket);
restartButton.addEventListener("click", restartGame);
startTimer();
update();
