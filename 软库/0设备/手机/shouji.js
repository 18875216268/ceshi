// shouji.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Firebase 应用的配置参数
const firebaseConfig = {
    apiKey: "AIzaSyDk...您的API密钥",
    authDomain: "asqrt-ed615.firebaseapp.com",
    databaseURL: "https://asqrt-ed615-default-rtdb.firebaseio.com",
    projectId: "asqrt-ed615",
    storageBucket: "asqrt-ed615.appspot.com",
    messagingSenderId: "131720495048",
    appId: "1:131720495048:web:35f43929e31c1cc3428afd",
    measurementId: "G-G7D5HRMF0E"
};

// 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const itemsPerPage = 8; // 每页最多显示 8 个软件块
let currentPage = 1;

function loadSoftwareList() {
    const softwareListRef = ref(database, 'sites');
    onValue(softwareListRef, (snapshot) => {
        const softwareList = snapshot.val();
        if (!softwareList) {
            document.getElementById('软件列表id').innerHTML = '<p>没有可显示的软件库</p>';
            document.getElementById('pagination-controls').innerHTML = '';
            return;
        }

        const container = document.getElementById('软件列表id');
        container.innerHTML = '';
        const keys = Object.keys(softwareList);
        const totalPages = Math.ceil(keys.length / itemsPerPage);

        generatePaginationControls(totalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentKeys = keys.slice(startIndex, endIndex);

        currentKeys.forEach((key) => {
            const item = softwareList[key];
            const div = document.createElement('div');
            div.className = '软件库块class';
            div.setAttribute('role', 'listitem');
            div.setAttribute('tabindex', '0');
            div.setAttribute('onclick', `window.open('${item.url}', '_blank')`);
            div.innerHTML = `<span class="文字class">${item.name}</span>`;
            container.appendChild(div);
        });

        // 填充空白块以保持布局一致
        const remainingItems = itemsPerPage - currentKeys.length;
        if (remainingItems > 0) {
            for (let i = 0; i < remainingItems; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = '软件库块class';
                emptyDiv.style.visibility = 'hidden';
                container.appendChild(emptyDiv);
            }
        }
    });
}

function generatePaginationControls(totalPages) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';

    const visibleButtonCount = 3;
    let startPage = Math.max(1, currentPage - Math.floor(visibleButtonCount / 2));
    let endPage = Math.min(totalPages, startPage + visibleButtonCount - 1);

    if (endPage - startPage + 1 < visibleButtonCount) {
        startPage = Math.max(1, endPage - visibleButtonCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.disabled = i === currentPage;
        button.className = 'pagination-button';
        if (i === currentPage) {
            button.classList.add('current-page');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            loadSoftwareList();
        });
        paginationControls.appendChild(button);
    }
}

loadSoftwareList();
