document.addEventListener("DOMContentLoaded", () => {
    const cardValues = [
        'fotos/1.png', 'fotos/1.png',
        'fotos/2.png', 'fotos/2.png',
        'fotos/3.png', 'fotos/3.png',
        'fotos/4.png', 'fotos/4.png',
        'fotos/5.png', 'fotos/5.png',
        'fotos/6.png', 'fotos/6.png',
        'fotos/7.png', 'fotos/7.png',
        'fotos/8.png', 'fotos/8.png'
    ];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedCards = 0;
    let attempts = 0;

    const gameContainer = document.getElementById("gameContainer");
    const startButton = document.getElementById("glowButton-start");
    const menu = document.getElementById("menu");
    const endScreen = document.getElementById("endScreen");
    const attemptsCountDisplay = document.getElementById("attemptsCount");
    const timerDisplay = document.getElementById("timer");
    const timeLeftDisplay = document.getElementById("timeLeft");

    let timeLeft = 45;
    let timerInterval;

    function startGame() {
        menu.style.display = "none";
        endScreen.style.display = "none";
        gameContainer.innerHTML = ""; 
        matchedCards = 0;
        attempts = 0;
        attemptsCountDisplay.textContent = attempts;

        timerDisplay.style.display = "block";
        startTimer();

        const shuffledCards = shuffleCards(cardValues);
        createCards(shuffledCards);
        gameContainer.style.display = "grid";
    }

    function shuffleCards(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createCards(cardValues) {
        cardValues.forEach(value => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.value = value;

            const back = document.createElement("div");
            back.classList.add("back");
            back.style.backgroundImage = "url('fotos/achterkantkaarten.png')";
            back.style.backgroundSize = "cover";
            card.appendChild(back);
            

            const img = document.createElement("img");
            img.src = value;
            img.alt = "Memory kaart";
            card.appendChild(img);

            card.addEventListener("click", flipCard);
            gameContainer.appendChild(card);


        });

        
    }


    function flipCard() {
        if (lockBoard || this.classList.contains("flipped")) return;

        this.classList.add("flipped");
        this.querySelector("img").style.display = "block";

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        attempts++;
        attemptsCountDisplay.textContent = attempts;

        checkForMatch();
    }

    function checkForMatch() {
        if (firstCard.dataset.value === secondCard.dataset.value) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            matchedCards += 2;

            if (matchedCards === cardValues.length) {
                endGame(true);
            }

            resetBoard();
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                firstCard.querySelector("img").style.display = "none";
                secondCard.querySelector("img").style.display = "none";
                resetBoard();
            }, 1000);
        }
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function endGame(win) {
        clearInterval(timerInterval);
        timerDisplay.style.display = "none";
        gameContainer.style.display = "none";

        if (win) {
            endScreen.innerHTML = `<h2>Gefeliciteerd! Je hebt op tijd alle vriendjes gevonden!</h2>
        <button id='restartButton' class='glow-button'>Opnieuw Spelen</button>`;
        } else {
            endScreen.innerHTML = `<h2>Helaas, de tijd is op!</h2>
         <button id='restartButton' class='glow-button'>Opnieuw Proberen</button>`;
        }

        endScreen.style.display = "block";

        document.getElementById("restartButton").addEventListener("click", startGame);
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 45;
        timeLeftDisplay.textContent = timeLeft;

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeLeftDisplay.textContent = timeLeft;
                changeBackgroundColor(timeLeft);
            } else {
                clearInterval(timerInterval);
                endGame(false); 
            }
        }, 1000);
    }

    let lastTimeLeft = 45;

function changeBackgroundColor(timeLeft) {
    const startColor = { r: 59, g: 53, b: 85 };
    const endColor = { r: 135, g: 206, b: 235 };

    function interpolateColor(start, end, factor) {
        return Math.floor(start + (end - start) * factor);
    }

    function animate() {
        lastTimeLeft += (timeLeft - lastTimeLeft) * 0.1; // Soepele overgang
        const percentage = lastTimeLeft / 45;

        const r = interpolateColor(startColor.r, endColor.r, 1 - percentage);
        const g = interpolateColor(startColor.g, endColor.g, 1 - percentage);
        const b = interpolateColor(startColor.b, endColor.b, 1 - percentage);

        document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        if (Math.abs(lastTimeLeft - timeLeft) > 0.1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}


    // Zorgt ervoor dat het spook altijd de muis volgt
    document.addEventListener("mousemove", (event) => {
        const spook = document.querySelector(".spook");
        if (spook) {
            const offsetX = -spook.clientWidth / 2;
            const offsetY = -spook.clientHeight / 2;

            spook.style.left = `${event.clientX + offsetX}px`;
            spook.style.top = `${event.clientY + offsetY}px`;
        }
    });

    startButton.addEventListener("click", startGame);
});
