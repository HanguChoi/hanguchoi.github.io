const _paresuit = document.getElementById("paresuit");  
const _wing = document.getElementById("wing");
const _flyingEnergyBar = document.getElementById("flying-energy-bar");

const ACTION = {
    JUMPING: 1,
    RUNNING: 2,
    FLYING: 3
}
const EARTH_BOTTOM = 52;
const JUMP_MAX = 252;
const FLY_MAX = 332;
const FRAME_UNIT = 2;
const FLYING_ENERGY_RECHARGE_AMOUNT = 0.1;

let curAction;

let jumpId;
let landOnId;
let flyingId;
let flappingId;
let flyingEnergy = 0;

// Penguin's position. bottom.
let pos = EARTH_BOTTOM;

const upOrDown = (_penguin)=> {
    _penguin.style.bottom = pos + "px"; 
}

const jump = (_penguin)=> {
    curAction = ACTION.JUMPING;
    jumpId = null;
    // let bottom = EARTH_BOTTOM;
    
    clearInterval(jumpId);
    // jumpId = setInterval(jumpOrLand(_penguin, bottom), FRAME_UNIT);
    jumpId = setInterval(() => {
        if (jumpedHigh()) {
            clearInterval(jumpId);
            landOn(_penguin, JUMP_MAX);
        
        } else {
            // keep jump
            pos = pos + 2;  // go up fast
            upOrDown(_penguin);
        }
    }, FRAME_UNIT);
}
const jumpedHigh = () => (pos >= JUMP_MAX)


const landOn = (_penguin, curBottom) => {
    showParesuit();
    landOnId = null;
    // let bottom = curBottom;
    
    clearInterval(landOnId);
    landOnId = setInterval(() => {

        if (landed()) {
            clearInterval(landOnId);
            hideParesuit();
            curAction = ACTION.RUNNING;

        } else {
            // keep down
            pos--;   // go down slowly
            upOrDown(_penguin);
        }
    }, FRAME_UNIT);
}
const landed = () => (pos <= EARTH_BOTTOM)


const fly = (_penguin) => {
    curAction = ACTION.FLYING;
    flyingId = null;
    
    startFlying(_penguin);
    flyingId = setInterval(flying, FRAME_UNIT);
    
    function flying() {
        useFlyingEnergy();
        if (flyable()) {
            if (pos < FLY_MAX){
                pos = pos + 0.2;
                upOrDown(_penguin);        
            } 

        } else {
            stopFlying(_penguin);
        }
    }
}

const startFlying = (_penguin) => {
    clearInterval(jumpId);
    clearInterval(landOnId);    
    clearInterval(flyingId);
    
    hideParesuit();
    _penguin.classList.add("flying");
    startFlapping();
    
}
const stopFlying = (_penguin) => {
    clearInterval(flyingId);
    curAction = ACTION.JUMPING;
    stopFlapping();
    _penguin.classList.remove("flying");
    landOn(_penguin);    
}
const startFlapping = () => {
    hideParesuit();
    flappingId = null;
    clearInterval(flappingId);
    flappingId = setInterval(() => {
        _wing.classList.toggle("flap_up");
    }, 120);
}

const stopFlapping = () => {
    clearInterval(flappingId);
}

const showParesuit = () => {
    _paresuit.style.display = "block";
}
const hideParesuit = () => {
    _paresuit.style.display = "none";
}

const flyable = () => flyingEnergy > 0

const start = () => {
    curAction = ACTION.RUNNING;
}

const useFlyingEnergy = () => {
    if (curAction == ACTION.FLYING){
        flyingEnergy -= (FLYING_ENERGY_RECHARGE_AMOUNT * 3);
        _flyingEnergyBar.value = flyingEnergy;
    }
}
const recharge = () => {
    if (curAction == ACTION.RUNNING){
        flyingEnergy += FLYING_ENERGY_RECHARGE_AMOUNT;
        _flyingEnergyBar.value = flyingEnergy;
    }
}

const keypressed = (_penguin) => {
    if (curAction == ACTION.RUNNING){
        jump(_penguin);
        
    }else if (curAction == ACTION.JUMPING){
        if (flyable()){
            fly(_penguin);
        }
    }else if (curAction == ACTION.FLYING){
        stopFlying(_penguin);
    }
}

const Action = {
    start: start,
    recharge: recharge,
    keypressed: keypressed
}

export default Action
