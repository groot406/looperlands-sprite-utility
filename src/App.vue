<template>
  <div class="flex flex-row w-full overflow-hidden">
    <div class="w-1/2 h-screen overflow-hidden bg-slate-100 relative">
      <div class="flex items center w-full h-[200px] justify-center">
        <div class="max-w-[250px]"><img :src="logo"/></div>
      </div>
      <SpriteDropArea v-model="droppedSprite" v-model:weapon="weaponSprite"/>
    </div>
    <div class="w-1/2 relative">
      <div class="absolute bottom-0 z-0 w-full">
        <div class="w-full opacity-5"><img class="object-cover w-full" :src="bg"/></div>
      </div>
      <SpritePreviewArea v-if="!syncing" :sprite="droppedSprite" :weapon-sprite="weaponSprite" class="z-1"/>
    </div>
  </div>
  <div class="absolute bottom-4 right-4 flex gap-x-2">
    <div
        class="p-1 border rounded-full px-4 text-xs text-slate-200 border-slate-400 opacity-50 hover:opacity-100 cursor-pointer"
        @click="exportZip">Export
    </div>
    <div
        class="p-1 border rounded-full px-4 text-xs text-slate-200 border-slate-400 opacity-50 hover:opacity-100 cursor-pointer"
        @click="downloadPng">Save as Png
    </div>
  </div>
  <div v-show="exporting">
    <template v-if="droppedSprite">
      <div id="export_character_1" class="sprite overflow-hidden" :style="{ width: '160px', height: '288px' }">
        <img :src="droppedSprite"/>
      </div>
      <div id="export_character_2" class="sprite overflow-hidden" :style="{ width: '320px', height: '576px' }">
        <img :src="droppedSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_character_3" class="sprite overflow-hidden" :style="{ width: '480px', height: '864px' }">
        <img :src="droppedSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_character_picker" class="relative sprite overflow-hidden flex items-center justify-center" :style="{ width: '500px', height: '500px' }">
        <div class="absolute bottom-0 z-0 w-full bg-slate-800">
          <div class="w-full opacity-10"><img class="object-cover w-full" :src="bg"/></div>
        </div>
        <Sprite :sprite="droppedSprite" :size="32" :zoom="10"
                :row="8"
                :speed="1000"
                :frames="1"
        />
      </div>
    </template>
    <template v-if="weaponSprite">
      <div id="export_weapon_1" class="sprite overflow-hidden" :style="{ width: '240px', height: '432px' }">
        <img :src="weaponSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_weapon_2" class="sprite overflow-hidden" :style="{ width: '480px', height: '864px' }">
        <img :src="weaponSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_weapon_3" class="sprite overflow-hidden" :style="{ width: '720px', height: '1296px' }">
        <img :src="weaponSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_weapon_picker" class="relative sprite overflow-hidden flex items-center justify-center" :style="{ width: '500px', height: '500px' }">
        <div class="absolute bottom-0 z-0 w-full bg-slate-800">
          <div class="w-full opacity-10"><img class="object-cover w-full" :src="bg"/></div>
        </div>
        <div class="relative left-[70px]"><Sprite :sprite="weaponSprite" :size="48" :zoom="10"
                :row="8"
                :speed="1000"
                :frames="1"
        />
        </div>
      </div>
    </template>
  </div>
</template>


<script setup lang="ts">
import SpriteDropArea from './components/SpriteDropArea.vue'
import SpritePreviewArea from './components/SpritePreviewArea.vue'
import logo from './assets/looperlandlogo.png'
import bg from './assets/final_looper_lands_charselect_sixframe.gif'
import {nextTick, ref, watch} from 'vue'
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import Sprite from "./components/Sprite.vue";

const droppedSprite = ref(null)
const weaponSprite = ref(null)
const syncing = ref(false);
const exporting = ref(false);

watch([droppedSprite, weaponSprite], (value) => {
  if (value) {
    syncing.value = true;
    setTimeout(() => {
      syncing.value = false;
    }, 1);
  }
})

function downloadPng() {
  exporting.value = true;
  htmlToImage.toPng(document.getElementById('preview'))
      .then(function (dataUrl) {
        download(dataUrl);
        exporting.value = false;
      });
}

function download(uri) {
  var link = document.createElement("a");
  link.download = 'looperlands';
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportZip() {
  if (!droppedSprite.value && !weaponSprite.value) return;
  exporting.value = true;

  nextTick(() => {
    let exportedImages = 0;
    let exportTarget = (droppedSprite.value && weaponSprite.value) ? 8 : 4;
    let file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker;

    if (droppedSprite.value) {
      htmlToImage.toBlob(document.getElementById('export_character_1'))
          .then(function (blob) {
            exporting.value = false;
            exportedImages++;
            file1 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, weaponFile1, weaponFile2, weaponFile3);
          });

      htmlToImage.toBlob(document.getElementById('export_character_2'))
          .then(function (blob) {
            exportedImages++;
            file2 = blob;
            if (exportedImages === exportTarget) {
              exporting.value = false;
              generateZip(file1, file2, file3, weaponFile1, weaponFile2, weaponFile3);
            }
          });

      htmlToImage.toBlob(document.getElementById('export_character_3'))
          .then(function (blob) {
            exportedImages++;
            file3 = blob;
            if (exportedImages === exportTarget) {
              exporting.value = false;
              generateZip(file1, file2, file3, weaponFile1, weaponFile2, weaponFile3);
            }
          });

      htmlToImage.toBlob(document.getElementById('export_character_picker'))
          .then(function (blob) {
            exportedImages++;
            picker = blob;
            if (exportedImages === exportTarget) {
              exporting.value = false;
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker);
            }
          });
    }

    if (weaponSprite.value) {
      htmlToImage.toBlob(document.getElementById('export_weapon_1'))
          .then(function (blob) {
            exportedImages++;
            weaponFile1 = blob;
            if (exportedImages === 6) {
              exporting.value = false;
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker);
            }
          });

      htmlToImage.toBlob(document.getElementById('export_weapon_2'))
          .then(function (blob) {
            exportedImages++;
            weaponFile2 = blob;
            if (exportedImages === 6) {
              exporting.value = false;
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker);
            }
          });

      htmlToImage.toBlob(document.getElementById('export_weapon_3'))
          .then(function (blob) {
            exportedImages++;
            weaponFile3 = blob;
            if (exportedImages === 6) {
              exporting.value = false
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker);
            }
          });

      htmlToImage.toBlob(document.getElementById('export_weapon_picker'))
          .then(function (blob) {
            exportedImages++;
            weaponPicker = blob;
            if (exportedImages === exportTarget) {
              exporting.value = false;
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker);
            }
          });
    }
  })
}

function generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker) {
  const zip = new JSZip();
  if (droppedSprite.value) {
    zip.file('avatar/1.png', file1);
    zip.file('avatar/2.png', file2);
    zip.file('avatar/3.png', file3);
    zip.file('avatar/picker.png', picker);
  }

  if (weaponSprite.value) {
    zip.file('weapon/1.png', weaponFile1);
    zip.file('weapon/2.png', weaponFile2);
    zip.file('weapon/3.png', weaponFile3);
    zip.file('weapon/picker.png', weaponPicker);
  }
  zip.generateAsync({type: 'blob'}).then(function (content) {
    FileSaver.saveAs(content, 'export.zip');
  });

}
</script>


<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

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
