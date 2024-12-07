// 在 dataManager.js 中对点击事件进行修改，确保目录层级信息被正确存储到历史中
import { addToHistory } from './historyManager.js';

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
      addToHistory({ type: 'content', url: item.url }); // 将内容页面添加到历史
      renderContent(item.url);
    });

    listContainer.appendChild(listItem);
  });
}

export function renderContent(url) {
  const listContainer = document.getElementById('software-list');
  listContainer.innerHTML = `<iframe src="${url}" class="content-frame"></iframe>`;

  // 监听 iframe 内部的链接点击事件，确保子目录点击也被记录到历史中
  const iframe = listContainer.querySelector('iframe');
  iframe.onload = () => {
    try {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      iframeDocument.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A' && target.href) {
          e.preventDefault(); // 阻止默认跳转行为
          addToHistory({ type: 'content', url: target.href });
          renderContent(target.href); // 在 iframe 中加载新页面
        }
      });
    } catch (error) {
      console.warn('无法访问 iframe 内部内容，可能是由于跨域限制');
    }
  };
}
