// 删除 eventHandlers.js 中对 currentData 的无效导入
import { goBack, goForward, goHome } from './historyManager.js';
import { renderList, renderContent } from './dataManager.js';

// 设置事件绑定
export function setupEventHandlers() {
  const homeButton = document.getElementById('home-btn');
  const backButton = document.getElementById('back-btn');
  const forwardButton = document.getElementById('forward-btn');

  homeButton.addEventListener('click', () => goHome(renderList, history[0].data)); // 回到主页
  backButton.addEventListener('click', () => goBack(renderList, renderContent)); // 返回上一个页面
  forwardButton.addEventListener('click', () => goForward(renderList, renderContent)); // 前进到下一个页面
}

// 初始化数据和事件
document.addEventListener('DOMContentLoaded', () => {
  setupEventHandlers(); // 绑定事件
});
