// diannao.js
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
const database = getDatabase(app); // 获取数据库实例

// 加载软件列表数据
function loadSoftwareList() {
    const softwareListRef = ref(database, 'sites'); // 从 Firebase 数据库获取 'sites' 节点的数据
    onValue(softwareListRef, (snapshot) => {
        const softwareList = snapshot.val(); // 获取所有软件的列表数据
        if (!softwareList) {
            // 如果数据库中没有数据，则显示无数据信息
            document.getElementById('软件列表id').innerHTML = '<p>没有可显示的软件库</p>';
            return;
        }

        const container = document.getElementById('软件列表id'); // 获取软件块的容器元素
        container.innerHTML = ''; // 清空容器内容
        const keys = Object.keys(softwareList); // 获取所有软件的 key

        keys.forEach((key) => {
            const item = softwareList[key]; // 获取软件条目
            const div = document.createElement('div'); // 创建一个新的 div 元素
            div.className = '软件库块class'; // 设置样式类
            div.innerHTML = `<span class="特效class 文字class">${item.name}</span>`; // 显示软件名称
            div.setAttribute('role', 'listitem'); // 为无障碍支持设置 role 属性
            div.setAttribute('tabindex', '0'); // 可通过键盘导航
            container.appendChild(div); // 将新软件块添加到容器中
        });
    });
}

// 初次加载软件列表
loadSoftwareList();
