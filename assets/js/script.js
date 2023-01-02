const landingPanel = document.getElementById('js-quiz-start');
const quizPanel = document.getElementById('js-quiz-panel');
const endPanel = document.getElementById('js-quiz-end');
const timerEl = document.getElementById('js-timer');

const questionTitle = document.getElementById('js-question-text');
const choiceButtons = document.getElementById('js-question-choices');
const feedbackEl = document.getElementById('js-feedback');

const startBtn = document.getElementById('js-start-btn');

const initialsInput = document.getElementById('js-initials');
const submitBtn = document.getElementById('js-submit-btn');
const clearBtn = document.getElementById('js-clear-scores');
const scoresListEl = document.getElementById('js-scores-list');

let quizQuestionIndex = 0;
let countdownTimer;
let countdownTimerId;

function startQuiz() {
  landingPanel.classList.add('is-hidden');
  endPanel.classList.add('is-hidden');
  quizPanel.classList.remove('is-hidden');
  quizQuestionIndex = 0;

  renderQuestion(questions[quizQuestionIndex]);
  startTimer();
}

function endQuiz() {
  quizPanel.classList.add('is-hidden');
  endPanel.classList.remove('is-hidden');
  clearInterval(countdownTimerId);
  loadScores();
}

function startTimer() {
  countdownTimer = 60;
  timerEl.textContent = countdownTimer;
  countdownTimerId = setInterval(() => {
    countdownTimer--;
    timerEl.textContent = countdownTimer;
    if (!countdownTimer) {
      endQuiz();
    }
  }, 1000);
}

function renderQuestion(questionObj) {
  const { text, choices } = questionObj;
  questionTitle.textContent = text;

  renderChoices(choices);

  quizQuestionIndex++;
}

function renderChoices(choicesArr) {
  const choicesHTML = Object.keys(choicesArr).reduce((acc, key) => {
    return (
      acc +
      `
        <button class="button" data-key="${key}" data-question="${quizQuestionIndex}">
            ${choicesArr[key]}
        </button>
        `
    );
  }, '');

  choiceButtons.innerHTML = choicesHTML;
}

function handleChoiceClick(buttonEl) {
  const { key, question: questionIndex } = buttonEl.dataset;
  const { answer } = questions[questionIndex];

  if (key === answer) {
    buttonEl.classList.add('animate__animated', 'animate__heartBeat');
    setTimeout(() => {
      if (quizQuestionIndex === questions.length) {
        endQuiz();
      } else {
        renderQuestion(questions[quizQuestionIndex]);
      }
    }, 750);
  } else {
    countdownTimer -= 10;
    buttonEl.classList.add('animate__animated', 'animate__headShake');
  }
}

function saveScore() {
  const existingScores = JSON.parse(localStorage.getItem('high-scores')) || [];

  const initials = initialsInput.value;
  existingScores.push({
    initials,
    score: countdownTimer,
  });

  localStorage.setItem('high-scores', JSON.stringify(existingScores));
  initialsInput.textContent = '';
}

function loadScores() {
  scoresListEl.innerHTML = '';

  const scores = JSON.parse(localStorage.getItem('high-scores'));

  if (!scores) {
    return;
  }

  scores.forEach((scoreObj) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${scoreObj.initials}</td>
            <td>${scoreObj.score}</td>
        `;
    scoresListEl.append(row);
  });
}

function handleCorrect() {
  feedbackEl.textContent = "You're correct";
  feedbackEl.classList.add('is-success');
}

function handleIncorrect() {
  feedbackEl.textContent = "You're wrong";
  feedbackEl.classList.add('is-danger');
}

startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', () => {
  saveScore();
  loadScores();
});
clearBtn.addEventListener('click', () => {
  localStorage.setItem('high-scores', null);
  loadScores();
});

choiceButtons.addEventListener('click', (e) => {
  handleChoiceClick(e.target);
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('js-start-btn')) {
    startQuiz();
  }
});
