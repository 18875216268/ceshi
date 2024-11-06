// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase 配置信息
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

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // 导出数据库实例
