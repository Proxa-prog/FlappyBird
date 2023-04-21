const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const bg = new Image();
const tubeTop = new Image();
const tubeBottom = new Image();
const bird = new Image();
const field = new Image();
const showScore = new Image();
const deathMenu = new Image();
const silverMedal = new Image();
const goldMedal = new Image();
const buttonPlay = new Image();

bg.src = 'image/background.png';
bird.src = 'image/birdStraight.png';
tubeTop.src = 'image/tubeTop.png';
tubeBottom.src = 'image/tubeBottom.png';
field.src = 'image/field.png';
showScore.src = 'image/numbers/0.png';
deathMenu.src = 'image/gameStatistic.png';
silverMedal.src = 'image/silverMedal.png';
goldMedal.src = 'image/goldMedal.png';
buttonPlay.src = 'image/buttonPlay.png';

const GAP = 50;
let GRAV = 1;
const POSX = 10;
let posY = 100;
let score = {
    current: 0,
    best: 0,
};

let tubes = [{
    x: 100,
    y: -60,
}];

let isGameOver = false;

class drawFrame {
    constructor() { }

    draw() {
        ctx.drawImage(bg, 0, 0, 147, 260);
        ctx.drawImage(bird, POSX, posY);
        if (tubes[tubes.length - 1].x === 20) {
            tubes.push({
                x: 100,
                y: Math.floor(Math.random() * (tubeTop.height)) - tubeTop.height,
            });
        }

        for (let i = 0; i < tubes.length; i++) {
            ctx.drawImage(tubeTop, tubes[i].x, tubes[i].y);
            ctx.drawImage(tubeBottom, tubes[i].x, tubeTop.height + tubes[i].y + GAP);
            tubes[i].x--;
        }

        ctx.drawImage(field, 0, canvas.height - field.height);

        posY += GRAV;
        GRAV += 0.05;

        if (posY === canvas.height - field.height) {
            first.restart();
        }

        // Отрисовка счёта
        ctx.drawImage(showScore, 120, 20);


        // Столкновение
        for (let i = 0; i < tubes.length; i++) {
            if (POSX + bird.width >= tubes[i].x
                && POSX <= tubes[i].x + tubeTop.width
                && (posY <= tubes[i].y + tubeTop.height
                    || posY + bird.height >= tubes[i].y + tubeTop.height + GAP)
            ) {
                ctx.drawImage(deathMenu, 10, 100);
                ctx.drawImage(buttonPlay, 65, 120);

                const bestScore = localStorage.getItem('bestScore');

                if (bestScore == null
                    || score.current > bestScore
                ) {
                    ctx.drawImage(goldMedal, 26, 120);
                } else {
                    ctx.drawImage(silverMedal, 26, 120);
                }

                if (score.current > score.best) {
                    localStorage.setItem('bestScore', score.current);
                }

                isGameOver = true;
                first.restart();
            }
        }


        // score
        for (let i = 0; i < tubes.length; i++) {
            if (POSX === tubes[i].x + tubeTop.width) {
                score.current++;
                showScore.src = `image/numbers/${score.current}.png`;
            }
        }

        if (!isGameOver) {
            requestAnimationFrame(first.draw);
        }
    }

    reset(event) {
        if (event.pageX >= 75
            && event.pageX <= 85
            && event.pageY >= 125
            && event.pageY <= 140) {
            tubes = [{
                x: 100,
                y: -60,
            }];
            posY = 100;
            score.current = 0;
            showScore.src = 'image/numbers/0.png';
            isGameOver = false;
            requestAnimationFrame(first.draw);
            canvas.removeEventListener('click', first.reset);
        }
    }

    restart() {
        if (isGameOver) {
            canvas.addEventListener('click', first.reset);
        }
    }
}

class Bird {
    constructor() { }

    jump() {
        document.addEventListener('click', () => {
            bird.src = 'image/birdUp.png';
            posY -= 20;
            GRAV = 1;

            setTimeout(() => {
                bird.src = 'image/birdDown.png';
            }, 100);
        });
    }
}

let first = new drawFrame();
let birdPlayer = new Bird();
field.onload = first.draw;
birdPlayer.jump();
