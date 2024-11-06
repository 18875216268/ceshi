// historyManager.js
export let history = [];
export let historyIndex = -1;

// 添加记录到历史栈
export function addToHistory(state) {
  // 如果当前不在栈顶，截断栈，保证前进后只能回到新记录
  history = history.slice(0, historyIndex + 1);
  history.push(state);
  historyIndex++;
}

// 返回到上一个页面
export function goBack(renderList, renderContent) {
  if (historyIndex > 0) {
    historyIndex--; // 更新当前索引
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
    historyIndex++; // 更新当前索引
    const nextState = history[historyIndex];
    if (nextState.type === 'list') {
      renderList(nextState.data);
    } else if (nextState.type === 'content') {
      renderContent(nextState.url);
    }
  }
}

// 返回主页并清空历史栈
export function goHome(renderList, data) {
  renderList(data); // 渲染主页内容
  history = [{ type: 'list', data }]; // 将主页设置为历史栈的唯一记录
  historyIndex = 0; // 重置索引
}
