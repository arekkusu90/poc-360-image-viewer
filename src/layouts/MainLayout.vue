<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item
          v-for="item in menuList"
          :key="item.id"
          :to="item.route"
          exact
          clickable
        >
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { uid } from "quasar";
import {
  CLOUD_IMAGE,
  CUSTOM,
  JAVASCRIPT_VIEWER,
  VUE_360,
} from "src/router/routes";

const MENU_LIST = [
  { id: uid(), label: "Javascript viewer", route: JAVASCRIPT_VIEWER },
  { id: uid(), label: "Cloud image", route: CLOUD_IMAGE },
  { id: uid(), label: "Vue 360", route: VUE_360 },
  { id: uid(), label: "Custom", route: CUSTOM },
];

export default {
  name: "MainLayout",
  data() {
    return {
      leftDrawerOpen: false,
      menuList: MENU_LIST,
    };
  },
};
</script>
