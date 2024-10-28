import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Firebase 配置
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "DOMAIN",
    databaseURL: "DB_URL",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    measurementId: "MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const itemsPerPage = 8;
let currentPage = 1;

function loadSoftwareList() {
    const softwareListRef = ref(database, 'sites');
    onValue(softwareListRef, (snapshot) => {
        const softwareList = snapshot.val();
        const container = document.getElementById('software-list');
        container.innerHTML = '';
        if (!softwareList) return container.innerHTML = '<p>没有可显示的软件</p>';

        const keys = Object.keys(softwareList);
        const totalPages = Math.ceil(keys.length / itemsPerPage);

        generatePaginationControls(totalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        keys.slice(startIndex, endIndex).forEach(key => {
            const item = softwareList[key];
            const div = document.createElement('div');
            div.className = 'software-item';
            div.setAttribute('onclick', `window.open('${item.url}', '_blank')`);
            div.innerHTML = `<img src="${item.icon}" alt="${item.name}"><span class="name">${item.name}</span>`;
            container.appendChild(div);
        });
    });
}

function generatePaginationControls(totalPages) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button' + (i === currentPage ? ' current-page' : '');
        button.onclick = () => {
            currentPage = i;
            loadSoftwareList();
        };
        paginationControls.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', loadSoftwareList);

function goBack() {
    window.history.back();
}
function closeModal() {
    document.getElementById('announcement-modal').classList.remove('show');
}
function confirmAccess() {
    closeModal();
}
