import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDk5p6EJAe02LEeqhQm1Z1dZxlIqGrRcUo",
  authDomain: "asqrt-ed615.firebaseapp.com",
  databaseURL: "https://asqrt-ed615-default-rtdb.firebaseio.com",
  projectId: "asqrt-ed615",
  storageBucket: "asqrt-ed615.firebasestorage.app",
  messagingSenderId: "131720495048",
  appId: "1:131720495048:web:35f43929e31c1cc3428afd",
  measurementId: "G-G7D5HRMF0E"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('software-list');
  const contentFrame = document.getElementById('content-frame'); // iframe 元素，用于显示网页内容
  const homeButton = document.getElementById('home-btn');
  const backButton = document.getElementById('back-btn');
  const forwardButton = document.getElementById('forward-btn');

  let currentData = [];
  let history = [];
  let historyIndex = -1;

  const renderList = (data) => {
    document.getElementById('count').textContent = data.length;
    listContainer.innerHTML = '';

    if (data.length === 0) {
      listContainer.innerHTML = '<p>未搜索到软件库</p>';
      return;
    }

    data.forEach(item => {
      const listItem = document.createElement('div');
      listItem.classList.add('software-item');

      const logoImg = document.createElement('img');
      try {
        const url = new URL(item.url);
        const hostname = url.hostname;
        logoImg.src = getLogoUrl(hostname);
      } catch (e) {
        console.error('Invalid URL:', item.url);
        logoImg.src = '网盘图标/默认.png';
      }
      logoImg.alt = 'Logo';
      logoImg.classList.add('software-logo');

      const textLogoContainer = document.createElement('div');
      textLogoContainer.classList.add('text-logo-container');
      textLogoContainer.appendChild(logoImg);

      const textDiv = document.createElement('div');
      textDiv.classList.add('software-text');
      textDiv.textContent = item.name;
      textLogoContainer.appendChild(textDiv);

      const loadTime = document.createElement('div');
      loadTime.classList.add('load-time');
      loadTime.textContent = Math.floor(Math.random() * 100) + ' ms';

      listItem.appendChild(textLogoContainer);
      listItem.appendChild(loadTime);

      listItem.addEventListener('click', () => {
        history = history.slice(0, historyIndex + 1);
        history.push({ type: 'content', url: item.url });
        historyIndex++;
        loadContentInIframe(item.url); // 加载内容到 iframe
      });

      listContainer.appendChild(listItem);
    });
  };

  const loadContentInIframe = (url) => {
    contentFrame.src = url; // 设置 iframe 的 src 为点击的软件库链接
    contentFrame.style.display = 'block'; // 显示 iframe
    listContainer.style.display = 'none'; // 隐藏软件列表

    // 添加事件监听器，拦截 iframe 内部链接点击事件
    contentFrame.onload = () => {
      contentFrame.contentWindow.document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') { // 检查是否为链接
          e.preventDefault(); // 阻止默认跳转行为
          loadContentInIframe(e.target.href); // 加载新链接到 iframe 中
        }
      });
    };
  };

  const getLogoUrl = (hostname) => {
    if (hostname.includes('lanzou')) return '网盘图标/蓝奏.png';
    if (hostname.includes('baidu')) return '网盘图标/百度.png';
    if (hostname.includes('quark')) return '网盘图标/夸克.png';
    if (hostname.includes('123')) return '网盘图标/123.png';
    if (hostname.includes('feiji')) return '网盘图标/小飞机.png';
    if (hostname.includes('xunlei')) return '网盘图标/迅雷.png';
    if (hostname.includes('ali')) return '网盘图标/阿里.png';
    return '网盘图标/默认.png';
  };

  const fetchData = () => {
    const sitesRef = ref(db, 'sites');
    onValue(sitesRef, (snapshot) => {
      currentData = [];
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        currentData.push(childData);
      });
      history = history.slice(0, historyIndex + 1);
      history.push({ type: 'list', data: currentData });
      historyIndex++;
      renderList(currentData);
    });
  };

  homeButton.addEventListener('click', () => {
    window.location.href = 'https://www.quruanpu.cn';
  });

  backButton.addEventListener('click', () => {
    if (historyIndex > 0) {
      historyIndex--;
      const previousState = history[historyIndex];
      if (previousState.type === 'list') {
        contentFrame.style.display = 'none';
        listContainer.style.display = 'block';
        renderList(previousState.data);
      } else if (previousState.type === 'content') {
        loadContentInIframe(previousState.url);
      }
    }
  });

  forwardButton.addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      const nextState = history[historyIndex];
      if (nextState.type === 'list') {
        contentFrame.style.display = 'none';
        listContainer.style.display = 'block';
        renderList(nextState.data);
      } else if (nextState.type === 'content') {
        loadContentInIframe(nextState.url);
      }
    }
  });

  fetchData();
});
