const _userInputTime = document.querySelector("#countdown input");
const _userInputTimezone = document.querySelector("#countdown #timezone");

const _countdownStartResetButton = document.querySelector("#countdown .start-reset-btn");

const _countdownDaysView = document.querySelector("#countdown .days");
const _countdownHoursView = document.querySelector("#countdown .hours");
const _countdownMinView = document.querySelector("#countdown .min");
const _countdownSecView = document.querySelector("#countdown .sec");

const _countdownInputErrorMsg = document.querySelector("#countdown .error");

const _countdownSampleButtons = document.querySelectorAll("#countdown .sample-button");
const _countdownSamples = document.querySelectorAll("#countdown .sample");


let countdown;
let timeRemaining = 0;

const COUNTDOWN_STATUS = {
    STARTED: 'started',
    NOT_STARTED: 'not_started'
};
let countdownStatus = COUNTDOWN_STATUS.NOT_STARTED;
let sampled = false;


const setMinimum = () => {
    const now = new Date();
    _userInputTime.min = formatDate(now);
}

const formatDate = (date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString();
    const d = date.getDate().toString();
    const timestr = date.toTimeString().substr(0,5);
    return `${y}-${padding(m)}-${padding(d)}T${timestr}`;
}

const setCountdown = () => {
    clearInterval(countdown);
    hideErrorMessage();
    setTimeRemaining();
    renderCountdown();
}

const setTimeRemaining = () => {
    const diff = getDiff();
    if (isNaN(diff)){
        timeRemaining = 0;
        return;
    }

    timeRemaining = Math.ceil(diff / 1000);
    if (timeRemaining <= 0){
        showErrorMessage();
        timeRemaining = 0;
    }
}

const getDiff = () => {
    const inputTime = new Date(_userInputTime.value);
    const timeWithZone = new Date(inputTime.toLocaleString("en-US", {timeZone: _userInputTimezone.value}));
    return timeWithZone.getTime() - new Date().getTime();
}

const startOrReset = () => {
    if (countdownStatus == COUNTDOWN_STATUS.NOT_STARTED){
        // Not started => Start
        _countdownStartResetButton.innerText = "Reset";
        _countdownStartResetButton.classList.remove("green");
        _countdownStartResetButton.classList.add("gray");
        startCountdown();
        countdownStatus = COUNTDOWN_STATUS.STARTED;
        
    } else {
        // Started => Reset
        // Reset policy: My Time button clicked
        _countdownSampleButtons[3].click();
    }
}

const startCountdown = () => {
    clearInterval(countdown);
    countdown = setInterval(doCountdown, 1000);
}  

const doCountdown = () => {
    timeRemaining--;
    renderCountdown();
    
    if (timeRemaining <= 0){    
        resetCountdown();
    } 
}  

const showErrorMessage = () => {
    _countdownInputErrorMsg.style.display = "block";
}

const hideErrorMessage = () => {
    _countdownInputErrorMsg.style.display = "none";
}

const renderCountdown = () => {
    const time = toHourMinSec(timeRemaining);
    _countdownDaysView.innerText = time.days;
    _countdownHoursView.innerText = padding(time.hours);
    _countdownMinView.innerText = padding(time.min);
    _countdownSecView.innerText = padding(time.sec);
    
    if (timeRemaining > 0){
        enableBtn(_countdownStartResetButton);
    }else{
        disableBtn(_countdownStartResetButton);
    }
}

const resetCountdown = () => {
    stopCountdown();
    _userInputTime.value = ""
    setCountdown();
}

const StopAndSetCountdown = () => {
    stopCountdown();
    setCountdown();
} 

const stopCountdown = () => {
    clearInterval(countdown);
    _countdownStartResetButton.innerText = "Start";
    _countdownStartResetButton.classList.add("green");
    _countdownStartResetButton.classList.remove("gray");
    countdownStatus = COUNTDOWN_STATUS.NOT_STARTED;
}  

const sampleClicked = (e) => {
    resetCountdown();
    sampled = false;
    
    const _btn = e.target;
    _countdownSampleButtons.forEach(btn => btn.classList.remove("active"));
    _btn.classList.add("active");
    
    _countdownSamples.forEach((sample)=>{
        sample.classList.remove("active");
        if (_btn.dataset.id === sample.id){
            setSample(sample);
            setCountdown();
            sampled = true;
        }
    })
}

const setSample = (sample) => {
    sample.classList.add("active");
    _userInputTime.value = sample.dataset.datetime;
}

_userInputTime.addEventListener("change", StopAndSetCountdown);
_userInputTimezone.addEventListener("change", StopAndSetCountdown);
_countdownStartResetButton.addEventListener("click", startOrReset);
_countdownSampleButtons.forEach(btn => btn.addEventListener("click", sampleClicked));


_countdownSampleButtons[0].click();  // Open first sample
setMinimum();


