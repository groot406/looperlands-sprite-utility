<template>
  <div class="bg-slate-800 w-full h-full p-10 overflow-hidden">
    <div class="my-5 flex gap-x-10 rounded-full bg-slate-600 p-2">
      <div class="w-1/2 flex flex-row gap-x-4">
        <div>
          <n-switch v-model:value="gridMode" size="large" :disabled="!sprite && !weaponSprite">
            <template #checked-icon>
              <n-icon size=16 :component="GridOutline"/>
            </template>
            <template #unchecked-icon>
              <n-icon :component="Person"/>
            </template>
          </n-switch>
        </div>
        <div>
          <n-switch v-model:value="showWeapon" size="large" :disabled="!weaponSprite">
            <template #checked-icon>
              <n-icon size=16 :component="Cross" class="-rotate-90"/>
            </template>
            <template #unchecked-icon>
              <n-icon :component="Cross" class="-rotate-90"/>
            </template>
          </n-switch>
        </div>
        <div>
          <n-switch v-model:value="slowMode" size="large" :disabled="!sprite && !weaponSprite">
            <template #checked-icon>
              <n-icon size=16 :component="AnimalTurtle20Regular"/>
            </template>
            <template #unchecked-icon>
              <n-icon :component="AnimalRabbit20Regular"/>
            </template>
          </n-switch>
        </div>
      </div>
      <div v-if="sprite" class="flex flex-row text-white text-lg p-1 flex-grow w-full items-center justify-center">
        <n-icon v-if="!gridMode" class="opacity-50 hover:opacity-100 cursor-pointer" :component="Previous20Regular" @click="setPreviousFrame"></n-icon>
        <n-icon class="hover:opacity-100 cursor-pointer" :class="{'opacity-50' : autoPlay }" :component="Pause" @click="disableAutoPlay"></n-icon>
        <n-icon class="hover:opacity-100 cursor-pointer" :class="{'opacity-50' : !autoPlay }" :component="Play" @click="enableAutoPlay"></n-icon>
        <n-icon v-if="!gridMode" class="opacity-50 hover:opacity-100 cursor-pointer" :component="Next20Regular" @click="setNextFrame"></n-icon>
        <div class="text-xs pl-5 font-light opacity-50 flex flex-row" v-if="!gridMode"><div class="w-4 text-center">{{ currentFrame + 1 }}</div> / <div class="w-4 text-center">{{ animation.frames }}</div></div>
      </div>
      <div class="w-1/2 pr-4">
        <n-slider v-model:value="zoom" :step="1" class="mt-1 w-full" :min="1" :max="25"/>
      </div>
    </div>
    <template v-if="!sprite && !weaponSprite">
      <div class="text-4xl w-full text-center text-slate-400 mt-40">No spite was uploaded yet</div>
    </template>
    <template v-else>
      <div v-if="gridMode === true" class="relative w-full h-full -top-10 pointer-events-none" id="preview">
        <div class="grid grid-cols-3 absolute w-full h-full">
          <template v-for="(animation, key) in animations">
            <div class="flex items-center justify-center">
              <Sprite :key="key" v-if="sprite" :sprite="sprite" :size="32" :zoom="zoom"
                      :row="animation.row" :speed="slowMode ? animation.slowSpeed : animation.speed"
                      :frames="animation.frames" :flipped="animation.flipped"
                      :cooldown="animation.cooldown"
                      :autoplay="autoPlay"
              />
            </div>
          </template>
        </div>
        <div class="grid grid-cols-3 absolute w-full h-full" v-if="showWeapon">
          <template v-for="(animation, key) in animations">
            <div class="flex items-center justify-center">
              <Sprite :key="'weapon_' + key" v-if="weaponSprite && showWeapon" :sprite="weaponSprite" :offset-x="16"
                      :offset-y="10"
                      :size="48" :zoom="zoom" :row="animation.row"
                      :speed="slowMode ? animation.slowSpeed : animation.speed" :frames="animation.frames"
                      :flipped="animation.flipped"
                      :cooldown="animation.cooldown"
                      :autoplay="autoPlay"
              />
            </div>
          </template>
        </div>
      </div>
      <div v-else class="h-full">
        <div class="relative flex h-full flex-col items-center justify-center w-full">
          <n-select v-model:value="selectedAnimation" :options="animationOptions" label-field="label"/>
          <div class="text-xs w-full text-left text-slate-50 p-1 opacity-40 hover:opacity-80 cursor-pointer" @click="openAnimator">Create your own animation</div>
          <div class="relative w-full h-full -top-10 pointer-events-none" id="preview">
            <div class="grid grid-cols-1 absolute w-full h-full">
              <div class="flex items-center justify-center">
                <Sprite v-if="sprite" :sprite="sprite" :size="32" :zoom="3 * zoom"
                        :row="animation.row"
                        :speed="slowMode ? animation.slowSpeed : animation.speed"
                        :frames="animation.frames" :flipped="animation.flipped"
                        :cooldown="animation.cooldown"
                        @done="nextSubAnimation"
                        :autoplay="autoPlay"
                        :fixed-frame="autoPlay ? null : previewFrame"
                        @newFrame="(newFrame) => currentFrame = newFrame"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 absolute w-full h-full" v-if="showWeapon">
              <div class="flex items-center justify-center">
                <Sprite v-if="weaponSprite && showWeapon" :sprite="weaponSprite" :offset-x="16" :offset-y="10"
                        :size="48" :zoom="3 * zoom" :row="animation.row"
                        :speed="slowMode ? animation.slowSpeed : animation.speed"
                        :frames="animation.frames"
                        :flipped="animation.flipped"
                        :cooldown="animation.cooldown"
                        :autoplay="autoPlay"
                        :fixed-frame="autoPlay ? null : previewFrame"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <teleport to="body">
    <n-modal v-model:show="showAnimator" preset="card" class="w-1/3" title="Sprite animator">
      <n-form v-model="newAnimation" label-placement="top">
        <n-form-item label="Animation name" path="label">
          <n-input v-model:value="newAnimation.label"></n-input>
        </n-form-item>
        <n-form-item label="Animation sequence" path="value">
          <n-dynamic-tags v-model:value="newAnimation.value">
            <template #input="{ submit, deactivate }">
              <n-select class="w-40" ref="animationSelectorRef" :options="animationOptions" v-model:value="inputValue" :clear-filter-after-select="true" value-field="label" @on-update:value="submit(inputValue)" @blur="submit(inputValue)" />
            </template>
          </n-dynamic-tags>
        </n-form-item>
        <n-button @click="addNewAnimation" :disabled="!newAnimation.label || !newAnimation.value">Add animation</n-button>
      </n-form>
    </n-modal>
  </teleport>
</template>

<script setup>
import {computed, onMounted, ref, watch, nextTick} from 'vue'
import Sprite from "./Sprite.vue";
import _ from 'lodash';
import GridOutline from '@vicons/ionicons5/GridOutline'
import Person from '@vicons/carbon/Person'
import Cross from '@vicons/tabler/Cross'
import Play from '@vicons/carbon/Play'
import Pause from '@vicons/carbon/Pause'
import Previous20Regular from '@vicons/fluent/Previous20Regular'
import Next20Regular from '@vicons/fluent/Next20Regular'
import AnimalRabbit20Regular from '@vicons/fluent/AnimalRabbit20Regular'
import AnimalTurtle20Regular from '@vicons/fluent/AnimalTurtle20Regular'

const props = defineProps(['sprite', 'weaponSprite'])
const emit = defineEmits(['update:animation', 'update:zoom', 'update:showWeapon', 'update:slowMode', 'update:gridMode'])

const autoPlay = ref(true);
const previewFrame = ref(0);
const currentFrame = ref(1);
const showAnimator = ref(false);
const inputValue = ref('');
const slowMode = ref(false);
const newAnimation = ref({});
const animationOptions = ref([
  {label: "Attack right", value: 'atk_right'},
  {label: "Walk right", value: 'wlk_right'},
  {label: "Idle right", value: 'idl_right'},
  {label: "Attack up", value: 'atk_up'},
  {label: "Walk up", value: 'wlk_up'},
  {label: "Idle up", value: 'idl_up'},
  {label: "Attack down", value: 'atk_down'},
  {label: "Walk down", value: 'wlk_down'},
  {label: "Idle down", value: 'idl_down'},
  {label: "Attack left", value: 'atk_left'},
  {label: "Walk left", value: 'wlk_left'},
  {label: "Idle left", value: 'idl_left'},
])

if(props.sprite) {
  animationOptions.value.push({label: "Turn around", value: "wlk_down,wlk_down,wlk_right,wlk_right,wlk_up,wlk_up,wlk_left,wlk_left"});
}

const animations = {
  atk_right: {row: 0, speed: 50, slowSpeed: 200, frames: 5, cooldown: 600},
  wlk_right: {row: 1, speed: 100, slowSpeed: 250, frames: 4},
  idl_right: {row: 2, speed: 450, slowSpeed: 500, frames: 2},
  atk_up: {row: 3, speed: 50, slowSpeed: 200, frames: 5, cooldown: 600},
  wlk_up: {row: 4, speed: 100, slowSpeed: 250, frames: 4},
  idl_up: {row: 5, speed: 450, slowSpeed: 500, frames: 2},
  atk_down: {row: 6, speed: 50, slowSpeed: 200, frames: 5, cooldown: 600},
  wlk_down: {row: 7, speed: 100, slowSpeed: 250, frames: 4},
  idl_down: {row: 8, speed: 450, slowSpeed: 500, frames: 2},
  atk_left: {row: 0, speed: 50, slowSpeed: 200, frames: 5, flipped: true, cooldown: 600},
  wlk_left: {row: 1, speed: 100, slowSpeed: 250, frames: 4, flipped: true},
  idl_left: {row: 2, speed: 450, slowSpeed: 500, frames: 2, flipped: true},
}

const subAnimationIndex = ref(0);
let updateSubAnimationInterval = null;
const animation = computed(() => {
  if (updateSubAnimationInterval) {
    clearInterval(updateSubAnimationInterval);
  }

  let selectedAnimationValue = selectedAnimation.value.split(',');
  if(selectedAnimationValue.length === 1) {
    selectedAnimationValue = selectedAnimationValue[0];
  }
  if (!_.isArray(selectedAnimationValue)) {
    return animations[selectedAnimationValue];
  }

  let subAnimation = animations[selectedAnimationValue[subAnimationIndex.value]];

  return subAnimation;

})

// Add keyboard listeners to trigger animations
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    let selectedAnimationValue = selectedAnimation.value.split(',');
    selectedAnimationValue = selectedAnimationValue[0];

    if (e.key === 'ArrowRight') {
      selectedAnimation.value = 'wlk_right'
    } else if (e.key === 'ArrowLeft') {
      selectedAnimation.value = 'wlk_left'
    } else if (e.key === 'ArrowUp') {
      selectedAnimation.value = 'wlk_up'
    } else if (e.key === 'ArrowDown') {
      selectedAnimation.value = 'wlk_down'
    }

    // Add awsd
    if (e.key === 'd') {
      selectedAnimation.value = 'wlk_right'
    } else if (e.key === 'a') {
      selectedAnimation.value = 'wlk_left'
    } else if (e.key === 'w') {
      selectedAnimation.value = 'wlk_up'
    } else if (e.key === 's') {
      selectedAnimation.value = 'wlk_down'
    }

    // Add spacebar to trigger attack for current direction
    if (e.key === ' ') {
      selectedAnimation.value = selectedAnimationValue
          .replace('wlk', 'atk')
          .replace('idl', 'atk')
    }

    // Add esc and enter to trigger idle in current direction
    if (e.key === 'Enter' || e.key === 'Escape') {
      selectedAnimation.value = selectedAnimationValue
          .replace('atk', 'idl')
          .replace('wlk', 'idl')
    }
  })
})

function nextSubAnimation() {
  let selectedAnimationValue = selectedAnimation.value.split(',');
  if(selectedAnimationValue.length === 1) {
    selectedAnimationValue = selectedAnimationValue[0];
  }
  if(_.isArray(selectedAnimationValue)) {
    subAnimationIndex.value = (subAnimationIndex.value + 1) % selectedAnimationValue.length;
  }
}

function setNextFrame() {
  autoPlay.value = false;
  previewFrame.value = (previewFrame.value + 1) % animation.value.frames;
}

function setPreviousFrame() {
  autoPlay.value = false;
  previewFrame.value = (previewFrame.value - 1) % animation.value.frames;
  if(previewFrame.value < 0) {
    previewFrame.value = animation.value.frames - 1;
  }
}

const gridMode = ref(false);
const selectedAnimation = ref('idl_down');
const zoom = ref(3)
const showWeapon = ref(true)

watch(selectedAnimation, (value) => {
  if(_.isArray(value)) {
    let animationChain = value.map((animation) => {
      return animations[animation];
    });
    emit('update:animation', animationChain);
  } else {
    emit('update:animation', animations[value]);
  }
}, {immediate: true})

watch(zoom, (value) => {
  emit('update:zoom', value);
}, {immediate: true})

watch(showWeapon, (value) => {
  emit('update:showWeapon', value);
}, {immediate: true})

watch(slowMode, (value) => {
  emit('update:slowMode', value);
}, {immediate: true})

watch(gridMode, (value) => {
  emit('update:gridMode', value);
}, {immediate: true})

function disableAutoPlay() {
  if(previewFrame.value > animation.value.frames -1) {
    previewFrame.value = 0;
  }
  autoPlay.value = false;
}

function enableAutoPlay() {
  autoPlay.value = true;
}

function openAnimator() {
  newAnimation.value = {};
  showAnimator.value = true;
}

const animationSelectorRef = ref(null);
watch(animationSelectorRef, (value) => {
  if (value) nextTick(() => value.focus())
})

function addNewAnimation() {
  // Loop over newAnimation.value.value, lookup element by label and get value
  let animationChain = newAnimation.value.value.map((selectedAnimation) => {
    console.log(selectedAnimation)
    let animationIndex = _.findIndex(animationOptions.value, { label: selectedAnimation });
    console.log(animationIndex);
    return animationOptions.value[animationIndex].value
  });

  newAnimation.value.value = animationChain.join(',');
  console.log(newAnimation.value);
  animationOptions.value.push(_.cloneDeep(newAnimation.value));
  selectedAnimation.value = newAnimation.value.value;
  newAnimation.value = {}
  showAnimator.value = false;
}
</script>

