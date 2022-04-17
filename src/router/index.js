import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Recommend from "@/views/recommend/recommend";

const routes = [
  {
    path: "/",
    redirect: "/recommend",
    name: "home",
    component: Home,
    children: [
      {
        path: "recommend",
        name: "Recommend",
        component: Recommend,
        meta: {
          title: "推荐",
        },
      },
      {
        path: "singer",
        name: "Singer",
        component: () => import("@/views/singer/singer"),
        meta: {
          title: "歌手",
        },
      },
      {
        path: "top-list",
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
        path: "search",
        name: "Search",
        component: () => import("@/views/search/search"),
        meta: {
          title: "搜索",
        },
      },
    ],
  },
  {
    path: "/singer-detail",
    name: "SingerDetail",
    component: () => import("@/views/singer-detail/singer-detail"),
    meta: {
      title: "歌手详情",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
