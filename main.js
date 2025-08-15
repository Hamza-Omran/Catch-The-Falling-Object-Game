let playArea = document.getElementById('play-area');
let catcher = document.getElementById('catcher');
let scoreElem = document.getElementById('score');
let highestScoreElem = document.querySelector('.score');

let highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
highestScoreElem.textContent = highestScore;
let score = 0;

leftBoundary = playArea.getBoundingClientRect().left;

let outerIntervalId = setInterval(() => {
    newObject();
}, 2000);


let obj;
let fallSpeed = 2; // initial speed (pixels per tick)
const maxFallSpeed = 15; // maximum speed
const speedIncreaseStep = 0.3; // how much speed increases per catch

function newObject(){
    obj = document.createElement("div");
    obj.classList.add("obj");

    obj.style.width = "50px";
    let maxLeft = playArea.offsetWidth - 50;
    let left = Math.floor(Math.random() * (maxLeft + 1));
    obj.style.left = left + "px";
    obj.style.top = '0px'; // start at top
    playArea.appendChild(obj);
}

let intervalId = setInterval(() => {
    if (!obj) return;
    // Move object down by fallSpeed pixels
    let currentTop = parseFloat(obj.style.top || '0');
    obj.style.top = (currentTop + fallSpeed) + 'px';

    let objRect = obj.getBoundingClientRect();
    let catcherRect = catcher.getBoundingClientRect();
    if (
        objRect.bottom >= catcherRect.top &&
        objRect.top <= catcherRect.bottom &&
        objRect.right >= catcherRect.left &&
        objRect.left <= catcherRect.right
    ) {
        obj.classList.add("hide");
        score++;
        scoreElem.textContent = score;
        // Increase speed, but cap at maxFallSpeed
        fallSpeed = Math.min(maxFallSpeed, fallSpeed + speedIncreaseStep);
        if (score > highestScore) {
            highestScore = score;
            highestScoreElem.textContent = highestScore;
            localStorage.setItem('highestScore', highestScore);
        }
    }
    else if (obj.getBoundingClientRect().top > catcher.getBoundingClientRect().bottom){
        document.getElementById("game-over").style.display="block";
        clearInterval(intervalId);
        clearInterval(outerIntervalId);
        document.removeEventListener("keydown", moveCatcher);
        localStorage.setItem('highestScore', highestScore);
    }
}, 10);

let catcherLeft = Math.floor((playArea.offsetWidth - catcher.offsetWidth) / 2);
catcher.style.left = catcherLeft + "px";

const moveStep = 40;

// Touch support for mobile
playArea.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        const touchX = e.touches[0].clientX - playArea.getBoundingClientRect().left;
        if (touchX < playArea.offsetWidth / 2) {
            // Move left
            catcherLeft = Math.max(0, catcherLeft - moveStep);
        } else {
            // Move right
            catcherLeft = Math.min(playArea.offsetWidth - catcher.offsetWidth, catcherLeft + moveStep);
        }
        catcher.style.left = catcherLeft + "px";
    }
});

// Drag/swipe support for mobile
let dragStartX = null;
playArea.addEventListener('touchstart', function(e) {
    dragStartX = e.touches[0].clientX;
});
playArea.addEventListener('touchmove', function(e) {
    if (dragStartX !== null) {
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - dragStartX;
        catcherLeft = Math.min(Math.max(0, catcherLeft + deltaX), playArea.offsetWidth - catcher.offsetWidth);
        catcher.style.left = catcherLeft + "px";
        dragStartX = currentX;
    }
});
playArea.addEventListener('touchend', function(e) {
    dragStartX = null;
});


function moveCatcher(e){
    if (e.key === "ArrowLeft" && catcherLeft !== 0) {
        catcherLeft -= moveStep;
    } else if (e.key === "ArrowRight" && catcherLeft < playArea.offsetWidth - catcher.offsetWidth) {
        catcherLeft += moveStep;
    }

    catcher.style.left = catcherLeft + "px";
}

document.addEventListener("keydown", moveCatcher);

document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        document.getElementById("game-over").style.display = "none";

        document.querySelectorAll('.obj').forEach(function(o) {
            o.remove();
        });

        catcherLeft = Math.floor((playArea.offsetWidth - catcher.offsetWidth) / 2);
        catcher.style.left = catcherLeft + "px";

        score = 0;
        scoreElem.textContent = score;
        fallSpeed = 2; // reset speed

        document.addEventListener("keydown", moveCatcher);

        clearInterval(intervalId);
        clearInterval(outerIntervalId);
        outerIntervalId = setInterval(() => {
            newObject();
        }, 2000);
        intervalId = setInterval(() => {
            if (!obj) return;
            // Move object down by fallSpeed pixels
            let currentTop = parseFloat(obj.style.top || '0');
            obj.style.top = (currentTop + fallSpeed) + 'px';

            let objRect = obj.getBoundingClientRect();
            let catcherRect = catcher.getBoundingClientRect();
            if (
                objRect.bottom >= catcherRect.top &&
                objRect.top <= catcherRect.bottom &&
                objRect.right >= catcherRect.left &&
                objRect.left <= catcherRect.right
            ) {
                obj.classList.add("hide");
                score++;
                scoreElem.textContent = score;
                // Increase speed, but cap at maxFallSpeed
                fallSpeed = Math.min(maxFallSpeed, fallSpeed + speedIncreaseStep);
                if (score > highestScore) {
                    highestScore = score;
                    highestScoreElem.textContent = highestScore;
                    localStorage.setItem('highestScore', highestScore);
                }
            }
            else if (obj.getBoundingClientRect().top > catcher.getBoundingClientRect().bottom){
                document.getElementById("game-over").style.display="block";
                clearInterval(intervalId);
                clearInterval(outerIntervalId);
                document.removeEventListener("keydown", moveCatcher);
                localStorage.setItem('highestScore', highestScore);
            }
        }, 10);
    }
});