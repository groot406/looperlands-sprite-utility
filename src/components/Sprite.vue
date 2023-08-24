<template>
  <div class="flex items-center justify-center" :class="{'-scale-x-100' : flipped }" :style="containerStyle">
    <div class="sprite" :style="style"/>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  sprite: {type: String, required: true},
  size: {type: Number, required: true},
  zoom: {type: Number, required: true},
  row: {type: Number, required: true},
  speed: {type: Number, required: true},
  frames: {type: Number, required: true},
  offsetFactor: {type: Number, required: null},
  flipped: {type: Boolean, required: null, default: false}
});

const frame = ref(0);
let interval = null;

const style = computed(() => {
  return {
    backgroundImage: 'url(' + props.sprite + ')',
    width: props.size + 'px',
    height: props.size + 'px',
    overflow: 'hidden',
    scale: props.zoom,
    backgroundPositionX: (frame.value * props.size * -1) + 'px',
    backgroundPositionY: (props.row * props.size * -1) + 'px'
  }
})

const containerStyle = computed(() => {
  let style = {
    width: (props.size * props.zoom) + 'px',
    height: (props.size * props.zoom) + 'px',
  };

  if (props.offsetFactor) {
    style.top = '-' + props.offsetFactor * props.size * props.zoom + 'px';
    style.left = '-' + props.offsetFactor * props.size * props.zoom + 'px';
  }
})

onMounted(() => {
  interval = setInterval(() => {
    frame.value = (frame.value + 1) % props.frames;
  }, props.speed);
});

watch(() => props.speed, function () {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    frame.value = (frame.value + 1) % props.frames;
  }, props.speed);
})

</script>

<style scoped>
.sprite {
  image-rendering: optimizeSpeed; /* STOP SMOOTHING, GIVE ME SPEED  */
  image-rendering: -moz-crisp-edges; /* Firefox                        */
  image-rendering: -o-crisp-edges; /* Opera                          */
  image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
  image-rendering: pixelated; /* Universal support since 2021   */
  image-rendering: optimize-contrast; /* CSS3 Proposed                  */
  -ms-interpolation-mode: nearest-neighbor; /* IE8+                           */

}
</style>