// dataManager.js
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { db } from './firebaseConfig.js';
import { addToHistory } from './historyManager.js';

export let currentData = []; // 导出 currentData 以便其他模块访问

// 渲染软件列表
export function renderList(data) {
  const listContainer = document.getElementById('software-list');
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
      if (hostname.includes('lanzou')) {
        logoImg.src = '网盘图标/蓝奏.png';
      } else if (hostname.includes('baidu')) {
        logoImg.src = '网盘图标/百度.png';
      } else if (hostname.includes('quark')) {
        logoImg.src = '网盘图标/夸克.png';
      } else if (hostname.includes('123')) {
        logoImg.src = '网盘图标/123.png';
      } else if (hostname.includes('feiji')) {
        logoImg.src = '网盘图标/小飞机.png';
      } else if (hostname.includes('xunlei')) {
        logoImg.src = '网盘图标/迅雷.png';
      } else if (hostname.includes('ali')) {
        logoImg.src = '网盘图标/阿里.png';
      } else {
        logoImg.src = '网盘图标/默认.png';
      }
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
      addToHistory({ type: 'content', url: item.url });
      renderContent(item.url);
    });

    listContainer.appendChild(listItem);
  });
}

// 渲染内容到 iframe
export function renderContent(url) {
  const listContainer = document.getElementById('software-list');
  listContainer.innerHTML = `<iframe src="${url}" class="content-frame"></iframe>`;
}

// 获取数据
export function fetchData() {
  const sitesRef = ref(db, 'sites');
  onValue(sitesRef, (snapshot) => {
    currentData = []; // 清空并重新填充 currentData
    snapshot.forEach((childSnapshot) => {
      currentData.push(childSnapshot.val());
    });
    addToHistory({ type: 'list', data: currentData });
    renderList(currentData);
  });
}
