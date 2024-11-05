import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => { // 页面加载完成后运行的主函数
  const listContainer = document.getElementById('software-list'); // 获取显示软件列表的容器
  const searchButton = document.getElementById('search-btn'); // 获取搜索按钮
  const searchInput = document.getElementById('search-input'); // 获取搜索输入框
  const homeButton = document.getElementById('home-btn'); // 获取主页按钮
  const backButton = document.getElementById('back-btn'); // 获取返回按钮
  const forwardButton = document.getElementById('forward-btn'); // 获取前进按钮

  let currentData = []; // 保存当前软件数据的数组
  let history = []; // 保存历史导航记录的数组
  let historyIndex = -1; // 记录当前在历史记录中的位置

  const renderList = (data) => { // 渲染软件列表的函数
    document.getElementById('count').textContent = data.length; // 更新显示的软件数量
    listContainer.innerHTML = ''; // 清空列表容器的内容

    if (data.length === 0) { // 如果数据为空，显示“未搜索到软件库”的提示
      listContainer.innerHTML = '<p>未搜索到软件库</p>';
      return;
    }

    data.forEach(item => { // 遍历每个软件数据项
      const listItem = document.createElement('div'); // 创建列表项的容器
      listItem.classList.add('software-item'); // 为列表项添加样式类

      const logoImg = document.createElement('img'); // 创建图标元素
      try {
        const url = new URL(item.url); // 尝试解析URL
        const hostname = url.hostname; // 获取URL的主机名
        if (hostname.includes('lanzou')) {
          logoImg.src = '网盘图标/蓝奏.png'; // 蓝奏云图标
        } else if (hostname.includes('baidu')) {
          logoImg.src = '网盘图标/百度.png'; // 百度网盘图标
        } else if (hostname.includes('quark')) {
          logoImg.src = '网盘图标/夸克.png'; // 夸克网盘图标
        } else if (hostname.includes('123')) {
          logoImg.src = '网盘图标/123.png'; // 123网盘图标
        } else if (hostname.includes('feiji')) {
          logoImg.src = '网盘图标/小飞机.png'; // 小飞机网盘图标
        } else if (hostname.includes('xunlei')) {
          logoImg.src = '网盘图标/迅雷.png'; // 迅雷网盘图标
        } else if (hostname.includes('ali')) {
          logoImg.src = '网盘图标/阿里.png'; // 阿里网盘图标
        } else {
          logoImg.src = '网盘图标/默认.png'; // 默认图标
        }
      } catch (e) {
        console.error('Invalid URL:', item.url); // 捕获URL解析错误
        logoImg.src = '网盘图标/默认.png'; // 使用默认图标
      }
      logoImg.alt = 'Logo'; // 设置图标的alt属性
      logoImg.classList.add('software-logo'); // 为图标添加样式类

      const textLogoContainer = document.createElement('div'); // 创建容器，包含图标和软件名称
      textLogoContainer.classList.add('text-logo-container'); // 为容器添加样式类
      textLogoContainer.appendChild(logoImg); // 将图标添加到容器

      const textDiv = document.createElement('div'); // 创建显示软件名称的元素
      textDiv.classList.add('software-text'); // 为软件名称添加样式类
      textDiv.textContent = item.name; // 设置软件名称
      textLogoContainer.appendChild(textDiv); // 将名称添加到容器

      const loadTime = document.createElement('div'); // 创建显示加载时间的元素
      loadTime.classList.add('load-time'); // 为加载时间添加样式类
      loadTime.textContent = Math.floor(Math.random() * 100) + ' ms'; // 随机生成加载时间

      listItem.appendChild(textLogoContainer); // 将图标和名称容器添加到列表项
      listItem.appendChild(loadTime); // 将加载时间添加到列表项

      listItem.addEventListener('click', () => { // 为列表项添加点击事件
        history = history.slice(0, historyIndex + 1); // 截断历史记录到当前位置
        history.push({ type: 'content', url: item.url }); // 将当前内容推入历史
        historyIndex++; // 更新历史索引
        renderContent(item.url); // 渲染内容
      });

      listItem.addEventListener('mouseenter', () => { // 为列表项添加鼠标悬停事件
        listItem.style.backgroundColor = '#e0e0e0'; // 修改背景颜色
      });

      listItem.addEventListener('mouseleave', () => { // 为列表项添加鼠标离开事件
        listItem.style.backgroundColor = 'transparent'; // 恢复背景颜色
      });

      listContainer.appendChild(listItem); // 将列表项添加到列表容器
    });
  };

  const renderContent = (url) => { // 渲染内容函数
    listContainer.innerHTML = `<iframe src="${url}" class="content-frame"></iframe>`; // 使用iframe加载内容
  };

  const fetchData = () => { // 从Firebase获取数据的函数
    const sitesRef = ref(db, 'sites'); // 引用Firebase数据库中的“sites”节点
    onValue(sitesRef, (snapshot) => { // 监听数据变化
      currentData = []; // 清空当前数据
      snapshot.forEach((childSnapshot) => { // 遍历数据节点
        const childData = childSnapshot.val(); // 获取每个子节点的数据
        currentData.push(childData); // 将数据添加到当前数据数组
      });
      history = history.slice(0, historyIndex + 1); // 更新历史记录
      history.push({ type: 'list', data: currentData }); // 添加当前数据到历史
      historyIndex++; // 更新历史索引
      renderList(currentData); // 渲染数据列表
    });
  };

  searchButton.addEventListener('click', () => { // 为搜索按钮添加点击事件
    const isVisible = searchInput.style.display === 'block'; // 检查搜索输入框是否可见
    searchInput.style.display = isVisible ? 'none' : 'block'; // 切换输入框的可见性
    if (isVisible) { // 如果输入框已经可见
      const query = searchInput.value.toLowerCase().trim(); // 获取输入内容并转换为小写
      if (query) { // 如果有输入内容
        const filteredData = currentData.filter(item => item.name.toLowerCase().includes(query)); // 过滤符合条件的数据
        renderList(filteredData); // 渲染过滤后的数据列表
      } else {
        renderList(currentData); // 渲染原始数据列表
      }
    }
  });

  homeButton.addEventListener('click', () => { // 为主页按钮添加点击事件
    window.location.href = 'https://www.quruanpu.cn'; // 跳转到指定主页
  });

  backButton.addEventListener('click', () => { // 为返回按钮添加点击事件
    if (historyIndex > 0) { // 如果有历史记录可以返回
      historyIndex--; // 更新历史索引
      const previousState = history[historyIndex]; // 获取上一个历史状态
      if (previousState.type === 'list') { // 如果是列表状态
        renderList(previousState.data); // 渲染列表
      } else if (previousState.type === 'content') { // 如果是内容状态
        renderContent(previousState.url); // 渲染内容
      }
    }
  });

  forwardButton.addEventListener('click', () => { // 为前进按钮添加点击事件
    if (historyIndex < history.length - 1) { // 如果有历史记录可以前进
      historyIndex++; // 更新历史索引
      const nextState = history[historyIndex]; // 获取下一个历史状态
      if (nextState.type === 'list') { // 如果是列表状态
        renderList(nextState.data); // 渲染列表
      } else if (nextState.type === 'content') { // 如果是内容状态
        renderContent(nextState.url); // 渲染内容
      }
    }
  });

  fetchData(); // 初始获取数据
});
