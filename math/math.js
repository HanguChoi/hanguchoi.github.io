// import RankManager from './rank_manager.js'
// import Map from './map.js'
// import Control from './control.js'
// import Action from './action.js';

const _answer = document.getElementById("answer");
const _submit = document.getElementById("submit");
const _numberA = document.getElementById("number_a");
const _numberB = document.getElementById("number_b");
const _notice = document.getElementById("notice");

const THE_ANSWER_IS = {
  CORRECT: 1,
  INCORRECT: 2
}

const submitAnswer = () => {
  console.log("answer", _answer.value);
  console.log("getResult()", getResult());
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
  _answer.value = "";
  newQuestions();
}
const wrongAnswer = () => {
  showResult(THE_ANSWER_IS.INCORRECT);
}
const newQuestions = () => {
  _numberA.innerText = getRandomInt(30);
  _numberB.innerText = getRandomInt(30);
}
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
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




  // _notice.classList.remove('correct');

  // _notice.classList.remove('active');

  // _notice.addClass("correct");
}


window.addEventListener('DOMContentLoaded', (event) => {
  newQuestions();
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



// document.getElementById("reset-top-ranked").addEventListener("click", function () {
    // RankManager.resetTopRanks();
    // window.location.reload();
// })
