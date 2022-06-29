const _clock = document.querySelector("#clock");
const _clockModeButton = document.querySelector("#clock-mode-btn");

const _clockAmPmElms = document.querySelectorAll("#clock .am-pm-elm");
const _clockAmPmView = document.querySelector("#clock .am-pm");
const _clockHoursView = document.querySelector("#clock .hours");
const _clockMinView = document.querySelector("#clock .min");
const _clockSecView = document.querySelector("#clock .sec");

let clock;

const CLOCK_MODE = {
    H24: 24,
    H12: 12
};

let clockMode = CLOCK_MODE.H24;

const startClock = () => {
    clearInterval(clock);
    clock = setInterval(renderClock, 1000);
}

const toggleClockMode = () => {
    if (is12h()){
        // 12h => 24h
        clockMode = CLOCK_MODE.H24;
        showAs12hButton();
        renderClock();
        _clock.classList.add("h24");
        _clockAmPmElms.forEach(elm => elm.style.display = "none");
        
        
    } else {
        // 24h => 12h
        clockMode = CLOCK_MODE.H12;
        showAs24hButton();
        renderClock();
        _clock.classList.remove("h24");
        _clockAmPmElms.forEach(elm => elm.style.display = "flex");
    }
}

const is12h = () => {
    return (clockMode == CLOCK_MODE.H12);
}

const showAs12hButton = () => {
    _clockModeButton.innerText = "12H";
}

const showAs24hButton = () => {
    _clockModeButton.innerText = "24H";
}
             

const renderClock = () => {
    let hours;
    const time = new Date();
    
    if (is12h()){
        hours = time.getHours();
        if (hours >= 12) {
            _clockAmPmView.innerText = "pm";
        }else{
            _clockAmPmView.innerText = "am";
        }
        hours = hours % 12;
        
    }else{
        hours = time.getHours();
    }
    _clockHoursView.innerText = padding(hours);
    _clockMinView.innerText = padding(time.getMinutes());
    _clockSecView.innerText = padding(time.getSeconds());
}  


_clockModeButton.addEventListener("click", toggleClockMode);
renderClock();
startClock();
