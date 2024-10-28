import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 顶部搜索框的显示/隐藏
function toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer.style.display === 'none' || !searchContainer.style.display) {
        searchContainer.style.display = 'flex';
    } else {
        searchContainer.style.display = 'none';
    }
}

// 搜索功能
function searchSoftware() {
    const query = document.getElementById('search-box').value.toLowerCase();
    const softwareListRef = ref(database, 'sites');
    onValue(softwareListRef, (snapshot) => {
        const softwareList = snapshot.val();
        if (!softwareList) return;

        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; // 清空之前的搜索结果
        Object.values(softwareList).forEach(software => {
            if (software.name.toLowerCase().includes(query)) {
                const div = document.createElement('div');
                div.className = 'software-item';
                div.textContent = software.name;
                div.onclick = () => loadSoftware(software.url);
                resultsContainer.appendChild(div);
            }
        });
    });
}

// 加载软件库
function loadSoftwareList() {
    const softwareListRef = ref(database, 'sites');
    onValue(softwareListRef, (snapshot) => {
        const softwareList = snapshot.val();
        if (!softwareList) {
            document.getElementById('software-list').innerHTML = '<p>没有可显示的软件库</p>';
            return;
        }

        const container = document.getElementById('software-list');
        container.innerHTML = ''; // 清空之前的列表
        Object.values(softwareList).forEach(software => {
            const div = document.createElement('div');
            div.className = 'software-item';
            div.textContent = software.name;
            div.onclick = () => loadSoftware(software.url);
            container.appendChild(div);
        });
    });
}

// 在内嵌界面加载软件
function loadSoftware(url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'embedded-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '80vh';
    iframe.style.border = 'none';

    const container = document.getElementById('software-list');
    container.innerHTML = ''; // 清空并嵌入 iframe
    container.appendChild(iframe);
}

// 底部按钮的功能实现
function goHome() {
    window.location.href = '../../../../index.html';
}

function goBack() {
    window.history.back();
}

function goForward() {
    window.history.forward();
}

// 初次加载软件列表
window.onload = () => {
    loadSoftwareList();
    document.getElementById('search-container').style.display = 'none'; // 初始隐藏搜索框
};
