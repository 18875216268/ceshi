import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Firebase 应用的配置参数
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

// 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 加载软件列表数据
function loadSoftwareList() {
    const softwareListRef = ref(database, 'sites');
    onValue(softwareListRef, (snapshot) => {
        const softwareList = snapshot.val();
        const container = document.getElementById('软件列表id');
        container.innerHTML = '';

        if (!softwareList) {
            container.innerHTML = '<p>没有可显示的软件库</p>';
            return;
        }

        const keys = Object.keys(softwareList);
        keys.forEach((key) => {
            const item = softwareList[key];
            const div = document.createElement('div');
            div.className = '软件库块class';
            div.innerHTML = `<span class="特效class 文字class">${item.name}</span>`;
            div.setAttribute('role', 'listitem');
            div.setAttribute('tabindex', '0');

            // 添加点击事件监听器
            div.addEventListener('click', () => {
                if (item.url) {
                    window.open(item.url, '_blank'); // 打开软件的链接
                } else {
                    alert('未找到该软件的链接');
                }
            });

            container.appendChild(div);
        });
    });
}

// 初次加载软件列表
loadSoftwareList();
