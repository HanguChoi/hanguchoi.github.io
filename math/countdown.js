const _countdown = document.querySelector("#countdown .sec");

let countdown;
let timeRemaining = null;
let onFinished;

const COUNTDOWN_STATUS = {
  STARTED: 'started',
  NOT_STARTED: 'not_started'
};
let countdownStatus = COUNTDOWN_STATUS.NOT_STARTED;
let sampled = false;


// const formatDate = (date) => {
//     const y = date.getFullYear();
//     const m = (date.getMonth() + 1).toString();
//     const d = date.getDate().toString();
//     const timestr = date.toTimeString().substr(0,5);
//     return `${y}-${padding(m)}-${padding(d)}T${timestr}`;
// }

const setCountdown = () => {
  clearInterval(countdown);
  renderCountdown();
}

const startCountdown = (time, callback) => {
  timeRemaining = time ? time : 10;
  onFinished = callback;
  clearInterval(countdown);
  renderCountdown();
  countdown = setInterval(doCountdown, 1000);
}

const doCountdown = () => {
  timeRemaining--;
  renderCountdown();

  if (timeRemaining <= 0){
    resetCountdown();
    onFinished();
  }
}

const renderCountdown = () => {
  const time = toHourMinSec(timeRemaining);
  // _countdown.innerText =padding(time.sec);
  _countdown.innerText =padding(timeRemaining);
}

const resetCountdown = () => {
  stopCountdown();
  setCountdown();
}

const stopCountdown = () => {
  clearInterval(countdown);
  countdownStatus = COUNTDOWN_STATUS.NOT_STARTED;
}

const toHourMinSec = (t) => {
  const days = parseInt(t / (3600 * 24));
  t = t % (3600 * 24);

  const h = parseInt(t / 3600);
  t = t % 3600;

  const m = parseInt(t / 60);
  const s = t % 60;

  return {
    days: days,
    hours: h,
    min: m,
    sec: s
  };
}

const padding = (num) => {
  const str = num.toString();
  if (str.length == 1){
      return `0${str}`;
  }
  return str;
}

const Countdown = {
  startCountdown: startCountdown
  // score: score,
  // speed: speed,
  // reset: reset,
  // hitObstacles: hitObstacles
}

export default Countdown