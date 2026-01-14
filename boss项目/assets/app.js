const ROUTES = {
  "overseas-video": {
    title: "素材测试跟踪",
    page: "./pages/overseas-video.html",
  },
  "overseas-video-upload": {
    title: "素材批量上传",
    page: "./pages/overseas-video-upload.html",
  },
  "overseas-video-result": {
    title: "素材测试结果",
    page: "./pages/overseas-video-result.html",
  },
  "overseas-auto-build": {
    title: "海外测试规则",
    page: "./pages/overseas-auto-build.html",
  },
  "overseas-material-pack": {
    title: "海外素材包",
    page: "./pages/overseas-material-pack.html",
  },
  "overseas-asset": {
    title: "海外资产管理",
    page: "./pages/overseas-asset.html",
  },
  "bi-material": {
    title: "素材相关BI看板",
    page: "./pages/bi-material.html",
  },
  "bi-product": {
    title: "产品相关BI看板",
    page: "./pages/bi-product.html",
  },
};

const DEFAULT_ROUTE = "overseas-video";
const DEFAULT_ROLE = "overseas-creative";

// 全局监听跳转
window.addEventListener('message', (e) => {
  console.log('Global received message:', e.data);
  if (e.data && e.data.type === 'boss_navigate') {
    window.location.hash = `#/${e.data.route}`;
  }
});

new Vue({
  el: '#app',
  data() {
    return {
      routes: ROUTES,
      activeRoute: '',
      activeTitle: '',
      system: 'system',
      scope: 'all',
      role: DEFAULT_ROLE,
      isScenario: true,
      testOption: 'test1',
      isReady: false,
      loadedFrames: new Set(),
      isSidebarCollapsed: false
    };
  },
  mounted() {
    this.initRole();
    this.initRouting();
    this.initHamburger();
    // 强制每进入页面默认设置角色
    this.handleRoleChange(DEFAULT_ROLE);
  },
  methods: {
    initRole() {
      let savedRole = DEFAULT_ROLE;
      try {
        savedRole = localStorage.getItem("boss_demo_role") || DEFAULT_ROLE;
      } catch (e) { console.warn('LocalStorage access blocked'); }
      this.role = savedRole;
      this.syncRole(savedRole);
    },
    syncRole(role) {
      document.body.dataset.roleText = role;
      try {
        localStorage.setItem("boss_demo_role", role);
      } catch (e) { console.warn('LocalStorage access blocked'); }
      // 通知 iframe
      window.dispatchEvent(new CustomEvent('boss_role_change', { detail: role }));
    },
    handleRoleChange(val) {
      this.role = val;
      this.syncRole(val);
      // 手动触发一次 storage 事件，以便 iframe 监听
      try {
        window.localStorage.setItem('boss_demo_role_trigger', Date.now());
      } catch (e) { console.warn('LocalStorage access blocked'); }
    },
    initRouting() {
      window.addEventListener("hashchange", () => {
        this.updateRoute();
      });
      if (!window.location.hash) {
        window.location.hash = `#/${DEFAULT_ROUTE}`;
      } else {
        this.updateRoute();
      }
    },
    updateRoute() {
      const raw = (window.location.hash || "").replace(/^#\/?/, "");
      const route = raw.trim() || DEFAULT_ROUTE;
      console.log('Update route:', route);
      this.activeRoute = ROUTES[route] ? route : DEFAULT_ROUTE;
      const routeInfo = ROUTES[this.activeRoute];
      if (routeInfo) {
        this.activeTitle = routeInfo.title;
      }
    },
    // 计算菜单激活项
    getMenuActive() {
      return this.activeRoute;
    },
    handleMenuSelect(index) {
      window.location.hash = `#/${index}`;
    },
    handleFrameLoad(key) {
      this.loadedFrames.add(key);
      if (this.loadedFrames.size === 1) { // 第一个加载完就隐藏骨架屏
        this.isReady = true;
      }
    },
    getIframeSrc(val, key) {
      // 如果是当前选中的路由，且 URL 中包含 search 参数，则透传给 iframe
      if (key === this.activeRoute) {
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search');
        if (search) {
          // 检查 val.page 是否已经包含问号
          const separator = val.page.includes('?') ? '&' : '?';
          return `${val.page}${separator}search=${encodeURIComponent(search)}`;
        }
      }
      return val.page;
    },
    initHamburger() {
      const btn = document.getElementById("hamburgerBtn");
      if (btn) {
        btn.onclick = () => {
          this.isSidebarCollapsed = !this.isSidebarCollapsed;
          document.querySelector(".app").classList.toggle("is-sidebar-collapsed", this.isSidebarCollapsed);
          localStorage.setItem("boss_demo_sidebar_collapsed", this.isSidebarCollapsed ? "1" : "0");
        };
        if (localStorage.getItem("boss_demo_sidebar_collapsed") === "1") {
          this.isSidebarCollapsed = true;
          document.querySelector(".app").classList.add("is-sidebar-collapsed");
        }
      }
    }
  }
});
