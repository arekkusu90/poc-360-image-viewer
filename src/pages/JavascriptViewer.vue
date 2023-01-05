<!--
Pro:
 - Funziona bene
 - Ha vari modi per essere usato
 - Ha un bel po' di opzioni

Problemi:
 - Non c'è modo di sapere la posizione attuale dell'immagine e quindi è impossibile
   implementare la finestr di visualizzazione zoom
 - L'autoplay funziona solamente per l'avvio, eventuali workaround hanno delle complicazioni
 - Il codice non è open source, è minificato ed è difficile da debuggare
 - Il prodotto è a gratuito ma anche a pagamento
 - Mancano alcuni eventi chiave
 -->
<template>
  <q-page padding class="javascript-viewer">
    <div class="row">
      <!-- VIEWER -->
      <!-- ----------------------------------------------------------------- -->
      <div class="col">
        <javascript-viewer-viewer
          ref="viewer"
          :image-urls="imageUrlList"
          :reverse="isReverseEnabled"
          :auto-rotate="isAutoRotateEnabled"
          :auto-rotate-reverse="isReverseEnabled"
          zoom
          enable-change-image-event
          @load-image="(...args) => logViewerEvent('load-image', ...args)"
          @started="(...args) => logViewerEvent('started', ...args)"
          @change-image="onChangeImage"
          @end-auto-rotate="onEndAutoRotate"
          @start-dragging="
            (...args) => logViewerEvent('start-dragging', ...args)
          "
          @click="(...args) => logViewerEvent('click', ...args)"
          @double-click="(...args) => logViewerEvent('double-click', ...args)"
          @scroll="onScroll"
          @pinch="(...args) => logViewerEvent('pinch', ...args)"
          @zoom="onZoom"
          @zoom-in="(...args) => logViewerEvent('zoom-in', ...args)"
          @zoom-out="(...args) => logViewerEvent('zoom-out', ...args)"
        />

        <template v-if="currentImage">
          <image-zoom-map
            :image-url="currentImage.src"
            :x="currentX"
            :y="currentY"
            :scale="zoomScale"
          />
        </template>
      </div>

      <!-- ACTIONS -->
      <!-- ----------------------------------------------------------------- -->
      <div class="col-3 bg-blue-1 rounded-borders q-pa-md">
        <div class="row q-col-gutter-sm">
          <div>
            <span class="text-bold">Current frame:</span>
            {{ currentImage && currentImage.sequence }}
          </div>

          <q-toggle
            v-model="isAutoRotateEnabled"
            label="Autoplay"
            class="col-12"
          />

          <q-toggle v-model="isReverseEnabled" label="Reverse" class="col-12" />

          <div class="row items-center full-width q-col-gutter-md">
            <div>
              <q-btn
                round
                dense
                outline
                icon="zoom_out"
                @click="() => $refs.viewer.zoomOut()"
              >
                <q-tooltip>Zoom out</q-tooltip>
              </q-btn>
            </div>

            <div class="col text-center">
              {{ currentZoom }}
            </div>

            <div>
              <q-btn
                round
                dense
                outline
                icon="zoom_in"
                @click="() => $refs.viewer.zoomIn()"
              >
                <q-tooltip>Zoom in</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getImageUrlList } from "src/services/utils";
import JavascriptViewerViewer from "components/JavascriptViewerViewer.vue";
import ImageZoomMap from "components/ImageZoomMap.vue";

export default {
  name: "JavascriptViewer",
  components: { ImageZoomMap, JavascriptViewerViewer },
  data: () => ({
    isReverseEnabled: false,
    isAutoRotateEnabled: false,
    imageUrlList: [],
    currentImage: null,
    currentX: 0,
    currentY: 0,
    currentZoom: 1,
  }),
  computed: {
    zoomScale() {
      return 1 - (this.currentZoom - 1) / (2 - 1);
    },
  },
  created() {
    this.imageUrlList = getImageUrlList();
  },
  methods: {
    logViewerEvent(eventName, ...args) {
      console.log("[Viewer event]", eventName, ...args);
    },
    onChangeImage({ completed, currentDegree, currentImage, first }) {
      this.logViewerEvent("change-image", ...arguments);
      this.currentImage = currentImage;
    },
    onEndAutoRotate({ currentDegree, currentImage, completed }) {
      this.logViewerEvent("end-auto-rotate", ...arguments);
      this.isAutoRotateEnabled = false;
    },
    onZoom({ zoom, minZoom, maxZoom }) {
      this.logViewerEvent("zoom", ...arguments);
      this.currentZoom = zoom;
    },
    onScroll({ currentDegree, currentImage, originalEvent, completed }) {
      this.logViewerEvent("scroll", {
        currentDegree,
        currentImage,
        originalEvent,
        completed,
        pan: currentImage.pz.getPan(),
        scale: currentImage.pz.getScale(),
        options: currentImage.pz.getOptions(),
      });

      const { x, y } = currentImage.pz.getPan();
      this.currentX = x;
      this.currentY = y;
      // this.currentZoom = currentImage.pz.getScale();
    },
  },
};
</script>

<style scoped></style>
