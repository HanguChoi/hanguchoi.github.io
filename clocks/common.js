const _tabButtons = document.querySelectorAll(".tab-btn");
const _tabs = {
    clock: document.querySelector("#clock"),
    timer: document.querySelector("#timer"),
    countdown: document.querySelector("#countdown")
}

function openTab(){
    let tabBtn = this; 
    if (tabBtn === window){
        tabBtn = _tabButtons[0];
    }

    const tabName = tabBtn.dataset.name;

    Object.keys(_tabButtons).forEach(k => _tabButtons[k].parentNode.classList.remove("active"));
    Object.keys(_tabs).forEach(k => _tabs[k].style.display = "none");

    tabBtn.parentNode.classList.add("active");
    _tabs[tabName].style.display = "block";

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

const enableBtn = (_btn) => {
    _btn.disabled = false;
    _btn.classList.remove("disabled");
} 

const disableBtn = (_btn) => {
    _btn.disabled = true;
    _btn.classList.add("disabled");
}

_tabButtons.forEach(button => button.addEventListener("click", openTab));
openTab();