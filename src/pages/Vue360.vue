<template>
  <q-page padding class="vue-360">
    <div class="row">
      <!-- VIEWER -->
      <!-- ----------------------------------------------------------------- -->
      <div class="col">
        <vue-three-sixty
          ref="viewer"
          :amount="98"
          image-path="https://cdn1.360-javascriptviewer.com/images/blue-shoe-small"
          file-name="20180906-0{index}-blauw.jpg"
          padding-index
          :spin-reverse="isReverseEnabled"
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
            @input="onAutoplayChange"
          />

          <q-toggle v-model="isReverseEnabled" label="Reverse" class="col-12" />
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
    isReverseEnabled: false,
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
    onAutoplayChange(value){
      this.$refs.viewer.togglePlay();
    }
  },
};
</script>

<style scoped></style>
