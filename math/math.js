
// import Map from './map.js'
import Countdown from './countdown.js'
import RankManager from './rank_manager.js'
// import Action from './action.js';

const _answer = document.getElementById("answer");
const _submit = document.getElementById("submit");
const _numberA = document.getElementById("number_a");
const _numberB = document.getElementById("number_b");
const _notice = document.getElementById("notice");
const _gameover = document.getElementById("gameover")
const _restart = document.getElementById("restart")
const _score = document.getElementById("cur-score");

const THE_ANSWER_IS = {
  CORRECT: 1,
  INCORRECT: 2
}

let score = 0;

const submitAnswer = () => {
  if (getResult() == _answer.value){
    correctAnswer();
  }else {
    wrongAnswer();
  }
  _answer.focus();
}
const getResult = () => {
  return parseInt(_numberA.innerText) + parseInt(_numberB.innerText);
}
const correctAnswer = () => {
  showResult(THE_ANSWER_IS.CORRECT);
  score += 1;
  renderScore()
  _answer.value = "";
  newQuestions();
}
const wrongAnswer = () => {
  showResult(THE_ANSWER_IS.INCORRECT);
}
const newQuestions = () => {
  _numberA.innerText = getRandomInt(9);
  _numberB.innerText = getRandomInt(9);
}
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}
const onFinished = () => {
  _gameover.style.display = "block"
  _answer.disabled = true;``
  setTimeout(() => {
    RankManager.setRank(score);
  }, 200);
}
const startGame = () => {
  const params = new URLSearchParams(window.location.search);
  const time = params.get("time");
  newQuestions();
  RankManager.showTopRanks();
  Countdown.startCountdown(params.get("time"), onFinished);
  _answer.focus();
}
const renderScore = () => {
  _score.innerText = score;
}



const showResult = (result) => {
  _notice.classList.add('active');

  switch (result) {
    case THE_ANSWER_IS.CORRECT:
      _notice.innerText = 'correct!';
      _notice.classList.remove('wrong');
      _notice.classList.add("correct");
      setTimeout(() => {
        _notice.classList.remove('active');
      }, 50);
      break;
    case THE_ANSWER_IS.INCORRECT:
      _notice.innerText = 'The answer is incorrect.';
      _notice.classList.remove('correct');
      _notice.classList.add("wrong");
      break;
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  startGame();
});

_answer.addEventListener("keypress", (e) => {
  console.log(e.key);
  if (e.key == 'Enter'){
    submitAnswer();
  }
})

_submit.addEventListener("click", (e) => {
  submitAnswer();
})

_restart.addEventListener("click", (e) => {
  window.location.reload();
})
