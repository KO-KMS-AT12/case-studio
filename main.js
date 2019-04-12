const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
//brick
const BRICK_TOP = 40;//cach tren
const BRICK_LEFT = 20;//cach trai
const BRICK_WIDTH = 20;//chieu rong
const BRICK_HEIGHT = 10;//chieu cao
const BRICK_MARGIN = 10;//khoang cach giua brick
const BRICK_ROW = 13;//so hang
const BRICK_COLUMN = 21;//so cot
//ball
const CIRCLE_RADIUS = 5;//ban kinh
let circle_x = CANVAS.width / 2;//toa do x
let circle_y = CANVAS.height / 1.2;//toa do y
let move_x = 2;//di chuyen theo chieu ngang
let move_y = -2;//di chuyen theo chieu docc
//bar
const BAR_WIDTH = 100;//chieu rong
const BAR_HEIGHT = 10;//chieu cao
let bar_x = CANVAS.width / 2.5;//toa do x
let bar_y = CANVAS.height / 1.2;//toa do y

let pressRight = false;
let pressLeft = false;

//mang khoi gach
const bricks = buildBrick();
console.log(bricks);

//lang nghe su kien nhan trai phai
document.addEventListener("keydown", keyLeft);
document.addEventListener("keyup", keyRight);

//diem
let point = document.getElementById("point");
let scores = 0;

//luot choi
let life = document.getElementById("life");
let alive = 3;


//lap lai draw();
// let interval = setInterval(draw, 10);

function keyLeft(evt) {
    if (evt.key === "ArrowRight") {
        pressRight = true;
    } else if (evt.key === "ArrowLeft") {
        pressLeft = true;
    }
}

function keyRight(evt) {
    if (evt.key === "ArrowRight") {
        pressRight = false;
    } else if (evt.key === "ArrowLeft") {
        pressLeft = false;
    }
}

function buildBrick() {
    let bricks = [];
    for (let i = 0; i < BRICK_COLUMN; i++) {
        bricks[i] = [];
        for (var j = 0; j < BRICK_ROW; j++) {
            bricks[i][j] = {
                x: 0,
                y: 0,
                status: 1
            };
        }
    }
    return bricks;
}

function collisionDetection() {
    for (let i = 0; i < BRICK_COLUMN; i++) {
        for (let j = 0; j < BRICK_ROW; j++) {
            let brick = bricks[i][j];
            if (brick.status === 1) {
                if (circle_x > brick.x && (circle_x < brick.x + BRICK_WIDTH) &&
                    circle_y > brick.y && (circle_y < brick.y + BRICK_HEIGHT)) {
                    move_y = -move_y;
                    brick.status = 0;
                    scores++;
                    point.innerHTML = "Scores : " + scores;
                    if ((scores) === (BRICK_ROW * BRICK_COLUMN)) {
                        alert("YOU WIN");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBrick() {
    for (let i = 0; i < BRICK_COLUMN; i++) {
        for (let j = 0; j < BRICK_ROW; j++) {
            if (bricks[i][j].status === 1) {
                let brick_x = (i * (BRICK_WIDTH + BRICK_MARGIN)) + BRICK_TOP;
                let brick_y = (j * (BRICK_HEIGHT + BRICK_MARGIN)) + BRICK_LEFT;
                bricks[i][j].x = brick_x;
                bricks[i][j].y = brick_y;

                CONTEXT.beginPath();
                CONTEXT.rect(brick_x, brick_y, BRICK_WIDTH, BRICK_HEIGHT);
                CONTEXT.fillStyle = "blue";
                CONTEXT.fill();
                CONTEXT.closePath();
            }
        }
    }
}

function drawBall() {
    CONTEXT.beginPath();
    CONTEXT.arc(circle_x, circle_y, CIRCLE_RADIUS, 0, Math.PI * 2, false);
    CONTEXT.fillStyle = "green";
    CONTEXT.stroke();
    CONTEXT.fill();
    CONTEXT.closePath();
}

function drawBar() {
    CONTEXT.beginPath();
    CONTEXT.rect(bar_x, bar_y, BAR_WIDTH, BAR_HEIGHT);
    CONTEXT.fillStyle = "blue";
    CONTEXT.fill();
    CONTEXT.closePath()
}

function draw() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

    drawBrick();
    drawBall();
    drawBar();
    collisionDetection();

    //chan ball chi di chuyen trong canvas
    if (circle_x + move_x > CANVAS.width - CIRCLE_RADIUS ||
        circle_x + move_x < CIRCLE_RADIUS) {

        move_x = -move_x;

    } else if (circle_y + move_y < CIRCLE_RADIUS) {
        move_y = -move_y;
    }

    //check ball cham day
    else if (circle_y + move_y > CANVAS.height - CIRCLE_RADIUS) {
        if (circle_y > bar_x && circle_y < bar_x + BAR_WIDTH) {
            move_y = -move_y;
        } else {
            alive--;
            if (alive === 0) {
                alert("GAME OVER");
                document.location.reload();
                // clearInterval(interval);//ngat lap lai
            } else {
                circle_x = CANVAS.width / 2;
                circle_y = CANVAS.height / 1.2;
                move_x = 3;
                move_y = -3;
            }
            life.innerHTML = "Life : " + alive;
        }
    }
    //ball va cham bar
    if (circle_x > bar_x && (circle_x < bar_x + BAR_WIDTH) &&
        circle_y > bar_y && (circle_y < bar_y + BAR_HEIGHT)) {
        move_y = -move_y;
    }
    // di chuyen bar trong canvas
    if (pressRight && bar_x < CANVAS.width - BAR_WIDTH) {
        bar_x += 7;
    } else if (pressLeft && bar_x > 0) {
        bar_x -= 7;
    }

    // di chuyen ball
    circle_x += move_x;
    circle_y += move_y;
    window.requestAnimationFrame(draw);
}

draw();
