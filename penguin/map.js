const _mapContariner = document.getElementById("maps");
const _maps = document.getElementsByClassName("map"); 

let left = 0;  // map starting point.

const needMoreMaps = () => {
    const last = _maps[_maps.length - 1];
    if (last.getBoundingClientRect().left < 2000){
        return true;
    }
    return false;
}

const deleteOldMaps = () => {
    return false;   // no delete. left float issues.
    const first = _maps[0];
    if (first.getBoundingClientRect().right < -1000){
        _mapContariner.removeChild(first);   
    }
}

const makeMoreMaps = () => {
    _mapContariner.insertAdjacentHTML('beforeend', mapWithObstacle());
}


const mapWithObstacle = () => {
    let obstacle_type;
    const rand = Math.random() * 10;    // 0 - 9 random number 
    
    if (rand > 7){
        // many ices for 20%.
        obstacle_type = 'sm';
        return `
            <div class="map">
                <div class="obstacle ${obstacle_type}">${obstacle()}</div>
                <div class="obstacle ${obstacle_type}" style="left: 20px;">${obstacle()}</div>
                <div class="obstacle ${obstacle_type}" style="left: 50px;">${obstacle()}</div>
                <img class="map-background" src="images/map1.png">
            </div>`;
    }
    
    if (rand > 2){
        obstacle_type = 'sm';    // a ice 
    }else{
        obstacle_type = 'none';  // no ice 
    }

    return `<div class="map">
                <div class="obstacle ${obstacle_type}">${obstacle()}</div>
                <img class="map-background" src="images/map1.png">
            </div>`;
}


const obstacle = () => {
    return `
<svg
   width="210mm"
   height="297mm"
   viewBox="0 0 210 297"
   version="1.1"
   id="svg53"
   inkscape:version="1.1 (c4e8f9e, 2021-05-24)"
   sodipodi:docname="ice.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview55"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:document-units="mm"
     showgrid="false"
     inkscape:zoom="0.5077862"
     inkscape:cx="396.82056"
     inkscape:cy="561.25984"
     inkscape:window-width="1312"
     inkscape:window-height="792"
     inkscape:window-x="0"
     inkscape:window-y="25"
     inkscape:window-maximized="0"
     inkscape:current-layer="layer1" />
  <defs
     id="defs50" />
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <path
       d="M 44.828984,285.31612 C 45.442356,242.83385 25.411167,209.00182 12.264033,167.53462 9.1577398,157.7371 7.6010708,147.6009 5.5264562,137.59017 4.9797504,134.95213 5.0581773,132.22355 4.4035282,129.60499 4.2887031,129.14565 2.9979308,129.00467 3.2806002,128.60684 20.244527,104.73196 17.509999,117.38873 26.862115,89.679065 c 0.973973,-2.885813 0.38764,-6.04221 1.122929,-8.983347 0.08121,-0.324796 0.797938,-0.165128 1.122928,0 4.960786,2.519734 10.260003,4.680019 14.598084,7.985184 1.769235,1.347978 10.106361,13.530208 10.106361,9.981491 0,-0.998144 0,-1.996306 0,-2.99445 0.374312,-1.330871 1.039631,-2.622757 1.122933,-3.992592 4.253074,-69.938703 -3.110251,3.626208 5.614644,-64.879636 0.888225,-6.974111 1.53098,-13.971286 2.245863,-20.9611046 0.03388,-0.3313478 -0.324387,-1.1641715 0,-0.9981623 12.517233,6.4060669 24.556701,13.5303249 37.056667,19.9629799 1.744456,0.897706 4.084196,0.830237 5.614646,1.996287 1.27097,0.968354 1.75586,2.569809 2.24586,3.992592 10.74639,31.203982 22.46239,62.183797 31.44202,93.825943 1.04982,3.69933 -0.18323,37.66665 0,40.92409 0.0265,0.46994 1.12293,0.5276 1.12293,0.99814 0,0.33271 -1.21938,0.32149 -1.12293,0 3.02076,-10.06911 7.93573,-19.70367 10.10636,-29.94446 2.717,-12.81847 2.24154,-26.03804 4.49172,-38.927771 1.12764,-6.459532 3.40013,-12.731408 5.61463,-18.964817 0.11271,-0.317269 0.88332,-0.255604 1.12295,0 24.67169,26.316178 -8.66171,-4.577974 29.19614,30.942598 0.25746,0.24154 0.83539,-0.213 1.12295,0 4.68103,3.46738 9.16651,7.14977 13.47515,10.97963 6.92726,6.15749 -2.03429,17.32501 -3.36878,25.95186 -2.83386,18.31957 -6.1034,36.58426 -8.98344,54.89814 -1.98609,12.6294 -3.83521,25.27593 -5.61464,37.92964 -1.19495,8.49724 -2.95034,27.64442 -5.61466,35.93332 -1.14967,3.57677 -4.35444,6.43429 -5.61465,9.9815 -1.02068,2.87302 -0.0511,6.12507 -1.12291,8.98332 -0.23674,0.6313 -1.49742,0.0153 -2.24588,0 -16.46998,-0.31824 -32.93673,-0.78592 -49.40888,-0.99813 -20.263,-0.26103 -41.483904,-1.1265 -61.761116,0 -3.361262,0.18676 -12.219507,2.12901 -12.352222,1.9963 -2.59627,-2.59625 -2.245862,-6.65434 -3.368788,-9.98149 z"
       id="path94" />
  </g>
</svg>
    `;
}



const move = (speed) => {
    left = left - speed;
    _mapContariner.style.left = left + "px"; 
}

const progress = (speed) => {
    if (needMoreMaps()){
        makeMoreMaps();
        deleteOldMaps();
    }
    move(speed);
}

const Map = {
  progress: progress
}

export default Map
