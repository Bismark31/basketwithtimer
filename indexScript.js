const basketballElements = document.querySelectorAll('.basketball');
const hoopElement = document.querySelector('.hoop-ring');
let score = 0;
let missedShots = 0; 
let highScore = 0; 
let remainingBalls = basketballElements.length;  // Track remaining balls
let timerValue = 180;  // Start timer at 180 seconds (3 minutes)
let timerInterval;  // Variable to store the interval for the timer

// Initialize the high score display
document.getElementById('highScore').innerText = `High Score: ${highScore}`;

// Timer function to decrease the time and update the display
function startTimer() {
    timerInterval = setInterval(() => {
        timerValue--;  // Decrease timer value by 1 second
        document.getElementById('timer').innerText = timerValue;

        // When the timer reaches 0, stop the game
        if (timerValue === 0) {
            clearInterval(timerInterval);  // Stop the timer
            document.getElementById('remarks').innerText = "Time's up! Game Over!";
            document.getElementById('resetButton').style.display = 'block';  // Show reset button
        }
    }, 1000);  // Decrease every 1 second
}

// DRAG START - Make basketballs draggable
basketballElements.forEach(element => {
    element.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);  // Set the dragged ball's ID
        event.currentTarget.classList.add('dragging');  // Add dragging style
    });
});

// DRAG OVER - Allow hoop to accept the dropped ball
hoopElement.addEventListener('dragover', (event) => {
    event.preventDefault();  // Allow dropping the ball
});

// DROP EVENT - Handle dropped basketball
hoopElement.addEventListener('drop', (event) => {
    event.preventDefault();
    const droppedBallId = event.dataTransfer.getData('text');  // Get dropped ball's ID
    const ball = document.getElementById(droppedBallId);

    if (ball) {
        // If the ball is dropped inside the hoop, score it
        score += 1;
        document.getElementById('remarks').innerText = "SCORE!";
        document.getElementById('scores').innerText = score;  // Update current score

        // Update high score if the current score is higher
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').innerText = `High Score: ${highScore}`; // Display high score
        }

        // Disable dragging for this ball (make it immovable)
        ball.removeAttribute('draggable');
        ball.style.pointerEvents = 'none'; // Prevent interaction with the ball after being dropped

        // Remove the ball from the game container
        ball.remove();

        // Decrement remaining balls
        remainingBalls--;

        // If no remaining balls, end the game
        if (remainingBalls === 0) {
            document.getElementById('remarks').innerText = "Game Over!";
            document.getElementById('resetButton').style.display = 'block';  // Show reset button
        }

        // Reset missed shots count after a successful shot
        missedShots = 0;
        document.getElementById('missed').innerText = `Missed shots: ${missedShots}`;
    }
});

// DRAG END - Handle missed shots
basketballElements.forEach(element => {
    element.addEventListener('dragend', (event) => {
        event.currentTarget.classList.remove('dragging');  // Remove dragging style

        const ball = event.target;
        // If the ball is not dropped inside the hoop, count it as a missed shot
        if (!hoopElement.contains(ball)) {
            missedShots += 1;  // Increment missed shots
            document.getElementById('remarks').innerText = "MISSED!";
            document.getElementById('missed').innerText = `Missed shots: ${missedShots}`;
        }

        // If the ball was successfully shot, hide the "MISSED!" remark
        if (document.getElementById('remarks').innerText !== "SCORE!") {
            document.getElementById('remarks').innerText = "";  // Clear remark if not a score
        }
    });
});

// Reset button event listener
document.getElementById('resetButton').addEventListener('click', () => {
    // Reset score, missed shots, and remaining balls
    score = 0;
    missedShots = 0;
    remainingBalls = basketballElements.length;  // Reset to initial number of balls
    timerValue = 180;  // Reset timer to 3 minutes (180 seconds)

    // Reset the game UI
    document.getElementById('remarks').innerText = "";  // Clear remarks
    document.getElementById('scores').innerText = `Score: ${score}`;  // Reset score display
    document.getElementById('missed').innerText = `Missed shots: ${missedShots}`;  // Reset missed shots display
    document.getElementById('resetButton').style.display = 'none';  // Hide reset button after reset
    document.getElementById('timer').innerText = timerValue;  // Reset timer display

    // Reattach balls to game container
    basketballElements.forEach(ball => {
        document.querySelector('.gameContainer').appendChild(ball);  // Re-attach balls
        ball.style.position = '';  // Reset ball position
        ball.setAttribute('draggable', 'true');  // Re-enable dragging
    });

    // Start the timer again
    clearInterval(timerInterval);  // Clear any existing timer
    startTimer();  // Start the timer from 3 minutes
});

// Start the timer as soon as the game is initialized
startTimer();
