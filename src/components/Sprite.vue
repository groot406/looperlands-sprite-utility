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
  offsetX: {type: Number, required: null},
  offsetY: {type: Number, required: null},
  flipped: {type: Boolean, required: null, default: false},
  cooldown: {type: Number, required: null},
  fixedFrame: {type: Number, required: null, default: null}
});

const frame = ref(props.fixedFrame || 0);
let interval = null;
let coolDownInProgress = ref(false);

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

  if (props.offsetX) {
    style.top = '-' + (props.size - props.offsetX) * props.zoom + 'px';
  }
  if (props.offsetY) {
    style.left = '-' + (props.size - props.offsetY) * props.zoom + 'px';
  }
})

onMounted(startAnimation);

watch(() => props.speed, function () {
    startAnimation();
})

watch(() => props.row, function () {
  frame.value = props.fixedFrame || 0;
})

watch(() => props.fixedFrame, function () {
  frame.value = props.fixedFrame || 0;
  if (props.fixedFrame !== null) {
    clearInterval(interval);
  }
})

function startAnimation() {
  if (interval) {
    clearInterval(interval);
  }

  if(props.fixedFrame !== null) {
    return;
  }

  interval = setInterval(() => {
    if (coolDownInProgress.value === true) {
      return;
    }

    frame.value = (frame.value + 1) % props.frames;
  }, props.speed);
}

let cooldownTimeout;

watch(frame, () => {
  if (frame.value === 0 && props.cooldown && coolDownInProgress.value === false) {
    coolDownInProgress.value = true;
    if(cooldownTimeout) {
      clearTimeout(cooldownTimeout);
    }
    cooldownTimeout = setTimeout(() => {
      coolDownInProgress.value = false;
    }, props.cooldown)
  } else if(!props.cooldown) {
    coolDownInProgress.value = false;
  }
})
</script>
