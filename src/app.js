document.addEventListener("DOMContentLoaded", () => {
    const scoreValEl = document.querySelector("#scoreVal");
    const questionEl = document.querySelector("#question");
    const formEl = document.querySelector("form");
    const userInpEl = formEl.querySelector("#answerInp");

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

    // Function to get a new question, a correct answer, empty the input field, & to reset the 'wrongAnsCount'.
    const updateGameBox = () => {
        questionArr = generateQuestion();
        correctAns = calculateAns(questionArr[0], questionArr[1], questionArr[2]); 
        userInpEl.value = "";
        wrongAnsCount = 0; //resets to '0' zero, when the user gives a correct answer.
    }

    // Initialization of Game-Box [Score & Question]:
    let score = 0;
    let questionArr = generateQuestion();
    let correctAns = calculateAns(questionArr[0], questionArr[1], questionArr[2]);
    let wrongAnsCount = 0; 


    // Handling Form Submit Event and Update the Score:
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();

        if(userInpEl.value === String(correctAns)) { 
            
            //Increment the Score by 3 & Update the Game-Box:
            score += 3;
            scoreValEl.innerText = score; 
            updateGameBox();
        }
        else {
            
            //Update the Wrong Answers Count and Decrement the Score by 1:
            wrongAnsCount++;
            scoreValEl.innerText = --score; 

            // When "wrongAnsCount" has crossed the limit of 3, then Generate a New Question, by calling "updateGameBox()":
            if(wrongAnsCount < 3) {
                alert("You've entered wrong answer. Please, retry again!");
            }
            else {
                alert(`YOU'VE ENTERED THE WRONG ANSWER, THRICE.\nThe Correct Answer is ${correctAns}.\nLet's Move On to the Next Question...!\n\n*Note: If the question asks you to perform division operation, then the answer should be rounded to two decimal places (only, if the answer contains decimal values).`);
                updateGameBox(); 
            }
        }
    });
});