document.addEventListener("DOMContentLoaded", () => {
    // Selecting all the elements to work with:
    const scoreValEl = document.querySelector("#scoreVal");
    const scoreUpdEl = document.querySelector("#scoreUpd"); 
    const questionEl = document.querySelector("#question");
    const formEl = document.querySelector("form");
    const userInpEl = formEl.querySelector("#answerInp");
    const scoreStoragePromptMsg = "Do you want to Save your Score?\n-Enter 'Yes' to Store the Score.\n-Enter 'No' or Click 'Cancel' button to Deny Storing the Score, or If the Score is Already Stored.\n-Enter 'Delete' to Remove the Stored Score.\n\nUsage:\nThis Feature will Allow you to Continue your Game from the Same Score, where you Quit at the Last Game Session, even if you Close the Website/Browser.";

    const generateQuestion = () => {
        // Generate Two Random Operands and One Random Operation:
        let operand1 = generateRandomNum(1, 10);
        let operand2 = generateRandomNum(1, 10);
        let operation = generateRandomOperation();
        
        // Update the Question:
        if(operation === "add") {
            questionEl.innerHTML = `What is ${operand1} plus ${operand2} ?`;
        }
        else if(operation === "subtract") {
            questionEl.innerHTML = `What is ${operand1} minus ${operand2} ?`;
        }
        else if(operation === "multiply") {
            questionEl.innerHTML = `What is ${operand1} multiplied by ${operand2} ?`;
        }
        else {
            questionEl.innerHTML = `What is ${operand1} divided by ${operand2} ?`;
        }

        // Return the Question Info in Array form:
        return [operand1, operand2, operation];
    }

    const calculateAns = (operand1, operand2, operation) => {
        let correctAns;

        // Calculate the Answer, based on the Operation:
        if(operation.toLowerCase() === "add") {
            correctAns = operand1 + operand2;
        }
        else if(operation.toLowerCase() === "subtract") {
            correctAns = operand1 - operand2;
        }
        else if(operation.toLowerCase() === "multiply") {
            correctAns = operand1 * operand2;
        }
        else if(operation.toLowerCase() === "divide") {
            //round to number upto 2 decimal places 👇
            correctAns = Math.round((operand1 / operand2) * 100) / 100; 
        }
        
        return correctAns;
    }

    const updateScore = (isAnsCorrect) => {
        if(isAnsCorrect) { //Increment the Score by 3
            score += 3;
            scoreValEl.innerText = score; //display the updated 'score' variable in the webpage.
            displayToast("greenColor", 2000, "Hurrah!🥳 Your Answer is Correct.\nLet's Move to the Next Question.");
            showScoreUpdEl(true);
            updateGameBoxEls();
        }
        else { // Decrement the Score by 1, and Update the Wrong Answers Count:
            scoreValEl.innerText = --score;
            showScoreUpdEl(false);
            wrongAnsCount++;

            // When "wrongAnsCount" has crossed the limit of 3, then Generate a New Question, by calling "updateGameBox()":
            if(wrongAnsCount < 3) {
                displayToast("redColor", 2000, "Oops!😓 You've Entered Wrong Answer.\nPlease, Retry Again.");
            }
            else {
                displayToast("redColor", 8000, `YOU'VE ENTERED THE WRONG ANSWER, THRICE.\nThe Correct Answer is ${correctAns}.\nLet's Move On to the Next Question...!\n\n*Note*\nIf the question asks you to perform division operation, then the answer should be rounded to two decimal places (only, if the answer contains decimal values).`);
                updateGameBoxEls(); 
            }
        }
        localStorage.setItem("score", score); //update the locally stored 'score' key
    }

    //Function to display a toast(or a notification) on a specific condition, by using Toastify-js library.
    const displayToast = (background, timeDurationInMs, msg) => {
        if(background === "greenColor") {
            bgColor = "linear-gradient(to right, #00b09b, #96c93d)";
        }
        else {
            bgColor = "linear-gradient(to right, #e33217, #ff001e)";
        }

        Toastify({
            text: msg,
            className: "info",
            gravity: "top",
            duration: timeDurationInMs, //parameter means, time duration in milliseconds.
            position: "center",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              fontSize: "1.5rem",
              background: bgColor,
              textAlign: "center",
              cursor: "default",
              maxWidth: "50rem",
            }
        }).showToast();
    }

    const generateRandomNum = (start, end) => {
        // Ensure the start is less than the end:
        if (start > end) {
            throw new Error("Start value must be less than end value, in the range.");
        }

        // Calculate the range:
        const range = (end - start) + 1; //to include both the start and end values, it's incremented by 1.

        // Generate a random number within the range and add the start value:
        const randomNumber = Math.floor(Math.random() * range) + start;

        return randomNumber;
    }

    const generateRandomOperation = () => {
        const operandsArr = ["add", "subtract", "multiply", "divide"];
        let operation = operandsArr[ generateRandomNum(0, 3) ]; //to randomly select an opeartion from the opreandArr[].
        return operation;
    }

    const showScoreUpdEl = (isAnsCorrect) => {
        /* Animation Removal & Reflow technique is used to avoid any unexpected behaviour, 
        when the animations are added & removed, rapidly, on user interactions. */
        scoreUpdEl.classList.remove("animate-[scoreUpdation_1s_ease-out_0s_1_normal]"); //Animation Removal
        void scoreUpdEl.offsetWidth; // Force reflow[a process in which browser recalculates the layout of the webpage(parts of it), normally happens when we make changes to the DOM(structure of the webpage) or styling of it's elements(sizing & position)]

        if(isAnsCorrect) { //then, modify the text content, make the text green, and apply animation to the element:
            scoreUpdEl.innerText = "+3";
            scoreUpdEl.classList.add("bg-[#0ADD08]", "animate-[scoreUpdation_1s_ease-out_0s_1_normal]");
        }
        else { //then, modify the text content, make the text red, and apply animation to the element.
            scoreUpdEl.innerText = "-1";
            scoreUpdEl.classList.add("bg-red-600", "animate-[scoreUpdation_1s_ease-out_0s_1_normal]");
        }

        // Remove the text-colors and the animation, when, once the animation ends:
        scoreUpdEl.addEventListener('animationend', () => {
            scoreUpdEl.classList.remove("[bg-[#0ADD08]", "bg-red-600", "animate-[scoreUpdation_1s_ease-out_0s_1_normal]"); 
        });
    }

    // Function to get a new question, calculate the correct answer, empty the input field, & to reset the 'wrongAnsCount'.
    const updateGameBoxEls = () => {
        questionArr = generateQuestion();
        correctAns = calculateAns(questionArr[0], questionArr[1], questionArr[2]); 
        userInpEl.value = "";
        wrongAnsCount = 0; //resets to '0' zero, when the user gives a correct answer.
    }

    // Function to display a prompt, which asks the user, if they want to store their score locally or not:
    const showScoreStoragePrompt = (message) => {
        userReplyToPrompt = prompt(message);
        
        if(userReplyToPrompt === null || userReplyToPrompt.toLowerCase() === "no") {
            return;
        }
        else if(userReplyToPrompt.toLowerCase() === "yes") { //when, user wants to store the score
            if(localStorage.getItem("score") === null) {
                localStorage.setItem("score", score);
            }
            else { //when, user wants to store the score, but the score is already stored
                displayToast("redColor", 2000, "Invalid Reply! Your Score is Already Stored.");
                setTimeout(() => showScoreStoragePrompt(scoreStoragePromptMsg), 2100);
            }
        }
        else if(userReplyToPrompt.toLowerCase() === "delete") { //when, user wants to delete the stored score
            localStorage.removeItem("score");
            scoreValEl.innerText = score = 0;
        }
        else { //when, user entered an invalid value, other than "YES", "NO", or "DELETE"
            displayToast("redColor", 2000, "Invalid Reply! Please, Enter YES or NO, only.");
            setTimeout(() => showScoreStoragePrompt(scoreStoragePromptMsg), 2100);
        }
    }

    // Initialization of Game-Box [Score & Question]:
    let score = localStorage.getItem("score") === null ? 0 : parseInt(localStorage.getItem("score"));
    scoreValEl.innerText = score; //to display the locally stored "score" [if exists].
    let questionArr = generateQuestion();
    let correctAns = calculateAns(questionArr[0], questionArr[1], questionArr[2]);
    let wrongAnsCount = 0; 

    // Handling Form (Answer) Submit Event, by Updating the Game-Box:
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();

        if(userInpEl.value === String(correctAns)) { 
            updateScore(true);
        }
        else {
            updateScore(false);
        }
    });

    //Display "score-storage" prompt, after 0.5s:
    setTimeout( () => {
        showScoreStoragePrompt(scoreStoragePromptMsg);
    }, 500); 
});