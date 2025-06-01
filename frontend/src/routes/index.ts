import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/auth/Login.vue";
import SignUp from "../components/auth/SignUp.vue";
import CreateStation from "../components/CreateStation.vue";
import { useAuth } from "../composables/useAuth";
import MapView from "@/components/MapView.vue";

// Simple auth guard function
const requireAuth = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated.value) {
    return "/login";
  }
  return true;
};

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
    beforeEnter: requireAuth, // Protected route
  },
  {
    path: "/edit-station/:id",
    name: "EditStation",
    component: CreateStation,
    beforeEnter: requireAuth, // Protected route
  },
  {
    path: "/map",
    name: "MapView",
    component: MapView,
    beforeEnter: requireAuth,
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
