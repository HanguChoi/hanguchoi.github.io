const APP_LOCAL_STORAGE_KEY = 'https://hanguchoi.github.io/penguin/high_scores'
const HIGH_SCORES_LIMIT = 3;
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

const setRank = (curScore) => {
    let ranked = false;
    let prevScore;
    const tr = store.loadTopRanked();
        
    for (let i = 0; i < tr.length ;  i++){
        prevScore = tr[i].score;
        if (!ranked && curScore > prevScore){
            tr.splice(i, 0, rank(getPlayerName(), curScore));
            ranked = true;
        }
    }
    
    if (!ranked && tr.length < HIGH_SCORES_LIMIT){
        tr.push(rank(getPlayerName(), curScore))
    }
      
    store.saveTopRanked(tr);
    renderRanks(tr);
}

const getPlayerName = () => {
    return prompt("Enter your name");
}

const renderRank = (rank, ps) => {
    return `
        <p>
            <span class="rank">${rank}</span>
            <span class="player">${ps.player}</span>
            <span class="score">${ps.score}</span>
        </p>
    `;
}

// `---` is the default text for no data
const rank = (name = ' --- ', score = ' --- ') => {
    return { player: name, score: score };
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
 
const RankManager = {
  showTopRanks: showTopRanks,
  setRank: setRank,
  resetTopRanks: resetTopRanks
}

export default RankManager
