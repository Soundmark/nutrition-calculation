import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  antd: {},
  mfsu: {},
  publicPath:
    process.env.NODE_ENV === 'development' ? '/' : '/nutrition-calculation/',
  base:
    process.env.NODE_ENV === 'development' ? '/' : '/nutrition-calculation/',
});
