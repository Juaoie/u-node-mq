import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

//Routes
import Home from "../views/Home.vue";
import Demo from "../views/Demo.vue";
import About from "../views/About.vue";
import NotFound from "../views/NotFound.vue";
import Iframe from "../views/Iframe.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/Home",
    redirect: "/",
  },
  {
    path: "/",
    meta: { title: "Home" },
    component: Home,
    redirect: "/Home/Iframe",
    children: [
      {
        path: "/Home/Demo",
        component: Demo,
      },
      {
        path: "/Home/Iframe",
        component: Iframe,
      },
    ],
  },
  {
    path: "/about",
    meta: { title: "About" },
    component: About,
  },
  {
    path: "/:page",
    component: NotFound,
  },
];

export const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(),
  routes,
});
