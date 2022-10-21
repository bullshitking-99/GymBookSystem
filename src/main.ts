import { createApp } from "vue";
import "./style.css";

import App from "./App.vue";
import router from "./router";

// 因 unplugin-vue-component 按需加载无法处理非组件模块，如message，需手动加载
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css"; //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib

const app = createApp(App);

app.use(router).mount("#app");

// message需要在vue的原型上添加
app.config.globalProperties.$message = message;
