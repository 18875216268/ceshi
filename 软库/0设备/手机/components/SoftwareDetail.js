import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

export default {
  template: `
    <div>
      <iframe ref="iframe" :src="softwareUrl" class="content-frame"></iframe>
    </div>
  `,
  data() {
    return {
      softwareUrl: '', // 初始化软件库页面 URL
    };
  },
  inject: ['db'],
  created() {
    this.loadSoftware(); // 加载软件库页面
  },
  methods: {
    loadSoftware() {
      const db = this.db;
      const softwareId = this.$route.params.id;
      const softwareRef = ref(db, `sites/${softwareId}`);
      
      onValue(softwareRef, (snapshot) => {
        const software = snapshot.val();
        if (software) {
          const targetUrl = software.url;
          // 使用代理服务器地址，转发目标 URL
          this.softwareUrl = `https://daili-ruanjianku.vercel.app/proxy?url=${encodeURIComponent(targetUrl)}`;
        }
      });
    },
    handleIframeNavigation(event) {
      const iframeDocument = this.$refs.iframe.contentDocument || this.$refs.iframe.contentWindow.document;

      iframeDocument.addEventListener('click', (e) => {
        const target = e.target;

        // 判断点击的是链接且有 href
        if (target.tagName === 'A' && target.href) {
          e.preventDefault(); // 阻止默认行为
          const targetUrl = target.href;
          // 使用代理服务器地址转发新链接 URL
          this.softwareUrl = `https://daili-ruanjianku.vercel.app/proxy?url=${encodeURIComponent(targetUrl)}`;
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
