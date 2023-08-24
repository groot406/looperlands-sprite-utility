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
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=0 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=1 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=2 speed=500 frames=2 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=3 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=4 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=5 speed=500 frames=2 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=6 speed=200 frames=5 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=7 speed=250 frames=4 /></div>
          <div class="flex items-center justify-center"><Sprite :sprite="weaponSprite" :size="48" :zoom="zoom*(2/3)" row=8 speed=500 frames=2 /></div>
        </div>
      </div>
      <div v-else class="h-full">
        <div class="relative flex h-full flex-col items-center justify-center">
          <n-select v-model:value="selectedAnimation" :options="animationOptions" label-field="label" />
          <div class="mt-10 flex relative w-full h-full pointer-events-none">
            <Sprite class="absolute top-0 left-0" v-if="sprite" :sprite="sprite" :size="32" :zoom="3 * zoom" :row="animations[selectedAnimation].row" :speed="animations[selectedAnimation].speed" :frames="animations[selectedAnimation].frames" />
            <Sprite class="absolute top-0 left-0" v-if="weaponSprite && showWeapon" :sprite="weaponSprite" :size="48" :zoom="2 * zoom" :row="animations[selectedAnimation].row" :speed="animations[selectedAnimation].speed" :frames="animations[selectedAnimation].frames" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
}

const gridMode = ref(false);
const selectedAnimation = ref('atk_right');
const zoom = ref(3)
const showWeapon = ref(true)
</script>

