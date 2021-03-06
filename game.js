// Definimos el canvas con el que trabajaremos
// y su context
const canvas = document.querySelector('#pong');
const context = canvas.getContext('2d');

const fps = 60;


function game() {
    update();
    render();
}

setInterval(game, 1000 / fps);


function update() {
    // Movement of the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    // Deteccion de colisiones contra las paredes de arriba y abajo con la pelota
    if ((ball.y + ball.radius > canvas.height) || (ball.y - ball.radius < 0)) {
        ball.velocityY = -ball.velocityY;
    }
    // Deteccion de colisiones con los players
    let rec = (ball.x < canvas.width / 2) ? player : ia;
    if (colision(ball, rec)) {
        // Seran numeros entre -50 y 50 que los pasamos entre -1 y 1
        let colisionPoint = (ball.y - (rec.y + rec.height / 2));
        colisionPoint = colisionPoint / (rec.height / 2);
        let angle = colisionPoint * (Math.PI / 4);
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * (ball.speed * Math.cos(angle));
        ball.velocityY = direction * (ball.speed * Math.sin(angle));
        ball.speed += 0.1;
    }


    /*
    * Score update
    * */
    if (ball.x - ball.radius < 0) {
        ia.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }


    moveIA();

}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}


canvas.addEventListener('mousemove', movePaddle);

function movePaddle(evn) {
    let rect = canvas.getBoundingClientRect();
    player.y = (evn.clientY - rect.top) - player.height / 2;
}


function moveIA() {
    let iaLevel = 0.1;
    ia.y += (ball.y - (ia.y + ia.height / 2)) * iaLevel;

}












/*
* Objetos player y IA representados inicialmente
* */
const player = {
    x: 0,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: 'white',
    score: 0
};
const ia = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: 'white',
    score: 0
};

/*
* Objeto red de la partida
* */
const red = {
    x: canvas.width / 2 - 2 / 2,
    y: 0,
    width: 2,
    height: 10,
    color: 'white',
};


const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: 'red',
    speed: 5,
    velocityX: 5,
    velocityY: 5
};


/*
* Functions for our game (phisics)
* */

function colision(ball, player) {
    /*Player stuff*/
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;
    /*Ball stuff*/
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;


    // If everything it's true, this function
    // return true and means there was a colision
    return (ball.right > player.left) && (ball.top < player.bottom) && (ball.left < player.right) && (ball.bottom > player.top);
}









/*Functions for our game (DRAW)*/
/*MAIN FUNCTION*/
function render() {
    // Black background
    drawRectangle(0, 0, 600, 400, "black");
    // Draw scores
    drawText(player.score, canvas.width / 4, canvas.height / 5, 'white');
    drawText(ia.score, 3 * canvas.width / 4, canvas.height / 5, 'white');
    // Draw NET
    drawRed();
    // USER && IA && RED && BOLA
    drawRectangle(player.x, player.y, player.width, player.height, player.color);
    drawRectangle(ia.x, ia.y, ia.width, ia.height, ia.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
function drawRectangle(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "25px fantasy";
    context.fillText(text, x, y)
}
function drawRed() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRectangle(red.x, red.y + i, red.width, red.height, red.color);
    }
}
