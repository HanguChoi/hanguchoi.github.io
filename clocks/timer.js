const _startStopButton = document.querySelector("#timer .start-stop-btn");
const _markResetButton = document.querySelector("#timer .mark-reset-btn");

const _timerDaysView = document.querySelector("#timer .days");
const _timerHoursView = document.querySelector("#timer .hours");
const _timerMinView = document.querySelector("#timer .min");
const _timerSecView = document.querySelector("#timer .sec");

const _marksOl = document.querySelector("#marks");


const TIMER_STATUS = {
    RUNNING: 'running',
    STOPPED: 'stopped'
};

let timer;
let timerStatus = TIMER_STATUS.STOPPED;
let timeElapsed = 0;

let marks = [];


const startOrStop = () => {
    if (isRunning()){
        // Running => Stop 
        showAsStartButton();
        showAsResetButton();
        stopTimer();
        timerStatus = TIMER_STATUS.STOPPED;
        
    } else {
        // Stopped => Start
        showAsPauseButton();
        timerStatus = TIMER_STATUS.RUNNING;
        showAsMarkButton();
        enableBtn(_markResetButton);
        startTimer();  
    }
}

const isRunning = () => {
    return (timerStatus == TIMER_STATUS.RUNNING);
}

const showAsPauseButton = () => {
    _startStopButton.classList.remove("green");
    _startStopButton.classList.add("red");
    _startStopButton.innerText = "Pause";
}  

const showAsStartButton = () => {
    _startStopButton.classList.remove("red");
    _startStopButton.classList.add("green");
    _startStopButton.innerText = "Start";
}  

const showAsResetButton = () => {
    _markResetButton.innerText = "Reset";
}  

const showAsMarkButton = () => {
    _markResetButton.innerText = "Mark";
}  

const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(runTimer, 1000);
}  

const runTimer = () => {
    timeElapsed++;
    renderTimer();
}
const stopTimer = () => {
    clearInterval(timer);
}        


const renderTimer = () => {
    const time = toHourMinSec(timeElapsed);
    _timerDaysView.innerText = time.days;
    _timerHoursView.innerText = padding(time.hours);
    _timerMinView.innerText = padding(time.min);
    _timerSecView.innerText = padding(time.sec);
}  

const markOrReset = () => {
    if (isRunning()){
        markCurrentTime();
        
    } else {
        resetTimer();
    }
}



const markCurrentTime = () => {
    const time = toHourMinSec(timeElapsed);
    marks.push(time);
    _marksOl.insertAdjacentHTML("afterbegin", markLi(time));
}

const markLi = (time) => {
    return `
        <li class="mark fl">
            <div>
                MARK ${marks.length}
            </div>
            <div class="fl">
                <div class="days">
                    <p>${time.days}</p>
                </div>
                <div class="day-gap">
                    <p>&nbsp;</p>
                </div>
                <div class="hours">
                    <p>${padding(time.hours)}</p>
                </div>
                <div class="time-gap">
                    <p>:</p>
                </div>
                <div class="min">
                    <p>${padding(time.min)}</p>
                </div>
                <div class="time-gap">
                    <p>:</p>
                </div>
                <div class="sec">
                    <p>${padding(time.sec)}</p>
                </div>
            </div>
        </li>
    `;
}

const resetTimer = () => {
    clearInterval(timer);
    timeElapsed = 0;
    renderTimer();
    marks.length = 0;
    _marksOl.innerHTML = "";
    showAsMarkButton();
    disableBtn(_markResetButton);
} 

_startStopButton.addEventListener("click", startOrStop);
_markResetButton.addEventListener("click", markOrReset);
disableBtn(_markResetButton);

