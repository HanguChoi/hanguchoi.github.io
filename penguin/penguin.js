import RankManager from './rank_manager.js'
import Map from './map.js'
import Control from './control.js'
import Action from './action.js';

const _penguin = document.getElementById("penguin");  

const STATUS = {
    PLAYING: 1,
    STOPPED: 2
}

let status;

const startGame = () => {
    status = STATUS.PLAYING;
    Action.start();
    RankManager.showTopRanks();
    
    let id = null;
    
    clearInterval(id);
    id = setInterval(() => {
        Control.scoring();
        Action.recharge();

        if (Control.hitObstacles(_penguin)){
            clearInterval(id);
            gameOver();
        }
        Map.progress(Control.speed());
    }, 1);
}

const gameOver = () => {
    status = STATUS.STOPPED;
    showGameOver();
    RankManager.setRank(Control.score());
    
    clearInterval(id);
    Control.reset();
}

const showGameOver = () => {
    document.getElementById("gameover").style.display = "block"   
}


window.addEventListener('DOMContentLoaded', (event) => {
    startGame();
});

document.addEventListener("keypress", function () {
    if (status != STATUS.PLAYING){
        // new game
        window.location.reload();
        return true;
    }
    Action.keypressed(_penguin)
})



document.getElementById("reset-top-ranked").addEventListener("click", function () {
    RankManager.resetTopRanks();
    window.location.reload();
})

