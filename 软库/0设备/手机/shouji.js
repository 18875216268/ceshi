
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

    document.addEventListener('DOMContentLoaded', () => {
      const listContainer = document.getElementById('software-list');
      const searchButton = document.getElementById('search-btn');
      const searchInput = document.getElementById('search-input');
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
            logoImg.src = '网盘图标/默认.png'; // Provide a fallback icon
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
            renderContent(item.url);
          });

          listItem.addEventListener('mouseenter', () => {
            listItem.style.backgroundColor = '#e0e0e0';
          });

          listItem.addEventListener('mouseleave', () => {
            listItem.style.backgroundColor = 'transparent';
          });

          listContainer.appendChild(listItem);
        });
      };

      const renderContent = (url) => {
        listContainer.innerHTML = `<iframe src="${url}" class="content-frame"></iframe>`;
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

      searchButton.addEventListener('click', () => {
        const isVisible = searchInput.style.display === 'block';
        searchInput.style.display = isVisible ? 'none' : 'block';
        if (isVisible) {
          const query = searchInput.value.toLowerCase().trim();
          if (query) {
            const filteredData = currentData.filter(item => item.name.toLowerCase().includes(query));
            renderList(filteredData);
          } else {
            renderList(currentData);
          }
        }
      });

      homeButton.addEventListener('click', () => {
        window.location.href = 'https://www.quruanpu.cn';
      });

      backButton.addEventListener('click', () => {
        if (historyIndex > 0) {
          historyIndex--;
          const previousState = history[historyIndex];
          if (previousState.type === 'list') {
            renderList(previousState.data);
          } else if (previousState.type === 'content') {
            renderContent(previousState.url);
          }
        }
      });

      forwardButton.addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          const nextState = history[historyIndex];
          if (nextState.type === 'list') {
            renderList(nextState.data);
          } else if (nextState.type === 'content') {
            renderContent(nextState.url);
          }
        }
      });

      fetchData();
    });
