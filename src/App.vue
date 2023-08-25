<template>
  <div class="flex flex-row w-full overflow-hidden">
    <div class="w-1/2 h-screen overflow-hidden bg-slate-100 relative">
      <div class="flex items center w-full h-[200px] justify-center"><div class="max-w-[250px]"><img :src="logo"/></div></div>
      <SpriteDropArea v-model="droppedSprite" v-model:weapon="weaponSprite" />
    </div>
    <div class="w-1/2 relative">
      <div class="absolute bottom-0 z-0 w-full"><div class="w-full opacity-5"><img class="object-cover w-full" :src="bg"/></div></div>
      <SpritePreviewArea v-if="!syncing" :sprite="droppedSprite" :weapon-sprite="weaponSprite" class="z-1"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import SpriteDropArea from './components/SpriteDropArea.vue'
import SpritePreviewArea from './components/SpritePreviewArea.vue'
import logo from './assets/looperlandlogo.png'
import bg from './assets/final_looper_lands_charselect_sixframe.gif'
import { ref, watch } from 'vue'

const droppedSprite = ref(null)
const weaponSprite = ref(null)
const syncing = ref(false);

watch([droppedSprite, weaponSprite], (value) => {
  if(value) {
    syncing.value = true;
    setTimeout(() => {
      syncing.value = false;
    }, 1);
  }
})
</script>


<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
