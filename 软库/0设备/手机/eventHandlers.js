// eventHandlers.js
import { goBack, goForward, goHome } from './historyManager.js';
import { fetchData, renderList, renderContent, currentData } from './dataManager.js'; // 导入 currentData

// 设置事件绑定
export function setupEventHandlers() {
  const homeButton = document.getElementById('home-btn');
  const backButton = document.getElementById('back-btn');
  const forwardButton = document.getElementById('forward-btn');

  homeButton.addEventListener('click', () => goHome(renderList, currentData));
  backButton.addEventListener('click', () => goBack(renderList, renderContent));
  forwardButton.addEventListener('click', () => goForward(renderList, renderContent));
}

// 初始化数据和事件
document.addEventListener('DOMContentLoaded', () => {
  fetchData(); // 获取并渲染软件列表
  setupEventHandlers(); // 绑定事件
});
