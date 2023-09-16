const _menuList = document.getElementById("menu-list")

const menus = [
    { name: '닭볶음', tags: [], image: ''  },
    { name: '미역국', tags: [], image: ''  },
    { name: '또띠아', tags: [], image: ''  },
    { name: '샌드위치', tags: [], image: 'http://www.kbsm.net/data/newsThumb/1564131103ADD_thumb580.jpg', tags: [] },
    { name: '또띠아', tags: [], image: 'http://www.nhtortilla.com/child/img/main/v1.jpg'  }
]
const drawMenu = (m) => {
    return `
        <li>
        <img src="${m.image}"/>
            ${m.name}

        </li>
    `
}
menus.forEach(m => {
    _menuList.insertAdjacentHTML("beforeend", drawMenu(m));
})


// _searchInput.addEventListener("keyup", suggester.suggest);