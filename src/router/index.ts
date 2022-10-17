import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Form from "../views/Form.vue";

const history = createWebHistory();

const routes = [
  { path: "/", component: Login },
  {
    path: "/form",
    name: "form",
    component: Form,
  },
];

const router = createRouter({
  history,
  routes,
});

export default router;
