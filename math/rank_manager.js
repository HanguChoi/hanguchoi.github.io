const APP_LOCAL_STORAGE_KEY = 'https://hanguchoi.github.io/math/high_scores'
const HIGH_SCORES_LIMIT = 5;
const _RankContainer = document.getElementById("high-score");


const store = {
    loadTopRanked: () => {
        const topRankedJson = (localStorage.getItem(APP_LOCAL_STORAGE_KEY) || '[]');
        return JSON.parse(topRankedJson);
    },
    saveTopRanked: (tr) => {
        tr = tr.slice(0, HIGH_SCORES_LIMIT);
        localStorage.setItem(APP_LOCAL_STORAGE_KEY, JSON.stringify(tr))
    },
    clear: () => {
        localStorage.removeItem(APP_LOCAL_STORAGE_KEY);
        // localStorage.removeItem('https://hanguchoi.github.io/penguin/high_scores');
        alert("LocalStorage cache data has been removed successfully");
    }
}

const setRank = (curScore, curLevel, curMathType) => {
    let ranked = false;
    let prevScore;
    const tr = store.loadTopRanked();

    for (let i = 0; i < tr.length ;  i++){
        prevScore = tr[i].score;
        if (!ranked && curScore > prevScore){
            tr.splice(i, 0, rank(getPlayerName(), curScore, scoreDetail(curLevel, curMathType)));
            ranked = true;
        }
    }

    if (!ranked && tr.length < HIGH_SCORES_LIMIT){
        tr.push(rank(getPlayerName(), curScore, scoreDetail(curLevel, curMathType)))
    }

    store.saveTopRanked(tr);
    renderRanks(tr);
}

const getPlayerName = () => {
	while(!name){
    var name = prompt('Enter your name');
	};
	return name;
}

const scoreDetail = (curLevel, curMathType) => {
	return `Level ${curLevel} ${curMathType}`;
}

const renderRank = (rank, ps) => {
    return `
        <p title="${ps.detail}">
            <span class="rank">${rank}</span>
            <span class="player">${ps.player}</span>
            <span class="score">${ps.score}</span>
        </p>
    `;
}

// `---` is the default text for no data
const rank = (name = ' --- ', score = ' --- ', detail = '') => {
    return { player: name, score: score, detail: detail };
};

const renderRanks = (tr) => {
    _RankContainer.innerHTML = "";
    for (let i = 0; i < HIGH_SCORES_LIMIT; i++) {
        let r = (tr[i] || rank());
        _RankContainer.insertAdjacentHTML("beforeend", renderRank((i+1), r));
    }
}

const showTopRanks = () => {
  renderRanks(store.loadTopRanked());
}
const resetTopRanks = () => {
  store.clear();
}

document.getElementById("reset-top-ranked").addEventListener("click", function () {
  RankManager.resetTopRanks();
  window.location.reload();
})

const RankManager = {
  showTopRanks: showTopRanks,
  setRank: setRank,
  resetTopRanks: resetTopRanks
}

export default RankManager
