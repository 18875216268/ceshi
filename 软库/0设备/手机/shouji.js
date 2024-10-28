// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDk5p6EJAe02LEeqhQm1Z1dZxlIqGrRcUo",
    authDomain: "asqrt-ed615.firebaseapp.com",
    databaseURL: "https://asqrt-ed615-default-rtdb.firebaseio.com",
    projectId: "asqrt-ed615",
    storageBucket: "asqrt-ed615.appspot.com",
    messagingSenderId: "131720495048",
    appId: "1:131720495048:web:35f43929e31c1cc3428afd",
    measurementId: "G-G7D5HRMF0E"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const itemsPerPage = 20;
let currentPage = 1;
let previousPage = 1;

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

document.getElementById("clearSearchBtn").addEventListener("click", clearSearch);
document.getElementById("searchInput").addEventListener("input", loadSoftwareList);
document.getElementById("loadMoreBtn").addEventListener("click", () => {
    currentPage++;
    loadSoftwareList();
});
document.getElementById("favoritesBtn").addEventListener("click", showFavorites);
document.getElementById("historyBtn").addEventListener("click", showHistory);

function loadSoftwareList() {
    const softwareListRef = database.ref('sites');
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();

    softwareListRef.once('value', (snapshot) => {
        const softwareList = snapshot.val();
        if (!softwareList) {
            document.getElementById("software-list").innerHTML = '<p>没有可显示的软件库</p>';
            return;
        }

        const container = document.getElementById("software-list");
        container.innerHTML = '';

        const keys = Object.keys(softwareList).filter(key => 
            softwareList[key].name.toLowerCase().includes(searchQuery)
        );

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentKeys = keys.slice(startIndex, endIndex);

        currentKeys.forEach((key) => {
            const item = softwareList[key];
            const div = document.createElement("div");
            div.className = "software-item";
            div.innerHTML = `
                <a href="${item.url}" target="_blank">${item.name}</a>
                <span class="icon-favorite" onclick="toggleFavorite('${key}')">⭐</span>
                <span class="icon-history" onclick="addHistory('${key}')">📜</span>
            `;
            container.appendChild(div);
        });

        previousPage = currentPage;
    });
}

function clearSearch() {
    document.getElementById("searchInput").value = '';
    currentPage = 1;
    loadSoftwareList();
}

function toggleFavorite(key) {
    const index = favorites.indexOf(key);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(key);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function addHistory(key) {
    if (!history.includes(key)) {
        history.push(key);
    }
    localStorage.setItem('history', JSON.stringify(history));
}

function showFavorites() {
    const container = document.getElementById("software-list");
    container.innerHTML = '';
    favorites.forEach(key => {
        const div = document.createElement("div");
        div.className = "software-item";
        div.innerHTML = `<a href="#" target="_blank">${key}</a>`;
        container.appendChild(div);
    });
}

function showHistory() {
    const container = document.getElementById("software-list");
    container.innerHTML = '';
    history.forEach(key => {
        const div = document.createElement("div");
        div.className = "software-item";
        div.innerHTML = `<a href="#" target="_blank">${key}</a>`;
        container.appendChild(div);
    });
}

// 初次加载软件列表
loadSoftwareList();
