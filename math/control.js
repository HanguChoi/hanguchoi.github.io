let innerScore = 0;
let displayScore = 0;
let level = 1;

const levelUp = () => {
    if (displayScore > 300){
      level = 4;
    }else if (displayScore > 200){
      level = 3;
    }else if (displayScore > 100){
      level = 2;
    }
}

const speed = () => {
  if (level > 3){
      return 2;
  }else if (level > 2){
      return 1.5;
  }else if (level > 1){
      return 1.2;
  }else{
      return 1;
  }
}

const scoring = () => {
  innerScore++;
  if (innerScore % 100 == 0){
      levelUp();
      displayScore = innerScore / 100
      document.getElementById("score").innerText = displayScore;  
  }
}
const hitObstacles = (_penguin) => {
    const obstacles = document.getElementsByClassName("obstacle");  
    const hit = Array.from(obstacles).some(function(o){
        return hitObstacle(o, _penguin);
    })
    if (hit){
        return true;
    }
    return false;
}
const hitObstacle = (_obstacle, _penguin) => {
  const o = _obstacle.getBoundingClientRect();
  const p = _penguin.getBoundingClientRect();
      
  if (o.left < p.right && o.right > p.left && o.top < p.bottom) {
    // _obstacle.style.backgroundColor = "red";
    _obstacle.getElementsByTagName("svg")[0].fill = "#0011ff";
    return true;  
  }

  return false;
}


const reset = () =>{
  innerScore = 0;
  displayScore = 0;
  level = 1;
}

const score = () => {
  return displayScore;
}


const Control = {
  scoring: scoring, 
  score: score, 
  speed: speed, 
  reset: reset,
  hitObstacles: hitObstacles
}

export default Control
