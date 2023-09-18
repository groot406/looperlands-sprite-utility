<template>
  <div class="flex items-center justify-center" :class="{'-scale-x-100' : flipped }" :style="containerStyle">
    <div class="sprite" :style="style"/>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  sprite: {type: String, required: true},
  size: {type: Number, required: false},
  width: {type: Number, required: false},
  height: {type: Number, required: false},

  zoom: {type: Number, required: true},
  row: {type: Number, required: true},
  offsetX: {type: Number, required: null},
  offsetY: {type: Number, required: null},
  flipped: {type: Boolean, required: null, default: false},
  frame: {type: Number, required: null, default: null},
  frames: {type: Number, required: null, default: null},
  speed: {type: Number, required: null, default: null},
  cooldown: {type: Number, required: null, default: null},
  paused: {type: Boolean, required: null, default: false},
});

const dimensions = computed(() => {
  if( props.size ) {
    return {width: props.size, height: props.size};
  }

  return {
    width: props.width,
    height: props.height,
  }
})

const innerFrame = ref(0);
let frameTimer = null
let cooldownInProgress = false;
onMounted(startAnimation);

function startAnimation () {
  if(props.frame === null && props.frames) {
    if(frameTimer) {
      clearInterval(frameTimer);
    }
    frameTimer = setInterval(() => {
      if(props.paused) {
        return;
      }

      if(cooldownInProgress) {
        return;
      }

      if (innerFrame.value === props.frames - 1) {
        if(props.cooldown) {
          cooldownInProgress = true;
          setTimeout(() => {
            cooldownInProgress = false;
          }, props.cooldown);
        }
        innerFrame.value = 0;
      } else {
        innerFrame.value++;
      }
    }, props.speed);
  }
}

watch(() => props.paused, (value) => {

  if(props.paused && frameTimer) {
    clearInterval(frameTimer);
    return;
  }

  if(!props.paused) {
    startAnimation();
  }
})

watch(() => props.speed, (value) => {
  startAnimation();
});

const style = computed(() => {
  const renderFrame = (props.frame !== null) ? props.frame : innerFrame.value;

  return {
    backgroundImage: 'url(' + props.sprite + ')',
    width: dimensions.value.width + 'px',
    height: dimensions.value.height + 'px',
    overflow: 'hidden',
    scale: props.zoom,
    backgroundPositionX: (renderFrame * dimensions.value.width * -1) + 'px',
    backgroundPositionY: (props.row * dimensions.value.height * -1) + 'px'
  }
})

const containerStyle = computed(() => {
  let style = {
    width: (props.size * props.zoom) + 'px',
    height: (props.size * props.zoom) + 'px',
  };

  if (props.offsetX) {
    style.top = '-' + (props.size - props.offsetX) * props.zoom + 'px';
  }
  if (props.offsetY) {
    style.left = '-' + (props.size - props.offsetY) * props.zoom + 'px';
  }
})

</script>
