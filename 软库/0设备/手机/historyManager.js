// historyManager.js
export let history = [];
export let historyIndex = -1;

// 添加记录到历史
export function addToHistory(state) {
  history = history.slice(0, historyIndex + 1);
  history.push(state);
  historyIndex++;
}

// 返回到上一个页面
export function goBack(renderList, renderContent) {
  if (historyIndex > 0) {
    historyIndex--;
    const previousState = history[historyIndex];
    if (previousState.type === 'list') {
      renderList(previousState.data);
    } else if (previousState.type === 'content') {
      renderContent(previousState.url);
    }
  }
}

// 前进到下一个页面
export function goForward(renderList, renderContent) {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    const nextState = history[historyIndex];
    if (nextState.type === 'list') {
      renderList(nextState.data);
    } else if (nextState.type === 'content') {
      renderContent(nextState.url);
    }
  }
}

// 返回主页
export function goHome(renderList, data) {
  renderList(data);
  history = [{ type: 'list', data }];
  historyIndex = 0;
}
