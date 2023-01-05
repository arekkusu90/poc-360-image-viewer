<template>
  <q-page padding class="vue-360">
    <div class="row">
      <!-- VIEWER -->
      <!-- ----------------------------------------------------------------- -->
      <div class="col">
        <vue-three-sixty
          :amount="36"
          image-path="https://cdn1.360-javascriptviewer.com/images/blue-shoe-small/"
          file-name="20180906-{index}-blauw.jpg"
          padding-index
        >
        </vue-three-sixty>
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

export default {
  name: "Vue360",
  components: {},
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
