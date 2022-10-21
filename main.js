let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// This function get the data from json if the link is right and turn json into js
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length; //to know the number of the questions

            // Create Bullets + set Questions count number
            createBullets(qCount);

            // Add data
            addQuestionData(questionsObject[currentIndex], qCount);

            // start countdown
            countdown(10, qCount);

            // click on sumbit
            submitButton.onclick = () => {
                // get right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                // icrease index
                currentIndex++;
                //chck the answer
                checkAnswer(theRightAnswer, qCount);
                // remove previuos question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                // add question data
                addQuestionData(questionsObject[currentIndex], qCount);
                // handle bullets"spans" class
                handleBullets();
                // start countdown
                clearInterval(countdownInterval);
                countdown(10, qCount);
                // Show results
                showResults(qCount);
            };
        }
    };

    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}
getQuestions();

// function to add th number of questions in "Questions count" + the number of bullets
function createBullets(num) {
    countSpan.innerHTML = num;

    //Create spans
    for (i = 0; i < num; i++) {
        let theBullet = document.createElement("span"); //bullets

        //check if it is first span
        if (i === 0) {
            theBullet.classList = "on";
        }

        bulletsSpanContainer.appendChild(theBullet); //bullets in spans
    }
}

// create the h2, input and label for the question and answers
function addQuestionData(obj, count) {
    
    if (currentIndex < count) { //theis if make it stop creating these divs when the answers finished
        // create h2 question title
        let questionTitle = document.createElement("h2");
        // create question text
        let questionText = document.createTextNode(obj.title)
        // append text to h2
        questionTitle.appendChild(questionText);
        // append h2 into body"quizArea"
        quizArea.appendChild(questionTitle);
        // create the answers
        for (let i = 1; i <= 4; i++) {
            // create main answer div
            let mainDiv = document.createElement("div");
            mainDiv.classList = "answer";
            // create radio input
            let radioInput = document.createElement("input");
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // make first option selected
            // if (i === 1) {
            //     radioInput.checked = true;
            // }

            // create lable
            let theLable = document.createElement("label");
            theLable.htmlFor = `answer_${i}`; //htmlFor means "attribute = for"
            // create lable text
            let theLableText = document.createTextNode(obj[`answer_${i}`]);
            // add text to label
            theLable.appendChild(theLableText);
            // add input and label to answer div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLable);
            // add answer div to body"answers-area"
            answersArea.appendChild(mainDiv);
        }
    }
}

// check if the answer is right and add point
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
        theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

// this function put class on spans bullets when the question come
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.classList = "on";
        }
    });
}

// function remove everything to show results insted
function showResults(count) {
    let theResults;
    if (currentIndex === count) { //why "=" not "<" dosnt length less than index with 1. bcs i want it to show when the answers finished
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} from ${count}`;
        }else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers are Right.`;
        }else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} from ${count}`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.narginTop = "10px";
    }
}

// countdown function
function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds} `
            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}