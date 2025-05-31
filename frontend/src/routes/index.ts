import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/auth/Login.vue";
import SignUp from "../components/auth/SignUp.vue";
import CreateStation from "../components/CreateStation.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/create-station",
    name: "CreateStation",
    component: CreateStation,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
