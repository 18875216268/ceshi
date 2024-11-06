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
  created() {
    this.loadSoftware();
  },
  methods: {
    loadSoftware() {
      const db = this.$root.$options.provides.db;
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
