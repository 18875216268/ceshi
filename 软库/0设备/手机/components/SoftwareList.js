export default {
  template: `
    <div>
      <div v-if="softwareItems.length === 0">未搜索到软件库</div>
      <div v-else>
        <div v-for="item in softwareItems" :key="item.id" class="software-item" @click="viewSoftware(item)">
          <img :src="getLogoUrl(item.url)" class="software-logo" alt="Logo">
          <div class="software-text">{{ item.name }}</div>
          <div class="load-time">{{ getRandomLoadTime() }}</div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      softwareItems: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const db = this.$root.$options.provides.db;
      const sitesRef = ref(db, 'sites');
      onValue(sitesRef, (snapshot) => {
        this.softwareItems = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          this.softwareItems.push({ id: childSnapshot.key, name: item.name, url: item.url });
        });
        this.$root.softwareCount = this.softwareItems.length; // 更新软件数量
      });
    },
    getLogoUrl(url) {
      const hostname = new URL(url).hostname;
      if (hostname.includes('lanzou')) return '网盘图标/蓝奏.png';
      if (hostname.includes('baidu')) return '网盘图标/百度.png';
      if (hostname.includes('quark')) return '网盘图标/夸克.png';
      if (hostname.includes('123')) return '网盘图标/123.png';
      if (hostname.includes('feiji')) return '网盘图标/小飞机.png';
      if (hostname.includes('xunlei')) return '网盘图标/迅雷.png';
      if (hostname.includes('ali')) return '网盘图标/阿里.png';
      return '网盘图标/默认.png';
    },
    getRandomLoadTime() {
      return `${Math.floor(Math.random() * 100)} ms`;
    },
    viewSoftware(item) {
      this.$router.push(`/software/${item.id}`);
    },
  },
};
