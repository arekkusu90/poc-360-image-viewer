export const ERROR_404 = {
  path: "*",
  component: () => import("pages/Error404.vue"),
};

export const JAVASCRIPT_VIEWER = {
  path: "",
  alias: "javascript-viewer",
  name: "javascript-viewer",
  component: () => import("pages/JavascriptViewer.vue"),
};

export const CLOUD_IMAGE = {
  path: "cloud-image",
  name: "cloud-image",
  component: () => import("pages/CloudImage.vue"),
};

export const VUE_360 = {
  path: "vue-360",
  name: "vue-360",
  component: () => import("pages/Vue360.vue"),
};

export const CUSTOM = {
  path: "custom",
  name: "custom",
  component: () => import("pages/Custom.vue"),
};

export const LAYOUT_APP = {
  path: "/",
  component: () => import("layouts/MainLayout.vue"),
  children: [JAVASCRIPT_VIEWER, CLOUD_IMAGE, VUE_360, CUSTOM],
};

export const routes = [
  LAYOUT_APP,

  // Always leave this as last one,
  // but you can also remove it
];

export default routes;
