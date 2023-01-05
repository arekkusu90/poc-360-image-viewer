<template>
  <div class="image-zoom-map">
    <template v-if="imageUrl">
      <img :src="imageUrl" alt="Image map" @load="onImageLoaded" />
      <div class="image-zoom-map__box" :style="boxStyles"></div>
    </template>
  </div>
</template>

<script>
import { clamp } from "src/services/utils";

export default {
  name: "ImageZoomMap",
  props: {
    imageUrl: { type: String, default: null },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    scale: { type: Number, default: 1 },
  },
  data: () => ({}),
  computed: {
    boxStyles() {
      let styles = {};

      styles.scale = clamp(this.scale, 0, 1);
      styles.translate = `${this.x}px ${this.y}px`;

      // const scale = clamp(this.scale, 0, 1);
      // styles.tansform = `scale(${scale}) translate(${this.x}px, ${this.y}px)`;

      return styles;
    },
  },
  mounted() {},
  watch: {},
  methods: {
    onImageLoaded() {
      console.log("onImageLoaded()");
    },
  },
};
</script>

<style lang="scss" scoped>
.image-zoom-map {
  position: relative;
  width: fit-content;
  height: fit-content;

  &__box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    translate: 0 0;
    border: 2px solid red;
    transform-origin: top left;
  }
}
</style>
