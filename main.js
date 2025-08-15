let playArea = document.getElementById('play-area');
let catcher = document.getElementById('catcher');
let scoreElem = document.getElementById('score');
let highestScoreElem = document.querySelector('.score');

let highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
highestScoreElem.textContent = highestScore;
let score = 0;

let baseDuration = 2;
let minDuration = 0.5;
let pointsPerStep = 10;
let durationDecrease = 0.5;

let objects = [];

function getCurrentAnimationTime() {
    let steps = Math.floor(score / pointsPerStep);
    return Math.max(minDuration, baseDuration - steps * durationDecrease);
}

function newObject() {
    let obj = document.createElement("div");
    obj.classList.add("obj");
    let animTime = getCurrentAnimationTime();
    obj.style.animation = `objMove ${animTime}s linear forwards`;
    obj.style.width = "50px";
    let maxLeft = playArea.offsetWidth - 50;
    let left = Math.floor(Math.random() * (maxLeft + 1));
    obj.style.left = left + "px";
    playArea.appendChild(obj);
    objects.push(obj);
}

let outerIntervalId = setInterval(newObject, 1000);

let intervalId = setInterval(() => {
    let catcherRect = catcher.getBoundingClientRect();

    objects.forEach((obj, index) => {
        let objRect = obj.getBoundingClientRect();

        if (
            objRect.bottom >= catcherRect.top &&
            objRect.top <= catcherRect.bottom &&
            objRect.right >= catcherRect.left &&
            objRect.left <= catcherRect.right
        ) {
            obj.remove();
            objects.splice(index, 1);
            score++;
            scoreElem.textContent = score;
            if (score > highestScore) {
                highestScore = score;
                highestScoreElem.textContent = highestScore;
                localStorage.setItem('highestScore', highestScore);
            }
        } else if (objRect.top > catcherRect.bottom) {
            document.getElementById("game-over").style.display = "block";
            if (window.innerWidth < 992) {
                document.getElementById("restart-btn").style.display = "inline-block";
            }
            clearInterval(intervalId);
            clearInterval(outerIntervalId);
            document.removeEventListener("keydown", moveCatcher);
            localStorage.setItem('highestScore', highestScore);
        }
    });
}, 10);

let catcherLeft = Math.floor((playArea.offsetWidth - catcher.offsetWidth) / 2);
catcher.style.left = catcherLeft + "px";

const moveStep = 40;

playArea.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        const touchX = e.touches[0].clientX - playArea.getBoundingClientRect().left;
        if (touchX < playArea.offsetWidth / 2) {
            catcherLeft = Math.max(0, catcherLeft - moveStep);
        } else {
            catcherLeft = Math.min(playArea.offsetWidth - catcher.offsetWidth, catcherLeft + moveStep);
        }
        catcher.style.left = catcherLeft + "px";
    }
});

let dragStartX = null;
playArea.addEventListener('touchstart', function(e) {
    dragStartX = e.touches[0].clientX;
});
playArea.addEventListener('touchmove', function(e) {
    if (dragStartX !== null) {
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - dragStartX;
        catcherLeft = catcherLeft + deltaX;
        catcherLeft = Math.max(0, Math.min(catcherLeft, playArea.offsetWidth - catcher.offsetWidth));
        catcher.style.left = catcherLeft + "px";
        dragStartX = currentX;
    }
});
playArea.addEventListener('touchend', function() {
    dragStartX = null;
});

function moveCatcher(e) {
    if (e.key === "ArrowLeft") {
        catcherLeft -= moveStep;
    } else if (e.key === "ArrowRight") {
        catcherLeft += moveStep;
    }
    catcherLeft = Math.max(0, Math.min(catcherLeft, playArea.offsetWidth - catcher.offsetWidth));
    catcher.style.left = catcherLeft + "px";
}

document.addEventListener("keydown", moveCatcher);

function restartGame() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
    document.querySelectorAll('.obj').forEach(o => o.remove());
    objects = [];
    catcherLeft = Math.floor((playArea.offsetWidth - catcher.offsetWidth) / 2);
    catcher.style.left = catcherLeft + "px";
    score = 0;
    scoreElem.textContent = score;
    document.addEventListener("keydown", moveCatcher);
    clearInterval(intervalId);
    clearInterval(outerIntervalId);
    outerIntervalId = setInterval(newObject, 2000);
    intervalId = setInterval(() => {
        let catcherRect = catcher.getBoundingClientRect();
        objects.forEach((obj, index) => {
            let objRect = obj.getBoundingClientRect();
            if (
                objRect.bottom >= catcherRect.top &&
                objRect.top <= catcherRect.bottom &&
                objRect.right >= catcherRect.left &&
                objRect.left <= catcherRect.right
            ) {
                obj.remove();
                objects.splice(index, 1);
                score++;
                scoreElem.textContent = score;
                if (score > highestScore) {
                    highestScore = score;
                    highestScoreElem.textContent = highestScore;
                    localStorage.setItem('highestScore', highestScore);
                }
            } else if (objRect.top > catcherRect.bottom) {
                document.getElementById("game-over").style.display = "block";
                if (window.innerWidth < 992) {
                    document.getElementById("restart-btn").style.display = "inline-block";
                }
                clearInterval(intervalId);
                clearInterval(outerIntervalId);
                document.removeEventListener("keydown", moveCatcher);
                localStorage.setItem('highestScore', highestScore);
            }
        });
    }, 10);
}

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        restartGame();
    }
});

document.getElementById("restart-btn").addEventListener("click", restartGame);
