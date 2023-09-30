
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
const _mathSymbol = document.getElementById("math-symbol");
const _levelSelector = document.getElementById("level-selector");
const _mathTypeSelector = document.getElementById("math-type-selector");

const THE_ANSWER_IS = {
  CORRECT: 1,
  INCORRECT: 2
}
const MATH_TYPE = {
  PLUS: 'plus',
  MINUS: 'minus',
  MULTIPLY: 'multiply',
  DIVIDE: 'divide'
}
const MATH_SYMBOL = {
  PLUS: '+',
  MINUS: '-',
  MULTIPLY: '&#215;',
  DIVIDE: '&#247;'
}

const defaultCountdownTime = 60;
const defaultLevel = 1;
const defaultMathType = MATH_TYPE.PLUS;

let score = 0;
let countdownTime;
let curLevel;
let curMathType;

const submitAnswer = () => {
  console.log("what is the answer value? ", _answer.value);
  console.log("what is the getResult()? ", getResult());
  if (getResult() == _answer.value){
    correctAnswer();
  }else {
    wrongAnswer();
  }
  _answer.focus();
}
const getResult = () => {
  const a = parseInt(_numberA.innerText);
  const b = parseInt(_numberB.innerText);
  switch (curMathType) {
    case MATH_TYPE.PLUS:
      return a + b;
    case MATH_TYPE.MINUS:
      return a - b;
    case MATH_TYPE.MULTIPLY:
      return a * b;
    case MATH_TYPE.DIVIDE:
      return a % b;
  }
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
  let aStart = 1;
  let aEnd = 9;
  let bStart = 1;
  let bEnd = 9;
  switch (parseInt(curLevel)) {
    case 1:
      break;
    case 2:
      bStart = 10;
      bEnd = 99;
      break;
    case 3:
      aStart = 10;
      aEnd = 99;
      bStart = 10;
      bEnd = 99;
      break;
    case 4:
      aStart = 10;
      aEnd = 99;
      bStart = 100;
      bEnd = 999;
      break;
    case 5:
      aStart = 100;
      aEnd = 999;
      bStart = 100;
      bEnd = 999;
      break;
  }
  _numberA.innerText = getRandomInt(aStart, aEnd);
  _numberB.innerText = getRandomInt(bStart, bEnd);
}
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const onFinished = () => {
  _gameover.style.display = "block"
  _answer.disabled = true;``
  setTimeout(() => {
    RankManager.setRank(score);
  }, 200);
}
const getMathSymbol = () => {
  for (const _type in MATH_TYPE) {
    if (MATH_TYPE[_type] == curMathType){
      return MATH_SYMBOL[_type]
    }
  }
}
const getMathType = (params) => {
  const mathType = params.get("math_type");
  if (mathType){
    for (const _type in MATH_TYPE) {
      if (MATH_TYPE[_type] == mathType){
        return MATH_TYPE[_type]
      }
    }
  }else {
    return MATH_TYPE.PLUS;
  }
}

const startGame = () => {
  const params = new URLSearchParams(window.location.search);

  countdownTime = (params.get("time") || defaultCountdownTime);
  curLevel = (params.get("level") || defaultLevel);
  curMathType = getMathType(params);

  initGame();
  newQuestions();
  RankManager.showTopRanks();
  Countdown.startCountdown(countdownTime, onFinished);
  _answer.focus();
}
const renderScore = () => {
  _score.innerText = score;
}
const initGame = () => {

  _levelSelector.value = curLevel;
  _mathTypeSelector.value = curMathType;
  _mathSymbol.innerHTML = getMathSymbol();
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

_levelSelector.addEventListener("change", (e) => {
  window.location.search = `math_type=${curMathType}&level=${e.target.value}`;
})

_mathTypeSelector.addEventListener("change", (e) => {
  window.location.search = `math_type=${e.target.value}&level=${curLevel}`;
})
