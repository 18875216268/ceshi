export default {
  template: `
    <div>
      <iframe :src="softwareUrl" class="content-frame"></iframe>
    </div>
  `,
  data() {
    return {
      softwareUrl: '',
    };
  },
  inject: ['db'], // 注入 Firebase 数据库实例
  created() {
    this.loadSoftware();
  },
  methods: {
    loadSoftware() {
      const db = this.db; // 使用注入的 db 实例
      const softwareId = this.$route.params.id;
      const softwareRef = ref(db, `sites/${softwareId}`);
      
      onValue(softwareRef, (snapshot) => {
        const software = snapshot.val();
        if (software) {
          this.softwareUrl = software.url;
        }
      });
    },
  },
};
