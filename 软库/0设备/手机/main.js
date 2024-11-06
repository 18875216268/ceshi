import { createApp } from 'https://unpkg.com/vue@3.2.31/dist/vue.esm-browser.js';
import { createRouter, createWebHashHistory } from 'https://unpkg.com/vue-router@4.0.12/dist/vue-router.esm-browser.js';
import SoftwareList from './components/SoftwareList.js';
import SoftwareDetail from './components/SoftwareDetail.js';

// Firebase 导入
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Firebase 配置
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

// Firebase 初始化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 路由配置
const routes = [
  { path: '/', component: SoftwareList },
  { path: '/software/:id', component: SoftwareDetail },
];

// 创建 Vue Router 实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 创建 Vue 应用
const vueApp = createApp({
  data() {
    return { softwareCount: 0 };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    goHome() {
      this.$router.push('/');
    },
    goForward() {
      this.$router.forward();
    },
  },
});

vueApp.provide('db', db); // 提供 Firebase 数据库实例给所有组件使用
vueApp.use(router);
vueApp.mount('#app');
