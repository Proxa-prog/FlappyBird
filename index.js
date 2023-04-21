const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const bg = new Image();
const tubeTop = new Image();
const tubeBottom = new Image();
const bird = new Image();
const field = new Image();
const showScore = new Image();
const currentScoreImage = new Image();
const bestScoreImage = new Image();
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
let grav = 1;
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
        if (tubes[tubes.length - 1].x === 10) {
            tubes.push({
                x: 147,
                y: Math.floor(Math.random() * (tubeTop.height)) - tubeTop.height,
            });
        }

        for (let i = 0; i < tubes.length; i++) {
            ctx.drawImage(tubeTop, tubes[i].x, tubes[i].y);
            ctx.drawImage(tubeBottom, tubes[i].x, tubeTop.height + tubes[i].y + GAP);
            tubes[i].x--;
        }

        ctx.drawImage(field, 0, canvas.height - field.height);

        posY += grav;
        grav += 0.03;

        // Отрисовка счёта
        ctx.drawImage(showScore, 120, 20);

        const bestScore = localStorage.getItem('bestScore') ? localStorage.getItem('bestScore') : 0;
        currentScoreImage.src = `image/numbers/mini/${score.current}mini.png`;
        bestScoreImage.src = `image/numbers/mini/${bestScore}mini.png`;

        // Столкновение
        for (let i = 0; i < tubes.length; i++) {
            if (
                posY >= canvas.height - field.height
                || POSX + bird.width >= tubes[i].x
                && POSX <= tubes[i].x + tubeTop.width
                && (posY <= tubes[i].y + tubeTop.height
                    || posY + bird.height >= tubes[i].y + tubeTop.height + GAP
                    || posY === canvas.height - field.height
                )
            ) {
                ctx.drawImage(deathMenu, 10, 100);
                ctx.drawImage(buttonPlay, 65, 120);
                ctx.drawImage(bestScoreImage, 105, 140);
                ctx.drawImage(currentScoreImage, 105, 118);

                if (score.current > bestScore) {
                    ctx.drawImage(goldMedal, 26, 120);
                    localStorage.setItem('bestScore', score.current);
                } else {
                    ctx.drawImage(silverMedal, 26, 120);
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
        if (
            event.pageX >= 75
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
            grav = 1;

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
