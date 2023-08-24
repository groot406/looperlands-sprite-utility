<template>
  <div class="bg-slate-800 w-full h-full p-10 overflow-hidden">
    <div class="my-5 flex gap-x-10 rounded-full bg-slate-600 p-2">
      <div class="w-1/2 flex flex-row gap-x-4">
      <div>
        <n-switch v-model:value="gridMode" size="large">
          <template #checked-icon>
            <n-icon size=16 :component="GridOutline" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="Person" />
          </template>
        </n-switch>
      </div>
      <div>
        <n-switch v-model:value="showWeapon" size="large" :disabled="!weaponSprite">
          <template #checked-icon>
            <n-icon size=16 :component="Cross" class="-rotate-90" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="Cross" class="-rotate-90" />
          </template>
        </n-switch>
      </div>
      </div>
      <div class="w-1/2 pr-4">
        <n-slider v-model:value="zoom" :step="1" class="mt-1 w-full" :min="1" :max="25"/>
      </div>
    </div>
    <template v-if="!sprite && !weaponSprite">
      <div class="text-4xl w-full text-center text-slate-400 mt-40">No spite was uploaded yet</div>
    </template>
    <template v-else>
      <div v-if="gridMode === true" class="relative w-full h-full -top-10 pointer-events-none">
        <div class="grid grid-cols-3 absolute w-full h-full">
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=0 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=1 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=2 speed=500 frames=2 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=3 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=4 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=5 speed=500 frames=2 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=6 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=7 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="sprite" :size="32" :zoom="zoom" row=8 speed=500 frames=2 /></div>
        </div>
        <div class="grid grid-cols-3 absolute w-full h-full" v-if="showWeapon">
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=0 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=1 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=2 speed=500 frames=2 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=3 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=4 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=5 speed=500 frames=2 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=6 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=7 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom" :offset-factor="0.5" row=8 speed=500 frames=2 /></div>
        </div>
      </div>
      <div v-else class="h-full">
        <div class="relative flex h-full flex-col items-center justify-center w-full">
          <n-select v-model:value="selectedAnimation" :options="animationOptions" label-field="label" />
          <div class="w-full h-full flex justify-center items-center">
            <div class="flex relative pointer-events-none">
              <Sprite class="absolute top-0 left-0" v-if="sprite" :sprite="sprite" :size="32" :zoom="3 * zoom" :row="animations[selectedAnimation].row" :speed="animations[selectedAnimation].speed" :frames="animations[selectedAnimation].frames" :flipped="animations[selectedAnimation].flipped" />
              <Sprite class="absolute top-0 left-0" v-if="weaponSprite && showWeapon" :sprite="weaponSprite" :offset-factor="0.5" :size="48" :zoom="3 * zoom" :row="animations[selectedAnimation].row" :speed="animations[selectedAnimation].speed" :frames="animations[selectedAnimation].frames" :flipped="animations[selectedAnimation].flipped"  />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import Sprite from "./Sprite.vue";

import GridOutline from '@vicons/ionicons5/GridOutline'
import Person from '@vicons/carbon/Person'
import Cross from '@vicons/tabler/Cross'

defineProps(['sprite', 'weaponSprite'])

const animationOptions = [
  { label: "Attack right", value: 'atk_right' },
  { label: "Walk right", value: 'wlk_right' },
  { label: "Idle right", value: 'idl_right' },
  { label: "Attack up", value: 'atk_up' },
  { label: "Walk up", value: 'wlk_up' },
  { label: "Idle up", value: 'idl_up' },
  { label: "Attack down", value: 'atk_down' },
  { label: "Walk down", value: 'wlk_down' },
  { label: "Idle down", value: 'idl_down' },
  { label: "Attack left", value: 'atk_left' },
  { label: "Walk left", value: 'wlk_left' },
  { label: "Idle left", value: 'idl_left' },
]

const animations = {
  atk_right: { row: 0, speed: 200, frames: 5},
  wlk_right: { row: 1, speed: 250, frames: 4},
  idl_right: { row: 2, speed: 500, frames: 2},
  atk_up: { row: 3, speed: 200, frames: 5},
  wlk_up: { row: 4, speed: 250, frames: 4},
  idl_up: { row: 5, speed: 500, frames: 2},
  atk_down: { row: 6, speed: 200, frames: 5},
  wlk_down: { row: 7, speed: 250, frames: 4},
  idl_down: { row: 8, speed: 500, frames: 2},
  atk_left: { row: 0, speed: 200, frames: 5, flipped: true},
  wlk_left: { row: 1, speed: 250, frames: 4, flipped: true},
  idl_left: { row: 2, speed: 500, frames: 2, flipped: true},
}

// Add keyboard listeners to trigger animations
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') {
      selectedAnimation.value = 'wlk_right'
    } else if(e.key === 'ArrowLeft') {
      selectedAnimation.value = 'wlk_left'
    } else if(e.key === 'ArrowUp') {
      selectedAnimation.value = 'wlk_up'
    } else if(e.key === 'ArrowDown') {
      selectedAnimation.value = 'wlk_down'
    }

    // Add awsd
    if(e.key === 'd') {
      selectedAnimation.value = 'wlk_right'
    } else if(e.key === 'a') {
      selectedAnimation.value = 'wlk_left'
    } else if(e.key === 'w') {
      selectedAnimation.value = 'wlk_up'
    } else if(e.key === 's') {
      selectedAnimation.value = 'wlk_down'
    }

    // Add spacebar to trigger attack for current direction
    if(e.key === ' ') {
      selectedAnimation.value = selectedAnimation.value.replace('wlk', 'atk')
    }

    // Add esc and enter to trigger idle in current direction
    if(e.key === 'Enter' || e.key === 'Escape') {
      selectedAnimation.value = selectedAnimation.value.replace('atk', 'idl')
    }
  })
})

const gridMode = ref(false);
const selectedAnimation = ref('atk_right');
const zoom = ref(3)
const showWeapon = ref(true)
</script>

