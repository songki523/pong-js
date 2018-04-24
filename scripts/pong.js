let gameRefreshRate;
const canvas        = document.getElementById("game-console");
const context       = canvas.getContext("2d");
const btn           = document.getElementById("pause-game");
const ballSpeed     = document.getElementById("ball-speed");
const computerLevel = document.getElementById("computer-level");


window.onload = function () {
    document.addEventListener("mousemove", function(e){
        player1.y = e.clientY - player1.height / 2;
    });
    gameRefreshRate = setInterval(runGame,1000/30);
}

class Coordinates {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

class Velocity extends Coordinates{
    constructor(){
        super();
        this.velocityX = 4;
        this.velocityY = 4;
    }
}

class MovingObject extends Velocity {
    constructor(width,height){
        super();
        this.width = width;
        this.height = height;
        this.color = "white";
    }
}

class Paddles extends MovingObject {
    constructor(){
        super(10,100);
    }
}

class Pong extends MovingObject {
    constructor(){
        super(6,6);
    }
}

class Player extends Paddles {
    constructor(){
        super();
        this.score = 0;
    }
}

class AI extends Player {
    constructor(){
        super();
        this.speed = 2;
    }
}

let player1     = new Player();
let computer    = new AI();
let ball        = new Pong();
let canvasObj   = {
    x : 0,
    y : 0, 
    width : canvas.width,
    height : canvas.height,
    color : "black"
}

// Update Object Property
player1.y = 40;
computer.x = canvasObj.width - computer.width;
computer.y = canvasObj.height - (computer.height + 40);
ball.x = 50 - ball.width / 2;
ball.y = 50 - ball.width / 2;

//Displays Data
function displayData() {
    ballSpeed.innerHTML = "x: " + ball.velocityX + " y: " + ball.velocityY;
    computer.speed = parseInt(computerLevel.value);
}

//Resets the game
function reset() {
    ball.x = canvasObj.width / 2;
    ball.y = canvasObj.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = 3;
}

//Renders the game
function render(obj) {
    context.fillStyle = obj.color;
    context.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function renderScore(){
    context.fillText(player1.score,100,100);
    context.fillText(computer.score, canvasObj.width - 100, 100);
}

function motionUpdate(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //ball bounces when it hits the floor
    if (ball.y < 0 && ball.velocityY < 0) {
        ball.velocityY =- ball.velocityY;
    }
    //ball bounces when it hits the celing
    if (ball.y > canvasObj.height && ball.velocityY > 0) {
        ball.velocityY =- ball.velocityY;
    }

    if (ball.x < 0) {
        //ball bounce back to the computer
        if (ball.y > player1.y && ball.y < player1.y + player1.height) {
            ball.velocityX =- ball.velocityX;
            dy = ball.y - (player1.y + player1.height / 2);
            ball.velocityY = dy * 0.3;
        } else {
            //Computer scores if ball pass
            computer.score++;
            reset();
        }
    }

    if (ball.x > canvasObj.width) {
        //ball bounce back to the player1
        if (ball.y > computer.y && ball.y < computer.y + computer.height) {
            ball.velocityX =- ball.velocityX;
            dy = ball.y - (computer.y + computer.height / 2);
            ball.velocityY = dy * 0.3;
        } else {
            //player1 scores if ball pass
            player1.score++;
            reset();
        }
    }

    //Setting the computer
    if (computer.y + computer.height / 2 < ball.y) {
        computer.y += computer.speed;
    } else {
        computer.y -= computer.speed;
    }
}

function runGame(){
    displayData();
    motionUpdate();
    render(canvasObj);
    render(player1);
    render(computer);
    render(ball);
    renderScore();
}

function gameStop(){
    clearInterval(gameRefreshRate);    
    btn.value = "Resume Game";
    btn.setAttribute("onclick", "restartGame()");
}

function restartGame() {
    gameRefreshRate = setInterval(runGame, 1000/30);
    btn.value = "Pause Game";
    btn.setAttribute("onclick", "gameStop()");
}