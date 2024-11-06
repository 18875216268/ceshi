import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

export default {
  template: `
    <div>
      <iframe ref="iframe" :src="softwareUrl" class="content-frame"></iframe>
    </div>
  `,
  data() {
    return {
      softwareUrl: '', // 软件库初始 URL
    };
  },
  inject: ['db'], // 注入 Firebase 数据库实例
  created() {
    this.loadSoftware();
  },
  methods: {
    loadSoftware() {
      const db = this.db;
      const softwareId = this.$route.params.id;
      const softwareRef = ref(db, `sites/${softwareId}`);
      
      onValue(softwareRef, (snapshot) => {
        const software = snapshot.val();
        if (software) {
          this.softwareUrl = software.url;
        }
      });
    },
    handleIframeNavigation(event) {
      const iframeDocument = this.$refs.iframe.contentDocument || this.$refs.iframe.contentWindow.document;

      iframeDocument.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A' && target.href) {
          e.preventDefault(); // 阻止默认跳转行为
          this.softwareUrl = target.href; // 更新 iframe 中的 URL
          this.$refs.iframe.src = this.softwareUrl; // 在 iframe 中加载新页面
        }
      });
    }
  },
  mounted() {
    // 在 iframe 加载完内容后，开始监听其内部点击事件
    this.$refs.iframe.onload = () => {
      this.handleIframeNavigation();
    };
  },
};
