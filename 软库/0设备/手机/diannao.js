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

const itemsPerPage = 1; // 每页显示 1 个软件块
let currentPage = 1; // 当前页码，默认第一页
let previousPage = 1; // 记录前一页的页码，初始为第一页
let historyStack = []; // 用于记录用户操作历史
let futureStack = []; // 用于记录用户前进操作

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

        const startIndex = (currentPage - 1) * itemsPerPage; // 当前页的起始索引
        const endIndex = startIndex + itemsPerPage; // 当前页的结束索引
        const currentKeys = keys.slice(startIndex, endIndex); // 获取当前页的软件列表

        currentKeys.forEach((key) => {
            const item = softwareList[key]; // 获取软件条目
            const iframe = document.createElement('iframe'); // 创建一个内嵌框架用于展示内容
            iframe.className = '软件库块class'; // 设置样式类
            iframe.setAttribute('src', item.url); // 设置 iframe 跳转的链接
            iframe.setAttribute('frameborder', '0'); // 设置边框为 0
            iframe.setAttribute('width', '100%'); // 使其宽度为 100%
            iframe.setAttribute('height', '500px'); // 高度 500px
            container.appendChild(iframe); // 将 iframe 添加到容器中
        });
    });
}

// 导航栏的操作函数
function navigateBack() {
    if (historyStack.length > 0) {
        futureStack.push(currentPage); // 将当前页码放入前进栈
        currentPage = historyStack.pop(); // 从历史栈中弹出页码
        loadSoftwareList(); // 重新加载软件列表
    }
}

function navigateForward() {
    if (futureStack.length > 0) {
        historyStack.push(currentPage); // 将当前页码放入历史栈
        currentPage = futureStack.pop(); // 从前进栈中弹出页码
        loadSoftwareList(); // 重新加载软件列表
    }
}

function goHome() {
    currentPage = 1; // 设置页码为第一页
    loadSoftwareList(); // 重新加载软件列表
}

// 初次加载软件列表
loadSoftwareList();

// 记录用户的操作历史
function updateHistory() {
    historyStack.push(previousPage); // 将前一页放入历史栈中
    previousPage = currentPage; // 更新前一页的页码
}
