## BOSS 项目（演示站点）

### 目标
- 顶部栏 + 左侧导航 + 右侧内容区
- 页面拆分为多个文件（`pages/`），主框架负责无刷新切换
- 切换菜单无卡顿：启动时预加载并缓存页面片段

### 目录结构
```
boss项目/
  index.html
  assets/
    styles.css
    app.js
  pages/
    overseas-video.html
    overseas-auto-build.html
    bi-material.html
    bi-product.html
```

### 本地打开方式
- 直接双击打开 `boss项目/index.html` 即可（纯静态、无依赖）
- 如果你的浏览器限制了本地 `fetch`，用任意静态服务器打开也可以（例如 VSCode Live Server）



