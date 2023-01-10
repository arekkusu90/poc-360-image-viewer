<template>
  <div class="cloud-image-viewer">
    <div class="cloudimage-360" :id="id"></div>
  </div>
</template>

<script>
import { uid } from "quasar";
import "/src/assets/js-cloudimage-360-view";
export default {
  name: "CloudImageViewer",
  props: {
    id: { type: String, default: uid() },
    imageUrlList: { type: Array, default: () => [] },
    autoplay: { type: Boolean, default: false },
    isFullScreenEnabled: { type: Boolean, default: false },
    isSpinReverseEnabled: { type: Boolean, default: false },
    isControlReverseEnabled: { type: Boolean, default: false },
    isAutoplayReverseEnabled: { type: Boolean, default: false },
    magnifierZoom: { type: Number, default: 1 },
    pointerZoom: { type: Number, default: 1 },
  },
  data: () => ({
    viewerData: null,
  }),
  computed: {
    configuration() {
      return { ...this.$props };
    },
    activeImageX() {
      return this.viewerData?.activeImageX ?? null;
    },
    pointerCurrentPosition() {
      return this.viewerData?.pointerCurrentPosition ?? null;
    },
  },
  mounted() {
    this.applyViewerConfiguration();
    window.CI360.init();
    this.viewerData = window.CI360._viewers.find((el) => el.id === this.id);
  },
  watch: {
    configuration() {
      this.applyViewerConfiguration();
      this.updateViewer();
    },
    activeImageX(newValue) {
      this.$emit("image-x-change", newValue);
    },
    pointerCurrentPosition(newValue){
      this.$emit("zoom-position-change", newValue);
    }
  },
  methods: {
    getViewerElement() {
      // Do not use $refs since it use a cached version
      // that is not valid after an update()
      // So we need to get a fresh element every time
      return document.getElementById(this.id);
    },
    clearAttributes() {
      const viewer = this.getViewerElement();
      if (!viewer) return;

      let nameList = viewer.getAttributeNames();
      nameList = nameList.filter((name) => name.startsWith("data-"));
      nameList.forEach((name) => {
        viewer.removeAttribute(name);
      });
    },
    setAttribute(name, value) {
      const viewer = this.getViewerElement();
      if (!viewer) return;

      console.log("Adding attribute", "data-" + name, value);
      viewer.setAttribute("data-" + name, value);
    },
    applyViewerConfiguration() {
      const viewer = this.getViewerElement();
      if (!viewer) return;

      this.clearAttributes();

      this.setAttribute("image-list-x", JSON.stringify(this.imageUrlList));
      this.setAttribute("magnifier", "" + this.magnifierZoom);
      this.setAttribute("pointer-zoom", "" + this.pointerZoom);

      if (this.autoplay) this.setAttribute("autoplay", "1");
      if (this.isFullScreenEnabled) this.setAttribute("fullscreen", "1");
      if (this.isSpinReverseEnabled) this.setAttribute("spin-reverse", "1");

      if (this.isControlReverseEnabled) {
        this.setAttribute("control-reverse", "1");
      }

      if (this.isAutoplayReverseEnabled) {
        this.setAttribute("autoplay-reverse", "1");
      }
    },
    async updateViewer() {
      if (!window.CI360) return;

      // $nextTick è necessario dal momento che dobbiamo aspettare che
      // Vue aggiorni il binding dei data-* attribute prima di aggiornare
      // il viewer
      // await this.$nextTick();
      window.CI360.update(this.id, true);
      this.viewerData = window.CI360._viewers.find((el) => el.id === this.id);
    },
  },
};
</script>

<style scoped></style>
