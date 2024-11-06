import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

export default {
  template: `
    <div ref="iframeContainer">
      <iframe :src="softwareUrl" class="content-frame" ref="iframe"></iframe>
    </div>
  `,
  data() {
    return {
      softwareUrl: '', // 初始软件库页面的直接 URL
    };
  },
  inject: ['db'],
  created() {
    this.loadSoftware(); // 加载初始软件库页面
  },
  methods: {
    loadSoftware() {
      const db = this.db;
      const softwareId = this.$route.params.id;
      const softwareRef = ref(db, `sites/${softwareId}`);
      
      onValue(softwareRef, (snapshot) => {
        const software = snapshot.val();
        if (software) {
          this.softwareUrl = software.url; // 设置初始 URL
        }
      });
    },
    loadNewIframe(url) {
      // 移除旧的 iframe
      const iframeContainer = this.$refs.iframeContainer;
      const oldIframe = this.$refs.iframe;
      if (oldIframe) {
        iframeContainer.removeChild(oldIframe);
      }

      // 创建新的 iframe
      const newIframe = document.createElement("iframe");
      newIframe.src = url; // 设置新的 URL
      newIframe.className = "content-frame"; // 设定样式类
      newIframe.ref = "iframe"; // 更新 ref，以便下次操作时引用此 iframe
      iframeContainer.appendChild(newIframe);
    },
    handleIframeNavigation() {
      // 监听 iframe 内部的点击事件
      const iframeDocument = this.$refs.iframe.contentDocument || this.$refs.iframe.contentWindow.document;

      iframeDocument.addEventListener('click', (e) => {
        const target = e.target;

        // 如果点击的是链接
        if (target.tagName === 'A' && target.href) {
          e.preventDefault(); // 阻止默认跳转行为
          const targetUrl = target.href; // 获取目标 URL
          this.loadNewIframe(targetUrl); // 在新 iframe 中加载链接内容
        }
      });
    }
  },
  mounted() {
    // 在 iframe 加载完成后开始监听点击事件
    this.$refs.iframe.onload = () => {
      try {
        this.handleIframeNavigation();
      } catch (error) {
        console.warn("无法访问 iframe 内部内容，可能是由于跨域限制");
      }
    };
  }
};
