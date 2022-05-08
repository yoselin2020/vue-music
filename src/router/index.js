import { createRouter, createWebHashHistory } from "vue-router";

import Recommend from "@/views/recommend/recommend";

const routes = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    name: "Recommend",
    component: Recommend,
    meta: {
      title: "推荐",
    },
    children: [
      {
        path: ":id",
        component: () => import("@/views/recommend/recommend-detail"),
        props: true,
      },
    ],
  },
  {
    path: "/singer",
    name: "Singer",
    component: () => import("@/views/singer/singer"),
    meta: {
      title: "歌手",
    },
    children: [
      {
        path: ":id",
        component: () => import("@/views/singer/singer-detail"),
        props: true,
      },
    ],
  },
  {
    path: "/top-list",
    name: "TopList",
    component: () => import("@/views/top-list/top-list"),
    meta: {
      title: "排行",
    },
    children: [
      {
        path: ":id",
        component: () => import("@/views/top-list/top-list-detail"),
        props: true,
        meta: {
          title: "排行详情",
        },
      },
    ],
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("@/views/search/search"),
    meta: {
      title: "搜索",
    },
  },
  {
    name: "user",
    path: "/user",
    components: {
      user: () => import("@/views/user/user.vue"),
    },
    meta: {
      title: "用户",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
