<template>
  <div class="flex flex-row text-white text-lg p-1 flex-grow w-full items-center justify-center gap-x-2">
    <n-icon v-if="allowFrameStepper" class="opacity-50 hover:opacity-100 cursor-pointer" :component="Previous20Regular"
            @click="setPreviousFrame"></n-icon>
    <n-icon v-if="!paused" class="hover:opacity-100 cursor-pointer opacity-50" :component="Pause"
            @click="togglePlayPause"></n-icon>
    <n-icon v-if="paused" class="hover:opacity-100 cursor-pointer opacity-50" :component="Play"
            @click="togglePlayPause"></n-icon>
    <n-icon v-if="allowFrameStepper" class="opacity-50 hover:opacity-100 cursor-pointer" :component="Next20Regular"
            @click="setNextFrame"></n-icon>
    <div class="text-xs pl-5 font-light opacity-50 flex flex-row" v-if="allowFrameStepper">
      <div class="w-4 text-center">{{ currentFrame + 1 }}</div>
      /
      <div class="w-4 text-center">{{ frames }}</div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue'
import Play from '@vicons/carbon/Play'
import Pause from '@vicons/carbon/Pause'
import Previous20Regular from '@vicons/fluent/Previous20Regular'
import Next20Regular from '@vicons/fluent/Next20Regular'

const props = defineProps(['allowFrameStepper', 'frames', 'speed', 'cooldown']);
const emit = defineEmits(['frame', 'done', 'pause'])

const paused = ref(false);
const currentFrame = ref(0);
let cooldownTimeout;
let coolDownInProgress = ref(false);
let frameInterval = null;

onMounted(startAnimation);

function togglePlayPause() {
  paused.value = !paused.value;
  emit('pause', paused.value);
}

function setPreviousFrame() {
  paused.value = true;
  if (currentFrame.value === 0) {
    currentFrame.value = props.frames - 1;
  } else {
    currentFrame.value--;
  }
}

function setNextFrame() {
  paused.value = true;
  if (currentFrame.value === props.frames - 1) {
    currentFrame.value = 0;
  } else {
    currentFrame.value++;
  }
}

function startAnimation() {
  if (paused.value) {
    return;
  }
  stopAnimation();
  frameInterval = setInterval(() => {
    if (coolDownInProgress.value === true) {
      return;
    }

    if (currentFrame.value === props.frames - 1) {
      currentFrame.value = 0;
      emit('done')
    } else {
      currentFrame.value++;
    }
  }, props.speed);
}

function stopAnimation() {
  if (!frameInterval) {
    return;
  }
  clearInterval(frameInterval);
}

watch(() => props.frames, function () {
  if (currentFrame.value >= props.frames) {
    currentFrame.value = 0;
  }
});

watch(() => props.speed, function () {
  if (paused.value) {
    return;
  }
  startAnimation();
});

watch(paused, function () {
  if (paused.value) {
    stopAnimation();
  } else {
    startAnimation();
  }
})

watch(currentFrame, function () {
  if (currentFrame.value === 0 && props.cooldown && coolDownInProgress.value === false) {
    coolDownInProgress.value = true;
    if (cooldownTimeout) {
      clearTimeout(cooldownTimeout);
    }
    cooldownTimeout = setTimeout(() => {
      coolDownInProgress.value = false;
    }, props.cooldown)
  } else if (!props.cooldown) {
    coolDownInProgress.value = false;
  }

  emit('frame', currentFrame.value);
})

</script>