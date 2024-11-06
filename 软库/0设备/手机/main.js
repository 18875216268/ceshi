import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
import SoftwareList from './components/SoftwareList.js';
import SoftwareDetail from './components/SoftwareDetail.js';

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

const routes = [
  { path: '/', component: SoftwareList },
  { path: '/software/:id', component: SoftwareDetail },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

const vueApp = Vue.createApp({
  data() {
    return { 
      softwareCount: 0,
      historyStack: [], // 用于记录完整的历史栈
      currentIndex: -1  // 用于跟踪当前历史位置
    };
  },
  watch: {
    // 监听路由变化，每次导航都记录在历史栈中
    '$route'(to) {
      if (this.currentIndex === this.historyStack.length - 1) {
        // 如果当前索引在栈顶，直接添加新记录
        this.historyStack.push(to.path);
        this.currentIndex++;
      } else {
        // 如果在栈中间导航，截断栈并添加新记录
        this.historyStack = this.historyStack.slice(0, this.currentIndex + 1);
        this.historyStack.push(to.path);
        this.currentIndex++;
      }
    }
  },
  methods: {
    goBack() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.$router.push(this.historyStack[this.currentIndex]);
      }
    },
    goHome() {
      this.$router.push('/');
      this.historyStack = ['/'];
      this.currentIndex = 0;
    },
    goForward() {
      if (this.currentIndex < this.historyStack.length - 1) {
        this.currentIndex++;
        this.$router.push(this.historyStack[this.currentIndex]);
      }
    },
  },
});

vueApp.provide('db', db);
vueApp.use(router);
vueApp.mount('#app');
