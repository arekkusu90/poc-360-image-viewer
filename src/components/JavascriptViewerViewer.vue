<template>
  <div class="javascript-viewer-viewer">
    <div :id="mainHolderId">
      <img :id="mainImageId" alt="viewer" />
    </div>
  </div>
</template>

<script>
import { JavascriptViewer } from "@3dweb/360javascriptviewer";
import { clamp } from "src/services/utils";
export default {
  name: "JavascriptViewerViewer",
  props: {
    // ID of the presentation created by 3dweb.io
    id: { type: String, default: "jsv-image" },
    // ID of the image which is the base for all the frames.
    // You can also use mainImageUrl if the path of the other files are different.
    mainImageId: { type: String, default: "jsv-image" },
    // ID of the div where the presentation runs in.
    mainHolderId: { type: String, default: "jsv-holder" },
    // URL of the first image, doesn't have to be in the document.
    mainImageUrl: { type: String, default: "" },
    // Amount of frames in the presentation, more images means smoother rotations.
    totalFrames: { type: Number, default: 72 },
    // Array of image urls, overrides totalFrames and imageUrlFormat
    imageUrls: { type: Array, default: () => [] },
    // After loading the presentation this is the first frame visible.
    firstImageNumber: { type: Number, default: 1 },
    // Invert the rotation direction when dragging.
    reverse: { type: Boolean, default: false },
    // Speed of rotating. -199 to 100
    speed: { type: Number, default: 80 },
    // Delay when stop dragging.
    inertia: { type: Number, default: 20 },
    // Disable the build in progress bar,
    // use this when you have implemented your own loader or don't like this one.
    defaultProgressBar: { type: Boolean, default: false },
    // Format for determining the filenames of the frames {filename}_xx.{extension} is the default
    //    ipod_x.jpg => ipod_1.jpg
    //    ipod_xx.jpg => ipod_01.jpg
    //    https://other.cdn/images/ipod_xx.jpg => https://other.cdn/images/ipod_01.jpg
    imageUrlFormat: { type: String, default: "{filename}_xx.{extension}" },
    // Add a class to all the images used in the presentation, separate multiple classes with a space.
    extraImageClass: { type: String, default: "" },
    // Use this setting in combination with imageUrlFormat startFrameNo:
    //    4 => first file is ipod_04.jpg
    startFrameNo: { type: Number, default: 1 },
    // Use this setting for rotating the view at start.
    // Rotation stops when user drags the model or another animation method is called.
    autoRotate: { type: Boolean, default: false },
    // Speed of autorotation. -199 to 100
    autoRotateSpeed: { type: Number, default: 1 },
    // Use this setting for changing the direction of the auto rotating.
    autoRotateReverse: { type: Boolean, default: false },
    // Use this setting for enabling click pinch and wheel events on images.
    enableImageEvents: { type: Boolean, default: false },
    // Use this setting for enabling zoom functions.
    // Zoom on wheel event or pinch.
    zoom: { type: Boolean, default: false },
    // Change the speed of zooming with the mousewheel.
    zoomWheelSpeed: { type: Number, default: 50 },
    // If zoom is enabled this is the max zoom factor.
    zoomMax: { type: Number, default: 2 },
    // Blocks repeating images after reaching last image.
    stopAtEdges: { type: Boolean, default: false },
    // Set the query params height and width for use with an image resizer.
    autoCdnResizer: { type: Boolean, default: false },
    // Enable changeImage event on rotation, could be CPU heavy
    enableChangeImageEvent: { type: Boolean, default: false },
    // Change the cursors for the presentation
    //
    //    interface ICursorConfig {
    //      default: string,
    //      drag: string,
    //      zoomIn: string,
    //      zoomOut: string,
    //      pan: string
    //    }
    cursorConfig: { type: Object, default: () => null },
    // Configure the default notifications
    //
    //    interface INotificationConfig {
    //      dragToRotate: {
    //        showStartToRotateDefaultNotification?: boolean,
    //        languages?: ITranslation[],
    //        imageUrl?: string,
    //        mainColor?: string,
    //        textColor?: string
    //      }
    //    }
    notificationConfig: { type: Object, default: () => null },
  },
  data: () => ({
    viewer: null,
  }),
  computed: {
    minZoom() {
      return 1;
    },
    maxZoom() {
      return this.viewer?.zoom?.zoomMax ?? 1;
    },
    currentZoom() {
      return this.viewer?.zoom?.currentZoomScale ?? 1;
    },
    currentImage() {
      const imageList = this.viewer?.images ?? [];
      const currentImageNumber = this.viewer?.currentImageNumber ?? 1;
      const index = currentImageNumber - 1;
      return imageList[index];
    },
    pan() {
      if (!this.currentImage || !this.currentImage.pz) return null;
      return this.currentImage.pz.getPan();
    },
    screenX() {
      console.log("screenX", this.viewer?.zoom?.screenX);
      return this.viewer?.zoom?.screenX ?? 1;
    },
    isMinZoomReached() {
      return this.currentZoom <= this.minZoom;
    },
    isMaxZoomReached() {
      return this.currentZoom >= this.maxZoom;
    },
  },
  mounted() {
    this.initViewer();
  },
  watch: {
    currentZoom(newValue, oldValue) {
      console.log("new zoom", newValue);
      const eventName = newValue < oldValue ? "zoom-out" : "zoom-in";
      const options = {
        zoom: newValue,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
      };

      this.$emit("zoom", options);
      this.$emit(eventName, options);
    },
    reverse(newValue) {
      this.viewer.options.reverse = newValue;
    },
    async autoRotateReverse(newValue) {
      this.viewer.options.autoRotateReverse = newValue;

      // @TODO: aumenta la velocità ogni volta che il reverse viene cambiato durante l'animazione
      if (this.autoRotate && this.viewer.inAnimation) {
        this.viewer.cancelCurrentActions();
        await this.viewer.autoRotate(true);
        this.emitEndAutoRotateEvent();
      }
    },
    async autoRotate(newValue) {
      console.log(this.viewer);
      if (!!newValue) {
        await this.viewer.autoRotate(true);
        this.emitEndAutoRotateEvent();
        return;
      }

      if (this.viewer.inAnimation) this.viewer.cancelCurrentActions();
    },
  },
  methods: {
    // @see constructor API here: https://www.npmjs.com/package/@3dweb/360javascriptviewer
    getViewerConfig() {
      let config = {
        id: this.id,
        mainImageId: this.mainImageId,
        mainHolderId: this.mainHolderId,
        mainImageUrl: this.mainImageUrl,
        totalFrames: this.totalFrames,
        imageUrls: this.imageUrls,
        firstImageNumber: this.firstImageNumber,
        reverse: this.reverse,
        speed: this.speed,
        inertia: this.inertia,
        defaultProgressBar: this.defaultProgressBar,
        imageUrlFormat: this.imageUrlFormat,
        extraImageClass: this.extraImageClass,
        startFrameNo: this.startFrameNo,
        autoRotate: this.autoRotate,
        autoRotateSpeed: this.autoRotateSpeed,
        autoRotateReverse: this.autoRotateReverse,
        enableImageEvents: this.enableImageEvents,
        zoom: this.zoom,
        zoomWheelSpeed: this.zoomWheelSpeed,
        zoomMax: this.zoomMax,
        stopAtEdges: this.stopAtEdges,
        autoCDNResizer: this.autoCdnResizer,
        enableChangeImageEvent: this.enableChangeImageEvent,
      };

      if (this.cursorConfig) config.cursorConfig = this.cursorConfig;
      if (this.notificationConfig) {
        config.notificationConfig = this.notificationConfig;
      }

      return config;
    },
    async initViewer() {
      const config = this.getViewerConfig();
      this.viewer = new JavascriptViewer(config);
      this.registerViewerEvents(this.viewer);
      await this.viewer.start();

      if (this.enableChangeImageEvent) this.emitChangeImageEvent();
    },
    registerViewerEvents(viewer) {
      const events = viewer.events();

      // Use this event to create your own progress bar
      events.loadImage.on((...args) => this.$emit("load-image", ...args));
      // Use this event to trigger other actions when the viewer is ready
      events.started.on((...args) => this.$emit("started", ...args));
      // Use this event to capture the user drag movement
      events.startDragging.on((...args) =>
        this.$emit("start-dragging", ...args)
      );
      // Fires when a new image becomes visible,
      // works in combination with enableChangeImageEvent: true
      events.changeImage.on((info) =>
        this.$emit("change-image", { ...info, first: false })
      );
      // Fires when autorotate stops
      events.endAutoRotate.on((...args) =>
        this.$emit("end-auto-rotate", ...args)
      );
      // Fires when the user clicks on a image,
      // works in combination with enableImageEvents: true
      events.click.on((...args) => this.$emit("click", ...args));
      // Fires when the user pinch on a image (zoom on mobile with 2 fingers),
      // works in combination with enableImageEvents: true
      events.pinch.on((...args) => this.$emit("pinch", ...args));
      // Fires when the user use the mouse scroll,
      // works in combination with enableImageEvents: true
      events.scroll.on((...args) => this.$emit("scroll", ...args));
      // Fires when the user double clicks on a image,
      // works in combination with enableImageEvents: true
      events.doubleClick.on((...args) => this.$emit("double-click", ...args));
    },
    applyZoom(newZoomScale) {
      const minZoom = this.minZoom;
      const maxZoom = this.maxZoom;
      const newZoom = clamp(newZoomScale, minZoom, maxZoom);
      console.log({ minZoom, maxZoom, newZoom }, this.viewer);
      const x = this.viewer.zoom.screenX;
      const y = this.viewer.zoom.screenY;
      // @TODO: il pan sembra non funzionare
      this.viewer.zoomTo(newZoom, -1, -1);
    },
    zoomIn() {
      this.applyZoom(this.currentZoom + 0.25);
    },
    zoomOut() {
      this.applyZoom(this.currentZoom - 0.25);
    },
    emitChangeImageEvent() {
      const currentImageNumber = this.viewer.currentImageNumber;
      const currentDegree = this.viewer.currentDegree;
      const completed = true;
      const currentImage = this.viewer.images[currentImageNumber - 1];
      this.$emit("change-image", {
        currentDegree,
        completed,
        currentImage,
        first: true,
      });
    },
    emitEndAutoRotateEvent() {
      const currentImageNumber = this.viewer.currentImageNumber;
      const currentDegree = this.viewer.currentDegree;
      const completed = true;
      const currentImage = this.viewer.images[currentImageNumber - 1];
      this.$emit("end-auto-rotate", {
        currentDegree,
        completed,
        currentImage,
        first: true,
      });
    },
  },
};
</script>

<style scoped></style>
