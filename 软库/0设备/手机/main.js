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
    return { softwareCount: 0 };
  },
  methods: {
    goBack() {
      if (this.$router.options.history.state.back) { // 检查是否有内部页面导航
        this.$router.back();
      }
    },
    goHome() {
      this.$router.push('/');
    },
    goForward() {
      this.$router.forward();
    },
  },
});

vueApp.provide('db', db);
vueApp.use(router);
vueApp.mount('#app');
