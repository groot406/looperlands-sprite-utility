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
          <template v-for="(animation, key) in animations">
            <div class="flex items-center justify-center">
              <Sprite :key="key" v-if="sprite" :sprite="sprite" :size="32" :zoom="zoom"
                      :row="animation.row" :speed="slowMode ? animation.slowSpeed : animation.speed"
                      :frames="animation.frames" :flipped="animation.flipped"
                      :cooldown="animation.cooldown"/>
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
                      :cooldown="animation.cooldown"/>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="h-full">
        <div class="relative flex h-full flex-col items-center justify-center w-full">
          <n-select v-model:value="selectedAnimation" :options="animationOptions" label-field="label"/>
          <div class="relative w-full h-full -top-10 pointer-events-none">
            <div class="grid grid-cols-1 absolute w-full h-full">
              <div class="flex items-center justify-center">
                <Sprite v-if="sprite" :sprite="sprite" :size="32" :zoom="3 * zoom"
                        :row="animations[selectedAnimation].row"
                        :speed="slowMode ? animations[selectedAnimation].slowSpeed : animations[selectedAnimation].speed"
                        :frames="animations[selectedAnimation].frames" :flipped="animations[selectedAnimation].flipped"
                        :cooldown="animations[selectedAnimation].cooldown"/>
              </div>
            </div>
            <div class="grid grid-cols-1 absolute w-full h-full" v-if="showWeapon">
              <div class="flex items-center justify-center">
                <Sprite v-if="weaponSprite && showWeapon" :sprite="weaponSprite" :offset-x="16" :offset-y="10"
                        :size="48" :zoom="3 * zoom" :row="animations[selectedAnimation].row"
                        :speed="slowMode ? animations[selectedAnimation].slowSpeed : animations[selectedAnimation].speed"
                        :frames="animations[selectedAnimation].frames"
                        :flipped="animations[selectedAnimation].flipped"
                        :cooldown="animations[selectedAnimation].cooldown"/>
              </div>
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
import AnimalRabbit20Regular from '@vicons/fluent/AnimalRabbit20Regular'
import AnimalTurtle20Regular from '@vicons/fluent/AnimalTurtle20Regular'

defineProps(['sprite', 'weaponSprite'])

const slowMode = ref(false);

const animationOptions = [
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
]

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

// Add keyboard listeners to trigger animations
onMounted(() => {
  window.addEventListener('keydown', (e) => {
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
      selectedAnimation.value = selectedAnimation.value
          .replace('wlk', 'atk')
          .replace('idl', 'atk')
    }

    // Add esc and enter to trigger idle in current direction
    if (e.key === 'Enter' || e.key === 'Escape') {
      selectedAnimation.value = selectedAnimation.value
          .replace('atk', 'idl')
          .replace('wlk', 'idl')
    }
  })
})

const gridMode = ref(false);
const selectedAnimation = ref('idl_down');
const zoom = ref(3)
const showWeapon = ref(true)
</script>

