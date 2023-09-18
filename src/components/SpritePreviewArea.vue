<template>
  <div class="w-full h-full p-6 pt-0 overflow-hidden relative">
    <div class="my-5 flex gap-x-10 rounded-full bg-slate-600 p-2 items-center" v-if="sprite || weaponSprite">
      <div class="w-1/2 flex flex-row gap-x-4 z-10 items-center" :class="{'opacity-50': !showAvatar}">
        <n-icon class="text-white mx-2 opacity-80 hover:opacity-100 cursor-pointer" size="18" @click="showAvatar = !showAvatar; showCustom = !showAvatar"><EyeOutline v-if="showAvatar"/><EyeOffOutline v-else/></n-icon>
        <div class="text-slate-300 ml-2 text-xs">Avatar</div>
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

      <FrameControls v-if="sprite"
                     @frame="(newFrame) => currentFrame = newFrame"
                     @done="nextSubAnimation"
                     @pause="setPaused"
                     :allow-frame-stepper="!gridMode"
                     :frames="animation.frames"
                     :cooldown="animation.cooldown"
                     :speed="slowMode ? animation.slowSpeed : animation.speed"
      />
      <div class="w-1/2 pr-4">
        <n-slider v-model:value="zoom" :step="1" class="mt-1 w-full" :min="1" :max="25"/>
      </div>
    </div>
    <div class="my-5 flex gap-x-10 rounded-full bg-slate-600 p-2 items-center" :class="{'opacity-50': !showCustom}"  v-if="customSprite">
      <n-icon class="text-white mx-2 opacity-80 hover:opacity-100 cursor-pointer" size="18"  @click="showCustom = !showCustom; showAvatar = !showCustom"><EyeOutline v-if="showCustom"/><EyeOffOutline v-else/></n-icon>
      <div class="text-slate-300 ml-2 text-xs">Custom</div>
      <div class="w-1/2 flex flex-row gap-x-4 z-10">
        <div>
          <n-switch v-model:value="customSlowMode" size="large">
            <template #checked-icon>
              <n-icon size=16 :component="AnimalTurtle20Regular"/>
            </template>
            <template #unchecked-icon>
              <n-icon :component="AnimalRabbit20Regular"/>
            </template>
          </n-switch>
        </div>
      </div>
      <FrameControls v-if="customSprite"
                     @frame="(newFrame) => customCurrentFrame = newFrame"
                     @pause="customSetPaused"
                     :allow-frame-stepper="true"
                     :frames="customAnimation.frames"
                     :cooldown="customAnimation.cooldown"
                     :speed="customSlowMode ? 400 : customAnimation.speed"
      />
      <div class="w-1/2 pr-4">
        <n-slider v-model:value="customZoom" :step="1" class="mt-1 w-full" :min="1" :max="25"/>
      </div>
    </div>
    <template v-if="!sprite && !weaponSprite && !customSprite">
      <div class="text-4xl w-full text-center text-slate-400 mt-40">No spite was uploaded yet</div>
    </template>
    <template v-else>
      <div v-if="gridMode === true" class="absolute w-full h-[calc(100%-150px)] top-[100px] pointer-events-none" id="preview">
        <div class="grid grid-cols-3 absolute w-full h-full">
          <template v-for="(animation, key) in animations">
            <div class="flex items-center justify-center">
              <Sprite :key="key" v-if="sprite" :sprite="sprite" :size="32" :zoom="zoom"
                      :row="animation.row"
                      :flipped="animation.flipped"
                      :speed="slowMode ? animation.slowSpeed : animation.speed"
                      :frames="animation.frames"
                      :cooldown="animation.cooldown"
                      :paused="paused"
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
                      :flipped="animation.flipped"
                      :speed="slowMode ? animation.slowSpeed : animation.speed"
                      :frames="animation.frames"
                      :cooldown="animation.cooldown"
                      :paused="paused"
              />
            </div>
          </template>
        </div>
      </div>
      <div v-else class="h-full">
        <div class="relative flex h-full flex-col items-center justify-center w-full">
          <div class="flex items-center flex-row gap-x-10 w-full">
            <div class="flex flex-col w-full" v-if="showAvatar && (sprite||weaponSprite)">
              <div class="text-slate-300 mb-1 text-xs" v-if="customSprite">Avatar</div>
              <n-select v-if="sprite||weaponSprite" v-model:value="selectedAnimation" :filterable="true" :options="animationOptions" label-field="label"/>
              <div class="text-xs w-full text-left text-slate-50 p-1 opacity-40 hover:opacity-80 cursor-pointer" @click="openAnimator">Create your own animation</div>
            </div>
            <div class="flex flex-col w-full" v-if="showCustom && customSprite">
              <div class="text-slate-300 mb-1 text-xs" v-if="sprite||weaponSprite">Custom</div>
              <n-select v-if="customSprite" v-model:value="selectedCustomAnimation" :filterable="true" :options="customAnimationOptions" label-field="label"/>
<!--              <div class="text-xs w-full text-left text-slate-50 p-1 opacity-40 hover:opacity-80 cursor-pointer" @click="openCustomAnimator">Create your own animation</div>-->
            </div>
          </div>

          <div class="relative w-full h-full -top-10 pointer-events-none" id="preview">
            <div class="grid grid-cols-1 absolute w-full h-full" v-if="showAvatar">
              <div class="flex items-center justify-center">
                <Sprite v-if="sprite" :sprite="sprite" :size="32" :zoom="zoom"
                        :row="animation.row"
                        :speed="slowMode ? animation.slowSpeed : animation.speed"
                        :flipped="animation.flipped"
                        :frame="currentFrame"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 absolute w-full h-full" v-if="showAvatar && showWeapon">
              <div class="flex items-center justify-center">
                <Sprite v-if="weaponSprite && showWeapon" :sprite="weaponSprite" :offset-x="16" :offset-y="10"
                        :size="48" :zoom="zoom" :row="animation.row"
                        :flipped="animation.flipped"
                        :frame="currentFrame"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 absolute w-full h-full" v-if="showCustom">
              <div class="flex items-center justify-center">
                <Sprite v-if="customSprite" :sprite="customSprite" :offset-x="16" :offset-y="10"
                        :width="customSpriteSettings.frameSize.width" :height="customSpriteSettings.frameSize.height" :zoom="customZoom" :row="customAnimation.row"
                        :frames="customAnimation.frames" :frame="customCurrentFrame"
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
              <n-select class="w-40" ref="animationSelectorRef" :filterable="true" :options="animationOptions" v-model:value="inputValue" :clear-filter-after-select="true" value-field="label" @on-update:value="submit(inputValue)" @blur="submit(inputValue)" />
            </template>
          </n-dynamic-tags>
        </n-form-item>
        <n-button @click="addNewAnimation" :disabled="!newAnimation.label || !newAnimation.value">Add animation</n-button>
      </n-form>
    </n-modal>
  </teleport>
  <teleport to="body">
    <n-modal v-model:show="showCustomAnimator" preset="card" class="w-1/3" title="Sprite animator">
      <n-form v-model="newCustomAnimation" label-placement="top">
        <n-form-item label="Animation name" path="label">
          <n-input v-model:value="newCustomAnimation.label"></n-input>
        </n-form-item>
        <n-form-item label="Animation sequence" path="value">
          <n-dynamic-tags v-model:value="newCustomAnimation.value">
            <template #input="{ submit, deactivate }">
              <n-select class="w-40" ref="customAnimationSelectorRef" :filterable="true" :options="customAnimationOptions" v-model:value="inputValue" :clear-filter-after-select="true" value-field="label" @on-update:value="submit(inputValue)" @blur="submit(inputValue)" />
            </template>
          </n-dynamic-tags>
        </n-form-item>
        <n-button @click="addNewCustomAnimation" :disabled="!newCustomAnimation.label || !newCustomAnimation.value">Add animation</n-button>
      </n-form>
    </n-modal>
  </teleport>
</template>

<script setup>
import {nextTick, onMounted, ref, watch, computed} from 'vue'
import Sprite from "./Sprite.vue";
import _ from 'lodash';
import AnimalRabbit20Regular from '@vicons/fluent/AnimalRabbit20Regular'
import AnimalTurtle20Regular from '@vicons/fluent/AnimalTurtle20Regular'
import FrameControls from "./FrameControls.vue";
import GridOutline from '@vicons/ionicons5/GridOutline'
import Person from '@vicons/carbon/Person'
import Cross from '@vicons/tabler/Cross'
import { EyeOutline, EyeOffOutline } from "@vicons/ionicons5";

const props = defineProps(['sprite', 'weaponSprite', 'customSprite', 'customSpriteSettings'])
const emit = defineEmits(['update:animation', 'update:zoom', 'update:showWeapon', 'update:slowMode', 'update:gridMode', 'update:frame', 'update:subAnimation', 'update:customAnimation', 'update:customFrame'])

const showAvatar = ref(true);
const showCustom = ref(true);

const currentFrame = ref(0);
const customCurrentFrame = ref(0);

const paused = ref(false);
const customPaused = ref(false);

const showAnimator = ref(false);
const showCustomAnimator = ref(false);
const inputValue = ref('');
const slowMode = ref(false);
const customSlowMode = ref(false);

const newAnimation = ref({});
const newCustomAnimation = ref({});

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
  {label: "Idle left", value: 'idl_left'}
])

animationOptions.value.push({label: "Turn around", value: "wlk_down,wlk_down,wlk_right,wlk_right,wlk_up,wlk_up,wlk_left,wlk_left"});


const customAnimationOptions = computed(() => {
  let options = [];
  _.forEach(props.customSpriteSettings.animations, (value, key) => {
    options.push({label: value.name, value: key});
  })
  return options;
})

const customAnimation = computed(() => {
  if(props.customSpriteSettings === null) {
    return null;
  }

  let animation = props.customSpriteSettings.animations[selectedCustomAnimation.value];
  if(!animation) {
    return { row: 0, frames: 1, speed:400 };
  }

  return animation;
});

watch(() => props.sprite, () => {
  if(props.sprite) {
    if(!_.findIndex(animationOptions.value, {label: "Turn around"})) {
      alert('test');
      animationOptions.value.push({
        label: "Turn around",
        value: "wlk_down,wlk_down,wlk_right,wlk_right,wlk_up,wlk_up,wlk_left,wlk_left"
      });
    }
  }
})

watch(() => props.customSpriteSettings.animations, () => {
  if(!props.customSpriteSettings.animations[selectedCustomAnimation.value]) {
    selectedCustomAnimation.value = 0;
  }
})

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
  idl_left: {row: 2, speed: 450, slowSpeed: 500, frames: 2, flipped: true}
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

function setPaused(isPaused) {
  paused.value = isPaused;
}
function customSetPaused(isPaused) {
  customPaused.value = isPaused;
}

const gridMode = ref(false);
const selectedAnimation = ref('idl_down');
const selectedCustomAnimation = ref(0);
const zoom = ref(6)
const customZoom = ref(3);
const showWeapon = ref(true)

watch(selectedAnimation, (value) => {
  value = value.split(',');
  if(value.length === 1) {
    value = value[0];
  }
  if(_.isArray(value)) {
    let animationChain = value.map((animation) => {
      return animations[animation];
    });
    emit('update:animation', _.cloneDeep(animationChain));
  } else {
    emit('update:animation', _.cloneDeep(animations[value]));
  }
}, {immediate: true})

watch(zoom, (value) => {
  emit('update:zoom', zoom.value);
}, {immediate: true})

watch(showWeapon, (value) => {
  emit('update:showWeapon', showWeapon.value);
}, {immediate: true})

watch(slowMode, (value) => {
  emit('update:slowMode', slowMode.value);
}, {immediate: true})

watch(gridMode, (value) => {
  emit('update:gridMode', gridMode.value);
}, {immediate: true})

function openAnimator() {
  newAnimation.value = {};
  showAnimator.value = true;
}

function openCustomAnimator() {
  newCustomAnimation.value = {};
  showCustomAnimator.value = true;
}

const animationSelectorRef = ref(null);
watch(animationSelectorRef, (value) => {
  if (value) nextTick(() => value.focus())
})

watch(subAnimationIndex, () => {
  emit('update:subAnimation', subAnimationIndex.value);
});

watch(currentFrame, () => {
  emit('update:frame', currentFrame.value);
})

watch(customCurrentFrame, () => {
  emit('update:customFrame', customCurrentFrame.value);
})

watch(selectedCustomAnimation, (value) => {
  if(!props.customSpriteSettings.animations || props.customSpriteSettings.animations.length === 0) {
    return;
  }
  emit('update:customAnimation', _.cloneDeep(props.customSpriteSettings.animations[value]));
}, {immediate: true})

watch(() => props.customSpriteSettings.animations, (value) => {
  if(!props.customSpriteSettings.animations || props.customSpriteSettings.animations.length === 0) {
    return;
  }
  emit('update:customAnimation', _.cloneDeep(props.customSpriteSettings.animations[selectedCustomAnimation.value]));
}, {immediate: true})

function addNewAnimation() {
  let animationChain = newAnimation.value.value.map((selectedAnimation) => {
    let animationIndex = _.findIndex(animationOptions.value, { label: selectedAnimation });
    return animationOptions.value[animationIndex].value
  });

  newAnimation.value.value = animationChain.join(',');
  animationOptions.value.push(_.cloneDeep(newAnimation.value));
  selectedAnimation.value = newAnimation.value.value;
  newAnimation.value = {}
  showAnimator.value = false;
}

function addNewCustomAnimation() {
  let animationChain = newCustomAnimation.value.value.map((selectedAnimation) => {
    let animationIndex = _.findIndex(animationOptions.value, { label: selectedAnimation });
    return props.customSpriteSettings.animations[animationIndex]
  });

  console.log(animationChain);
  newCustomAnimation.value.value = animationChain.join(',');
  props.customSpriteSettings.animations.push(_.cloneDeep(newCustomAnimation.value));
  selectedCustomAnimation.value = newCustomAnimation.value.value;
  newCustomAnimation.value = {}
  showCustomAnimator.value = false;
}

watch(() => props.customSprite, (value) => {
  if(props.customSprite) {
    showCustom.value = true;
    showAvatar.value = false;
    return;
  } else {
    showAvatar.value = true;
    showCustom.value = false;
  }
}, {immediate: true})
</script>

