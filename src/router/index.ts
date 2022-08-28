import { createRouter, createWebHistory } from "vue-router";
import login from "../views/Login.vue";

const history = createWebHistory();

const routes = [{ path: "/", component: login }];

const router = createRouter({
  history,
  routes,
});

export default router;
