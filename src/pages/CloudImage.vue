<!--
Pro:
 - Funziona bene
 - Ha vari modi per essere usato
 - Ha un bel po' di opzioni

Problemi:
 - Non c'è lo zoom on wheel (al suo posto magnifier e zoom on pointer)
 - L'autoplay riavvia l'immagine da 0 anziché mantenere la rotazione attuale e partire da quella
 - Non emette eventi. Il massimo che si può fare è sfruttare la reattività di Vue
   per generare alcuni eventi in base alle modifiche di alcuni campi
 -->
<template>
  <q-page padding class="cloud-image">
    <div class="row">
      <!-- VIEWER -->
      <!-- ----------------------------------------------------------------- -->
      <div class="col">
        <cloud-image-viewer
          :image-url-list="imageUrlList"
          :autoplay="isAutoplayEnabled"
          :is-full-screen-enabled="isFullScreenEnabled"
          :magnifier-zoom="magnifierZoom"
          :pointer-zoom="pointerZoom"
          :is-spin-reverse-enabled="isReverseEnabled"
          :is-control-reverse-enabled="isReverseEnabled"
          :is-autoplay-reverse-enabled="isReverseEnabled"
          style="width: 600px"
          @image-x-change="onImageXChange"
          @zoom-position-change="onZoomPositionChange"
        />

        <image-zoom-map
          :image-url="currentImageUrl"
          :scale="pointerScale"
          :x="currentZoomX"
          :y="currentZoomY"
        />
      </div>

      <!-- ACTIONS -->
      <!-- ----------------------------------------------------------------- -->
      <div class="col-3 bg-blue-1 rounded-borders q-pa-md">
        <div class="row q-col-gutter-sm">
          <div>
            <span class="text-bold">Current frame:</span> {{ currentXIndex }}
          </div>

          <q-toggle
            v-model="isAutoplayEnabled"
            label="Autoplay"
            class="col-12"
          />

          <q-toggle
            v-model="isFullScreenEnabled"
            label="Full screen"
            class="col-12"
          />

          <q-toggle v-model="isReverseEnabled" label="Reverse" class="col-12" />

          <q-input
            v-model.number="magnifierZoom"
            label="Magnifier zoom"
            type="number"
            min="1"
            max="4"
            step="0.5"
            outlined
            dense
            hint="Disabled when <= 1"
            class="col-12"
          />

          <q-input
            v-model.number="pointerZoom"
            label="Pointer zoom"
            type="number"
            min="1"
            max="4"
            step="0.5"
            outlined
            dense
            hint="Disabled when <= 1"
            class="col-12"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getImageUrlList } from "src/services/utils";
import CloudImageViewer from "components/CloudImageViewer.vue";
import ImageZoomMap from "components/ImageZoomMap.vue";

export default {
  name: "CloudImage",
  components: { ImageZoomMap, CloudImageViewer },
  data: () => ({
    isAutoplayEnabled: false,
    isFullScreenEnabled: false,
    isReverseEnabled: false,
    magnifierZoom: 1,
    pointerZoom: 1,
    imageUrlList: [],
    currentXIndex: null,
    currentZoomX: 0,
    currentZoomY: 0,
  }),
  computed: {
    currentImageUrl() {
      return this.imageUrlList[this.currentXIndex - 1];
    },
    pointerScale() {
      return 1 - (this.pointerZoom - 1) / (4 - 1);
    },
  },
  created() {
    this.imageUrlList = getImageUrlList();
  },
  methods: {
    onImageXChange(newIndex) {
      this.currentXIndex = newIndex;
    },
    onZoomPositionChange({ x, y }) {
      this.currentZoomX = x;
      this.currentZoomY = y;
    },
  },
};
</script>

<style scoped></style>
