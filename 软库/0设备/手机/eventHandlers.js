// eventHandlers.js
import { goBack, goForward, goHome } from './historyManager.js';
import { fetchData, renderList } from './dataManager.js';

export function setupEventHandlers(currentData) {
  document.getElementById('home-btn').addEventListener('click', () => goHome(renderList, currentData));
  document.getElementById('back-btn').addEventListener('click', () => goBack(renderList, renderContent));
  document.getElementById('forward-btn').addEventListener('click', () => goForward(renderList, renderContent));
}

// 初始化数据和事件
document.addEventListener('DOMContentLoaded', () => {
  fetchData(); // 获取并渲染软件列表
  setupEventHandlers(); // 绑定事件
});
