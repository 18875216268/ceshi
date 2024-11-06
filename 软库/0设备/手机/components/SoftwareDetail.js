import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

export default {
  template: `
    <div>
      <iframe ref="iframe" :src="softwareUrl" class="content-frame"></iframe>
    </div>
  `,
  data() {
    return {
      softwareUrl: '', // 当前软件库页面的 URL
    };
  },
  inject: ['db'], // 注入 Firebase 数据库实例
  created() {
    this.loadSoftware(); // 初始化加载软件库页面
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
    handleIframeNavigation() {
      const iframeDocument = this.$refs.iframe.contentDocument || this.$refs.iframe.contentWindow.document;

      iframeDocument.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.tagName === 'A' && target.href) {
          event.preventDefault(); // 阻止默认行为
          this.softwareUrl = target.href; // 更新 iframe 的 URL
          this.$refs.iframe.src = this.softwareUrl; // 在 iframe 中加载新内容
        }
      });
    }
  },
  mounted() {
    this.$refs.iframe.onload = () => {
      this.handleIframeNavigation(); // 监听 iframe 内的导航事件
    };
  },
};
