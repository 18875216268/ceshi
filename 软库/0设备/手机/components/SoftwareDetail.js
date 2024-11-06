import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

export default {
  template: `
    <div>
      <iframe :src="softwareUrl" class="content-frame" ref="iframe"></iframe>
    </div>
  `,
  data() {
    return {
      softwareUrl: '', // 软件库页面的直接 URL
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
          this.softwareUrl = software.url; // 直接加载初始软件库的 URL
        }
      });
    },
    handleIframeNavigation(event) {
      const iframeDocument = this.$refs.iframe.contentDocument || this.$refs.iframe.contentWindow.document;

      iframeDocument.addEventListener('click', (e) => {
        const target = e.target;
        
        // 如果点击的是一个链接
        if (target.tagName === 'A' && target.href) {
          e.preventDefault(); // 阻止默认行为
          this.softwareUrl = target.href; // 更新 iframe 中的 URL
          this.$refs.iframe.src = this.softwareUrl; // 在 iframe 中加载新页面
        }
      });
    }
  },
  mounted() {
    // 在 iframe 加载完内容后，开始监听其内部点击事件
    this.$refs.iframe.onload = () => {
      try {
        this.handleIframeNavigation();
      } catch (error) {
        console.warn("无法访问 iframe 内部内容，可能是由于跨域限制");
      }
    };
  },
};
