/*
    Point Calculation Summary (Code line ordered)
    
    Sum                                                                     - 141 points
    
    Use a built-in method for the document object                           - 2 points
    Create an object literal                                                - 2 points
    Use a global variable                                                   - 2 points
    Use an object                                                           - 2 points
    Create an object using a constructor                                    - 5 points
    
    Use an array                                                            - 2 points
    Custom Function                                                         - 2 points
    Use the 'this' keyword effectively                                      - 5 points 
    A custom function using parameters                                      - 5 points
    Use a locally scoped variable                                           - 2 points
    
    Use querySelectorAll()                                                  - 2 points
    Use the innerHTML property                                              - 2 points
    Access an objects property using dot notation                           - 2 points
    Use a built-in method for the Math object (Math.max)                    - 2 points
    Access a built-in property for the window object (window.innerWidth)    - 2 points 
    
    Use the event stopPropagation() method                                  - 10 points
    Use a logical OR operator (||)                                          - 5 points 
    Use the event Target property                                           - 5 points
    Access an objects method using dot notation                             - 2 points
    Use a logical NOT operator                                              - 5 points
    
    Use a 3rd party API                                                     - 10 points 
    Use a built-in method for the string object (toLowerCase())             - 2 points
    Use comments throughout                                                 - 5 points
    Use a Try … Catch statement                                             - 5 points 
    Use a switch statement with at least 3 cases and 1 default              - 10 points
    
    Use an object with a method (function property)                         - 5 points
    Use an If statement                                                     - 5 points
    Use a built-in method for the Date object                               - 2 points
    Create a Date object                                                    - 5 points
    Use local/session storage                                               - 5 points
    
    Use an If … Else statement                                              - 5 points
    Use a keydown/keyup/keypress event                                      - 2 points
    Use the addEventListener() method                                       - 2 points
    Use a Click event                                                       - 2 points
    Use an Immediately Invoked Function Expression (IFFE)                   - 10 points 
    
*/



// Use a built-in method for the document object - 2 points
const _main = document.querySelector("main");
const _overlay = document.querySelector("#overlay");
const _searchInput = document.querySelector("#search");
const _suggestContainer = document.querySelector("#suggest-container");
const _aboveRanks = document.querySelector("#above-ranks");
const _detailImages = document.querySelector("#detail-images");
const _detail = document.querySelector("#detail");
const _resultContainer = document.querySelector("#result-container");
const _moreBtn = document.querySelector("#more-btn");
const _removeCacheBtn = document.querySelector("#remove-cache-btn");

const TAXONOMIC_RANKS = [
    'DOMAIN',
    'KINGDOM',
    'PHYLUM',
    'CLASS',
    'ORDER',
    'FAMILY',
    'GENUS',
    'SPECIES'
];

// Create an object literal - 2 points
const DOMAIN_TAXON = {
    key: "domain",
    datasetKey: "d7dddbf4-2cf0-4f39-9b2a-bb099caae36c",
    rank: "DOMAIN",
    canonicalName: "Domain"
};

// Use a global variable - 2 points
// Some constants
const DETAIL_IMAGE_SIZE = 20;
const IMAGE_SIZE_OF_CHILD = 7;
const RANK_CHILDREN_PAGE_SIZE = 8; 
const ABOVE_RANK_HEIGHT = 40;  // px

// APP_NAME is Used for localStorage key
const APP_NAME = 'NoahsArk';

const MEDIA_QUERY_VIEW = {
  DESKTOP: "desktop",   
  MOBILE: "mobile"  
}
let curView;



// Use an object - 2 points
// Create an object using a constructor - 5 points
// Initial current setting
let current = new Object();
current.key = "";
current.datasetKey = "";
current.rank = "";
current.page = 1;


// Use an array - 2 points
let aboveRanks = [];

// Custom Function - 2 points
function onChildBtnClick() {    
    // Use the 'this' keyword effectively - 5 points 
    childSelected(this.dataset);
}

function onRankBtnClick() {
    setCurrent(this.dataset);
    clearView();
    aboveRanksChanged();
    window.scrollTo(0,0);
    showDetail();
    if (!isSpecies(current.rank)){
        showRankChildren();
    }else{
        _resultContainer.innerHTML = '<li><div class="nodata">No Children Data</div></li>';
    }
}

function onMoreBtnClick() {
    current.page += 1; 
    showRankChildren();
}

// A custom function using parameters - 5 points
const childSelected = (taxon) => {
    addToAboveRanks(taxon);
    
    // addEventListener to dynamic dom.
    // Use a locally scoped variable - 2 points
    const _rankBtn = document.querySelector(`#rank-btn-${taxon.key}`);
    _rankBtn.addEventListener("click", onRankBtnClick);
    
    // trigger onRankBtnClick 
    _rankBtn.click();  
}

const addToAboveRanks = (taxon) => {
    aboveRanks.push({ 
        key: taxon.key,
        datasetKey: taxon.datasetKey,
        rank: taxon.rank,
        canonicalName: taxon.canonicalName
    })
    _aboveRanks.insertAdjacentHTML("beforeend", renderAboveRank(taxon));
}

const clearView = () => {
    _moreBtn.classList.remove("active");
    removeBelowRanks();
    _detail.innerHTML = "";
    _detailImages.innerHTML = "";
    _resultContainer.innerHTML = "";
} 

const removeBelowRanks = () => {
    const idx = aboveRanks.map(r => r.rank).indexOf(current.rank);
    aboveRanks.length = (idx + 1);
    
    // Use querySelectorAll() - 2 points
    document.querySelectorAll(`li.rank-${current.rank.toLowerCase()} ~ li`).forEach(li => {
        li.remove();
    });
    aboveRanksChanged();
}

const showDetail = async () => {
    if (current.key != DOMAIN_TAXON.key){
        const imgUrls = await getDetailImages();
        _detailImages.innerHTML = renderImages({ 
            sampleImgUrls: imgUrls, 
            canonicalName: current.canonicalName 
        });
    }
    
    const result = await getDetail(current.key);
    renderDetail(result);
} 

const showRankChildren = async () => {
    showLoading();
    const result = await getRankChildren();
    renderChildren(result);
    hideLoading();
}

const setMainMarginTop = () => {
    if (curView == MEDIA_QUERY_VIEW.DESKTOP){
        _main.style.marginTop = "0px";
    }else{
        // This is needed to move below the main element properly 
        // because the position of header element is fixed.
        const rows = aboveRanks.length + 1;  // + 1 for search row
        _main.style.marginTop = `${ABOVE_RANK_HEIGHT * rows}px`;    
    }
}

const aboveRanksChanged = () => {
    if (curView == MEDIA_QUERY_VIEW.DESKTOP){
        // nothing to do 
        return;
    }
    setMainMarginTop();
}

const getDetail = (key) => {
    return getCachedResult(`detail/${key}`, getDetailFromAPI, { key: key });
}

const getDetailImages = () => {
    return getCachedResult(
        `detailImage/${current.key}`, 
        getSampleImgUrlFromAPI, 
        { key: current.key, size: DETAIL_IMAGE_SIZE }
    );
}

const getRankChildren = () => {
    return getCachedResult(rankChildrenCacheKey(), getRankChildrenFromAPI, {});
}

const getCachedResult =  (cacheKey, api, apiArgs) => {
    return new Promise((resolve, reject) => {
        
        const cached = localStorageCache.fetch(cacheKey);
        if (cached){
            resolve(cached);
            
        }else{
            api(apiArgs)
            .then(result => {
                localStorageCache.write(cacheKey, result)
                resolve(result)
            });
        }
    });
};

const rankChildrenCacheKey = () => {
    return [
        "children",
        current.key,
        RANK_CHILDREN_PAGE_SIZE,
        current.page
    ].join("/");    
}

const buildRankChild = (r, allSampleImages) => {
    // build and merge child data with images 
    return {
        datasetKey: r.datasetKey,
        key: r.key,
        rank: r.rank,
        canonicalName: r.canonicalName,
        sampleImgUrls: allSampleImages.find(o => o.key == r.key).imgUrls
    }
}

const getSampleImages = (taxonKeys) => {
    return new Promise((resolve, reject) => {
        let imagesForAllToxonKeys = [];
        
        taxonKeys.forEach(key => {
            
            // loop and call api for each taxon key
            // resolve when all api call done.
            // This is for performance.
            getSampleImgUrlFromAPI({ key: key, size: IMAGE_SIZE_OF_CHILD })
            .then(imgUrls => {
                imagesForAllToxonKeys.push({ key: key, imgUrls: imgUrls });
                if(taxonKeys.length == imagesForAllToxonKeys.length){
                    resolve(imagesForAllToxonKeys);   
                }
            });
        });
    });
}

const getDetailFromAPI = async (opts) => {
    return new Promise((resolve, reject) => {
        
        if (opts.key == DOMAIN_TAXON.key){
            // No detail API is provided for Domain rank.
            resolve({
                key: opts.key,
                canonicalName: opts.key
            });
            return;
        }
        
        const url = `https://api.gbif.org/v1/species/${opts.key}`;

        api.fetchJson(url)
        .then(json => {
            // filter data to reduce cache size.
            resolve({
                key: json.key,
                datasetKey: json.datasetKey,
                canonicalName: json.canonicalName,
                vernacularName: json.vernacularName,
                authorship: json.authorship,
                publishedIn: json.publishedIn
            });
            
        });
    });
}

const getRankChildrenFromAPI = async () => {
    return new Promise((resolve, reject) => {
        
        let url; 
        if (current.key == DOMAIN_TAXON.key){
            // Only for domain rank, below `species/key/children` api is not provided. So, we use this api.
            url = `https://api.gbif.org/v1/species/search?dataset_key=${current.datasetKey}&rank=${childRank(current.rank)}&limit=${RANK_CHILDREN_PAGE_SIZE}&offset=${offset(current.page)}`;
            
        } else {
            // This api is good to use so keep stick to this.
            url = `https://api.gbif.org/v1/species/${current.key}/children?rank=${childRank(current.rank)}&limit=${RANK_CHILDREN_PAGE_SIZE}&offset=${offset(current.page)}`;
        }

        api.fetchJson(url)
        .then(json => {
            if (json.results.length <= 0){
                resolve({
                    count: 0,
                    endOfRecords: json.endOfRecords,
                    children: []
                });    
            }
            
            // call and get images by all keys
            const taxonKeys = json.results.map(r => r.key);
            
            getSampleImages(taxonKeys)
            .then(allSampleImages => {
                const rankChildren = json.results.map(r => buildRankChild(r, allSampleImages));
                resolve({
                    count: json.count,
                    endOfRecords: json.endOfRecords,
                    children: rankChildren
                });
            });

        });
    });
}

const getSampleImgUrlFromAPI = (opts)=> {
    
    const url = `https://api.gbif.org/v1/occurrence/search?limit=${opts.size}&media_type=stillImage&taxon_key=${opts.key}`;
    
    return fetch(url, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(json => {
        return json.results.slice(0, opts.size).map(r => {
            return `https://api.gbif.org/v1/image/unsafe/fit-in/500x/${r.media[0].identifier}`; 
        });
    });
}

const renderAboveRank = (taxon) => {
    return `
        <li class="rank-${taxon.rank.toLowerCase()}">
            <button id="rank-btn-${taxon.key}" \
                data-key="${taxon.key}" \
                data-dataset-key="${taxon.datasetKey}" \
                data-rank="${taxon.rank}" \
                data-canonical-name="${taxon.canonicalName}" 
            >
                <span class="rank">${taxon.rank}</span><span class="canonical-name">${taxon.canonicalName}</span> 
            </button>
        </li>
    `;
}

const renderDetail = (r) => {
    // Use the innerHTML property - 2 points
    _detail.innerHTML = `
        ${r.canonicalName ? `<p>Canonical Name: <span class="canonical">${r.canonicalName}</span></p>` : ""}
        ${r.vernacularName ? `<p>Common Name: <span class="common">${r.vernacularName}</span></p>` : ""}
        ${r.authorship ? `<p>Authorship: ${r.authorship}</p>` : ""}
        ${r.publishedIn ? `<p>Published In: ${r.publishedIn}</p>` : ""}
    `;
}

const renderChildren = (result) => {
    if (result.endOfRecords){
        _moreBtn.classList.remove("active");
    }else{
        _moreBtn.classList.add("active");
    }
    
    result.children.forEach(c => {
        _resultContainer.insertAdjacentHTML("beforeend", renderChild(c));    
    })
    
    // addEventListener to dynamic dom.
    document.querySelectorAll(".child-btn").forEach(btn => {
        btn.addEventListener("click", onChildBtnClick)
    });
}

const renderChild = (r) => {
    return `
        <li>
            <a class="child-btn" href="javascript:void(0);" \  
                data-key="${r.key}" \
                data-dataset-key="${r.datasetKey}" \
                data-rank="${r.rank}" \
                data-canonical-name="${r.canonicalName}" \
            >
                <div>
                    <ul class="child-images">
                        ${renderImages(r)}
                    </ul>
                </div>
                <div class="desc-wrap">
                    <p class="rank">${r.rank}</p>
                    <p class="canonical-name">${r.canonicalName}</p>
                </div>
            </a>
        </li>
    `;
}

const renderImages = (r) => {
    if (r.sampleImgUrls.length == 0){
        // if no images, render three default images
        return [1,2,3].map(() => {
            return `
            <li>
                <img src="image_error_default.png" width="auto" height="100px" alt="No image available" /> 
            </li>
            `; 
        }).join("\n");
    }
    
    return r.sampleImgUrls.map(imgUrl => {
       return `
        <li>
            <img src="${imgUrl}" width="auto" height="100px" alt="Image for ${r.canonicalName}" onerror="this.src='image_error_default.png'; this.onerror = null" /> 
        </li>
        `; 
    }).join("\n");
}

const setCurrent = (taxon) => {
    
    // Access an objects property using dot notation - 2 points
    current.key = taxon.key;
    current.datasetKey = taxon.datasetKey;
    current.rank = taxon.rank;
    current.canonicalName = taxon.canonicalName;
    current.page = 1;
}


const offset = (page) => {
    return (page - 1) * RANK_CHILDREN_PAGE_SIZE;
}

const isSpecies = (rank) => {
    return (rank === TAXONOMIC_RANKS[TAXONOMIC_RANKS.length - 1]);
}

const childRank = (curRank) => {
    const childIndex = TAXONOMIC_RANKS.indexOf(curRank) + 1;
    return TAXONOMIC_RANKS[childIndex];
}

const showLoading = () => {
    _overlay.classList.add("active");
}

const hideLoading = () => {
    _overlay.classList.remove("active");
}

const resizeHandler = () => {
    if (isViewChanged()){
        // Only set margin when view changed
        setMainMarginTop();
    }
}

const isViewChanged = () => {
    const view = getMediaQueryView();
    if (curView != view){
        curView = view;
        return true;
    }else{
        return false;
    }
}

// Reference: https://stackoverflow.com/a/8876069
const getMediaQueryView = () => {
    // Use a built-in method for the Math object (Math.max) - 2 points
    // Access a built-in property for the window object (window.innerWidth) - 2 points 
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (vw >= 768 ){
        return MEDIA_QUERY_VIEW.DESKTOP;
    }else{
        return MEDIA_QUERY_VIEW.MOBILE;
    }
}

const api = {
    fetchJson: async (url) => {
        return fetch(url, {
                headers: { 'Content-Type': 'application/json' },
            })
        .then(response => response.json())
    }
}

const suggester = {
    suggestResultsTempStore: {},
    suggest: async (e) => {
        
        // Use the event stopPropagation() method - 10 points
        e.stopPropagation();
        e.preventDefault();
        
        // Use a logical OR operator (||) - 5 points 
        if (e.key == "Down" || e.key == "ArrowDown"){
            // select first item
            const first = document.querySelector("#suggest-container li");
            first.classList.add("active");
            first.childNodes[1].focus();
            return;
        }
        
        // Use the event Target property - 5 points
        const q = e.target.value;
        
        // Access an objects method using dot notation - 2 points
        let results = await suggester.api(q);
        const synonym = suggester.synonym(q);
        if (synonym){
            const recommends = await suggester.api(synonym);
            const keys = results.map(r => r.key);
            recommends.slice(0,3).forEach(r => {
                
                // Use a logical NOT operator - 5 points
                if (!keys.includes(r.key)){
                    
                    // set recommend result above
                    results.unshift({ ...r, commonName: q  });
                }
            })
        }
        
        suggester.saveSuggestResults(results);
        suggester.renderSuggest(q, results);
        suggester.addEventListener();
    },
    api: (q) => {
        return new Promise((resolve, reject) => {
            
            // Use a 3rd party API - 10 points 
            api.fetchJson(`https://api.gbif.org/v1/species/suggest?q=${q}`)
            .then(json => {
                // Currently, detailed taxon is not supported. e.g. Subspecies, etc..
                const filtered = json.filter(r => TAXONOMIC_RANKS.includes(r.rank));
                resolve(filtered);
            })
        });
    },
    renderSuggest: (q, results) => {
        _suggestContainer.innerHTML = results.map((r) => {
            return suggester.suggestView(q, r);
        }).join("\n");
    },
    saveSuggestResults: (results) => {
        // Use temp objest to store suggest results. 
        // Many properties will be needed soon.
        results.forEach(r => {
           suggester.suggestResultsTempStore[r.key] = r; 
        });
    },
    suggestView: (q, r) => {
        
        // Use a built-in method for the string object (toLowerCase()) - 2 points
        return `
            <li class="rank-${r.rank.toLowerCase()}">
                <button data-key="${r.key}">
                    <p class="rank">${r.rank}</p>
                    <p class="canonical-name">
                        ${suggester.highlight(q, r.canonicalName)}
                    </p>
                    ${r.commonName ? `<p class="common-name">(${suggester.highlight(q, r.commonName)})</p>` : ''}
                </button>
            </li>
        `;
    },
    addEventListener: () => {
        document.querySelectorAll("#suggest-container button").forEach(btn => {
            btn.addEventListener("click", suggester.selected);
            btn.addEventListener("keydown", suggester.suggestControl);
        })
    },
    selected: function(e) {
        e.stopPropagation();
        e.preventDefault();
        let selectedTaxonKey;
        if (this.dataset){
            selectedTaxonKey = this.dataset.key;
        }else{
            selectedTaxonKey = e.target.dataset.key;
        }
        
        // Add taxon and all above taxon to the ranks 
        suggester.addAllHigherTaxaToAboveRanks(selectedTaxonKey);
        _searchInput.value = "";
        _suggestContainer.innerHTML = "";
        
    },
    addAllHigherTaxaToAboveRanks: (selectedTaxonKey) => {
        // We don't have dataset-key here, so we call api for each higher ranks.
        // calling 7-8 apis might takes quite long time. 
        // So, add view first with existing data and attach dataset-key when api call finished
        const selectedTaxon = suggester.suggestResultsTempStore[selectedTaxonKey];
        suggester.suggestResultsTempStore = {}; // Empty temp store. We don't need it anymore.
        
        
        // first, add to ranks and call api for current taxon
        setCurrent(selectedTaxon);
        // slice from 1 because we'll deal with domain separately
        const higher = TAXONOMIC_RANKS.slice(1, TAXONOMIC_RANKS.indexOf(current.rank));
        aboveRanks = [];
        _aboveRanks.innerHTML = "";
        const _rankBtn = suggester.addToAboveRanksAfterbegin(selectedTaxon);

        getDetail(current.key)
        .then(taxon => {
            // now we can set datasetKey  
            setCurrent({...selectedTaxon, datasetKey: taxon.datasetKey});
            _rankBtn.setAttribute("data-dataset-key", taxon.datasetKey)
            _rankBtn.click();  // trigger should be after settting datasetKey
        });
        
        // second, add all higher taxa to the above ranks view
        const _higherRankButtons = {}
        higher.reverse().forEach(rank => {
            const lowerRank= rank.toLowerCase();
            
            _higherRankButtons[rank] = suggester.addToAboveRanksAfterbegin({
                key: selectedTaxon[`${lowerRank}Key`],
                datasetKey: "",
                rank: rank, 
                canonicalName: selectedTaxon[lowerRank]
            });
        })
        // add domain
        suggester.addToAboveRanksAfterbegin(DOMAIN_TAXON);
                                             
        // finally, call api for all higher taxa and set dataset-key
        // Use comments throughout - 5 points
        higher.forEach(rank => {
            const lowerRank= rank.toLowerCase();
            key = selectedTaxon[`${lowerRank}Key`]
            getDetail(key)
            .then(taxon => {
                _higherRankButtons[rank].setAttribute("data-dataset-key", taxon.datasetKey);
            });
        });
    },
    addToAboveRanksAfterbegin: (taxon) => {
        aboveRanks.unshift({ 
            key: taxon.key,
            datasetKey: taxon.datasetKey,
            rank: taxon.rank,
            canonicalName: taxon.canonicalName
        });
        _aboveRanks.insertAdjacentHTML("afterbegin", renderAboveRank(taxon));

        // addEventListener to dynamic dom.
        const _rankBtn = document.querySelector(`#rank-btn-${taxon.key}`);
        _rankBtn.addEventListener("click", onRankBtnClick);
        return _rankBtn;
    },
    suggestControl: (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        switch (e.key) {
            case "Down": // IE/Edge specific value
            case "ArrowDown": 
                suggester.move('down');
                break;
                
            case "Up": // IE/Edge specific value
            case "ArrowUp": 
                suggester.move('up');
                break;
                
            case "Enter":
                suggester.selected(e);
            default: return;
        }
    },
    move: (direction) => {
        let curActive;
        const prevActive = document.querySelector("#suggest-container li.active");
        prevActive.classList.remove("active");
        
        if (direction == 'up'){
            curActive = prevActive.previousElementSibling;    
        }else {
            curActive = prevActive.nextElementSibling;
        }
        
        curActive.classList.add("active");
        curActive.childNodes[1].focus();   // Focus to the button element.
    },
    highlight: (q, text) => {
        
        // Use a Try … Catch statement - 5 points 
        try {
            const reg = new RegExp(q, "i");  
            return text.replace(reg, `<span class="q">${q}</span>`);
        } catch(error) {
            return text;
        }
    },
    synonym: (q) => {
        /* 
            Typical user might not find what they want 
            because there are many unexpected names like a tiger == panthera tigris
            So, here we provide simple synonym for recommendation.
        */
        // Use a switch statement with at least 3 cases and 1 default - 10 points
        switch(q){
            case "tiger":
                return "panthera tigris";
            case "lion":
                return "panthera leo";
            case "bird":
                return "aves";
            case "eagle":
                return "accipitridae";
            case "frog":
                return "anura";
            default: 
                return null;
        }
    }
    
}

const localStorageCache = {
    
    /*
        To check if the app using to many spaces in the localStorage, 
        Run below snippet in the console.
        Reference: https://stackoverflow.com/a/15720835
        
        
        var _lsTotal = 0,
            _xLen, _x;
        for (_x in localStorage) {
            if (!localStorage.hasOwnProperty(_x)) {
                continue;
            }
            _xLen = ((localStorage[_x].length + _x.length) * 2);
            _lsTotal += _xLen;
            console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB")
        };
        console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
        
        
    */
    
    
    // We can expire cache by changing the version
    version: 1,    
    
    // Use an object with a method (function property) - 5 points
    fetch: (key) => {
        const isTooOldStore = (cacheStore) => {
            // Use an If statement - 5 points
            if (cacheStore.version < localStorageCache.version){
                return true;
            }
            
            // Use a built-in method for the Date object (getTime()) - 2 points
            const diff = new Date(cacheStore.createdAt).getTime() - new Date().getTime()
            if (diff > 90 * 24 * 60 * 60 * 1000){
                // Consider 90 days ago data as too old.
                return true;
            }
            return false;
        }
        
        const cacheStoreJson = localStorage.getItem(APP_NAME);
        if (!cacheStoreJson){
            // No localStorage data
            return null;
        }
        const cacheStore = JSON.parse(cacheStoreJson);
        if (isTooOldStore(cacheStore)){
            // Delete all cache if data is too old.
            localStorage.removeItem(APP_NAME);
            return null;
        }
        
        const cached = cacheStore[key];
        if (!cached){   
            // no cahced data for the key
            return null;
        }
        
        // Create a Date object - 5 points
        if (new Date(cached.expires_at) > new Date()){
            // cache expired 
            return null;
        }
        
        return cached.value;
    },
    
    write: (key, value) => {
        
        let cacheStore;
        // Use local/session storage - 5 points
        const cacheStoreJson = localStorage.getItem(APP_NAME);
        
        if (!cacheStoreJson){
            // Init cacheStore
            cacheStore = { 
                version: localStorageCache.version,
                createdAt: new Date().toString() 
            }
        
        }else{
            // Use an If … Else statement - 5 points
            cacheStore = JSON.parse(cacheStoreJson);
        }
        
        cacheStore[key] = {
            value: value,
            expires_at: new Date().toString()
        }
        
        localStorage.setItem(APP_NAME, JSON.stringify(cacheStore));
    },
    
    clear: () => {
        localStorage.removeItem(APP_NAME);
        alert("LocalStorage cache data has been removed successfully");
    }
    
}
   

// Use a keydown/keyup/keypress event - 2 points
// Use the addEventListener() method - 2 points
_searchInput.addEventListener("keyup", suggester.suggest);

// Use a Click event - 2 points
_moreBtn.addEventListener("click", onMoreBtnClick);
_removeCacheBtn.addEventListener("click", () => localStorageCache.clear());
window.addEventListener('resize', resizeHandler);

// Use an Immediately Invoked Function Expression (IFFE) - points 10
(function(){
    // Init with Domain rank
    curView = getMediaQueryView();
    childSelected(DOMAIN_TAXON);
    
    console.log("** Noah's Ark - Taxonomic Rank Explorer **");
    console.log("** This app is responsive. **");
    console.log("** This app can use local storage a lot. if you want to delete local storage data, please click the remove cache button on the top right. **")
})();  


    

