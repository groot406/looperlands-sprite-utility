<template>
  <div class="flex flex-row w-full overflow-hidden">
    <div class="w-1/2 lg:w-1/3 h-screen overflow-hidden bg-slate-100 relative">
      <div class="flex items center w-full h-[200px] justify-center">
        <div class="max-w-[250px]"><img :src="logo"/></div>
      </div>
      <SpriteDropArea v-model="droppedSprite" v-model:weapon="weaponSprite" v-model:custom="customSprite"
                      @update:customsettings="setCustomSpriteSettings"/>
    </div>
    <div class="w-1/2 lg:w-2/3 relative bg-slate-800 ">
      <div class="absolute bottom-0 z-0 pointer-events-none w-full">
        <div class="w-full opacity-5"><img class="object-cover w-full" :src="bg"/></div>
      </div>
      <SpritePreviewArea
          :sprite="droppedSprite" :weapon-sprite="weaponSprite" :custom-sprite="customSprite"
          :customSpriteSettings="customSpriteSettings"
          @update:animation="setCurrentAnimation" @update:customAnimation="setCustomCurrentAnimation"
          @update:zoom="setCurrentZoom"
          @update:showWeapon="setShowWeapon" @update:grid-mode="setGridMode" @update:slowMode="setSlowMode"
          @update:subAnimation="updateSubAnimation" @update:frame="(frame) => currentFrame = frame"
          @update:customFrame="(customFrame) => currentCustomFrame = customFrame"
      />
    </div>
  </div>
  <div class="absolute bottom-4 right-4 flex gap-x-2" v-if="droppedSprite || weaponSprite || customSprite">
    <div
        v-if="droppedSprite || weaponSprite || customSprite"
        class="p-1 border rounded-full px-4 text-xs text-slate-200 border-slate-400 opacity-50 hover:opacity-100 cursor-pointer"
        @click="exportZip">Export
    </div>
    <div
        class="p-1 border rounded-full px-4 text-xs text-slate-200 border-slate-400 opacity-50 hover:opacity-100 cursor-pointer"
        @click="downloadPng">Save as Png
    </div>
    <div v-if="!gridMode && (droppedSprite || weaponSprite)"
         class="p-1 border flex items-center gap-x-2 rounded-full text-xs text-slate-200 border-slate-400 opacity-50 hover:opacity-100 cursor-pointer"
         :class="{'px-4': !exportingGifTotal, 'px-2': exportingGifTotal }"
         @click="showGifExport = true">
      <div v-if="exportingGifTotal" class="animate-spin w-[12px] h-[12px]">
        <n-icon class="animate-spin" :component="SpinnerIos20Filled"/>
      </div>
      Save as Gif
    </div>
    <div
        v-if="customSprite"
        class="p-1 border flex items-center gap-x-2 rounded-full text-xs text-slate-200 border-slate-400 opacity-50 hover:opacity-100 cursor-pointer"
        :class="{'px-4': !exportingTilesheetTotal, 'px-2': exportingTilesheetTotal }"
        @click="showTilesheetExport = true; tilesheetOptions.sprite = 'custom'">
      <div v-if="exportingTilesheetTotal" class="animate-spin w-[12px] h-[12px]">
        <n-icon class="animate-spin" :component="SpinnerIos20Filled"/>
      </div>
      Convert to tilesheet
    </div>
  </div>
  <div v-if="exporting">
    <template v-if="droppedSprite">
      <div id="export_character_1" class="sprite overflow-hidden" :style="{ width: '160px', height: '288px' }">
        <img :src="droppedSprite" :style="{width: '100%' }"/>
      </div>
      <div id="export_character_2" class="sprite overflow-hidden" :style="{ width: '320px', height: '576px' }">
        <img :src="droppedSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_character_3" class="sprite overflow-hidden" :style="{ width: '480px', height: '864px' }">
        <img :src="droppedSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_character_picker" class="relative sprite overflow-hidden flex items-center justify-center"
           :style="{ width: '600px', height: '600px' }">
        <div class="absolute bottom-0 z-0 w-full bg-slate-800">
          <div class="w-full opacity-10"><img class="object-cover w-full" :src="bg"/></div>
        </div>
        <Sprite :sprite="droppedSprite" :size="32" :zoom="10"
                :row="8"
                :speed="1000"
                :frame="0"
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
      <div id="export_weapon_picker" class="relative sprite overflow-hidden flex items-center justify-center"
           :style="{ width: '600px', height: '600px' }">
        <div class="absolute bottom-0 z-0 w-full bg-slate-800">
          <div class="w-full opacity-10"><img class="object-cover w-full" :src="bg"/></div>
        </div>
        <div class="relative left-[70px]">
          <Sprite :sprite="weaponSprite" :size="48" :zoom="10"
                  :row="8"
                  :frame="0"
                  :frames="1"
          />
        </div>
      </div>
    </template>

    <template v-if="customSprite">
      <div id="export_custom_1" class="sprite overflow-hidden" :style="{ width: customSpriteSettings.frameSize.width  * customCurrentAnimation.frames + 'px', height: customSpriteSettings.frameSize.height + 'px'}">
        <img :src="customSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_custom_2" class="sprite overflow-hidden" :style="{ width: customSpriteSettings.frameSize.width  * customCurrentAnimation.frames * 2 + 'px', height: customSpriteSettings.frameSize.height * 2 + 'px'}">
        <img :src="customSprite" :style="{width: '100%'}"/>
      </div>
      <div id="export_custom_3" class="sprite overflow-hidden" :style="{ width: customSpriteSettings.frameSize.width  * customCurrentAnimation.frames * 3 + 'px', height: customSpriteSettings.frameSize.height * 3 + 'px'}">
        <img :src="customSprite" :style="{width: '100%'}"/>
      </div>
    </template>
  </div>
  <teleport to="body">
    <n-modal v-model:show="showGifExport" preset="card" class="w-3/4" title="Gif exporter">
      <div class="flex xl:flex-row flex-col gap-x-10">
        <div class="w-1/2 flex flex-col">

          <n-form-item label="Use background color">
            <n-switch :disabled="exportingGifTotal" v-model:value="colorBg"/>
          </n-form-item>
          <n-form-item label="Background color">
            <n-color-picker :disabled="!colorBg || exportingGifTotal" v-model:value="colorBgColor"/>
          </n-form-item>
          <n-form-item label="Use background image">
            <n-switch :disabled="exportingGifTotal" v-model:value="imgBg"/>
          </n-form-item>
          <n-button @click="downloadGif" :disabled="exportingGifTotal" :loading="exportingGifTotal">Export to gif
          </n-button>
        </div>
        <div class="w-1/2 items-center place-self-end justify-self-end place-items-end justify-end flex">
          <div id="gifExport" :class="{'border': !exportingGif}" class="sprite relative pointer-events-none"
               :style="{width: '384px', height: '384px' }">
            <div class="absolute bottom-0 z-0 w-full bg-slate-800">
              <div v-if="imgBg" class="w-full opacity-10"><img class="object-cover w-full" :src="exportBg"/></div>
              <div v-if="colorBg && !imgBg" :style="{backgroundColor: colorBgColor}" class="w-[384px] h-[384px]"></div>
            </div>

              <div v-if="droppedSprite" class="flex absolute w-full h-full">
                <div class="flex items-center justify-center w-full">
                  <Sprite v-if="exportAnimation"
                          :sprite="droppedSprite" :frame="exportFrame"
                          :row="exportAnimation.row" :zoom="1.5 * currentZoom" :size="32"
                          :flipped="exportAnimation.flipped"
                  />
                  <Sprite v-else :sprite="droppedSprite" :frame="currentFrame"
                          :row="currentAnimation.row" :zoom="1.5 * currentZoom" :size="32"
                          :flipped="currentAnimation.flipped"
                  />
                </div>
              </div>
              <div v-if="weaponSprite && showWeapon" class="flex absolute w-full h-full">
                <div class="flex items-center justify-center w-full">
                  <Sprite v-if="exportAnimation" :sprite="weaponSprite" :frame="exportFrame"
                          :row="exportAnimation.row" :zoom="1.5 * currentZoom" :size="48"
                          :flipped="exportAnimation.flipped"/>
                  <Sprite v-else :sprite="weaponSprite"
                          :frame="currentFrame"
                          :row="currentAnimation.row" :zoom="1.5 * currentZoom" :size="48"
                          :flipped="currentAnimation.flipped"/>
                </div>
              </div>

            <template v-if="gifExportSheet === 'custom'">
              <div v-if="customSprite" class="flex absolute w-full h-full">
                <div class="flex items-center justify-center w-full">
                  <Sprite v-if="exportAnimation" :sprite="customSprite" :frame="exportFrame"
                          :row="exportAnimation.row" :zoom="1" :size="customSpriteSettings.frameSize.width"
                          :flipped="exportAnimation.flipped"/>
                  <Sprite v-else :sprite="customSprite"
                          :frame="currentCustomFrame"
                          :row="customCurrentAnimation.row" :zoom="1" :size="customSpriteSettings.frameSize.width"
                          :flipped="currentAnimation.flipped"/>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </n-modal>
  </teleport>
  <teleport to="body">
    <n-modal v-model:show="showTilesheetExport" preset="card" class="w-4/5" title="Tilesheet exporter">
      <div class="flex xl:flex-row flex-col gap-x-10">
        <div class="flex flex-col">
          <n-form-item label="Tilesize">
            <n-input-number :disabled="exportingTilesheetTotal" v-model:value="tilesheetOptions.tilesize"/>
          </n-form-item>
          <n-button @click="downloadTilesheet" :disabled="exportingGifTotal" :loading="exportingTilesheetTotal">Download
            tilesheet
          </n-button>
        </div>
        <div class="flex items-center justify-center overflow-hidden mt-2">
          <div id="tilesheetExport" :class="{'border': !exportingTilesheetTotal}"
               class="sprite relative pointer-events-none flex flex-col">
            <div class="flex flex-row" v-for="row in tilesheetOutput.tiles_per_row_frame">
              <div class="flex flex-row" v-for="col in tilesheetOutput.tiles_per_column_frame">
                <template v-for="frame in tilesheetOutput.total_frames">
                  <div :style="getTileStyle(row-1,col-1,frame-1)"/>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </teleport>
</template>

<script setup lang="ts">
import SpriteDropArea from './components/SpriteDropArea.vue'
import SpritePreviewArea from './components/SpritePreviewArea.vue'
import logo from './assets/looperlandlogo.png'
import exportBg from './assets/final_looper_lands_charselect_sixframe.png'
import bg from './assets/final_looper_lands_charselect_sixframe.gif'
import {computed, nextTick, ref} from 'vue'
import _ from 'lodash';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import Sprite from "./components/Sprite.vue";
import GIF from "gif.js.optimized";
import SpinnerIos20Filled from '@vicons/fluent/SpinnerIos20Filled';

const droppedSprite = ref(null)
const weaponSprite = ref(null)
const customSprite = ref(null)

const exporting = ref(false);
const exportFrame = ref(null);
const exportAnimation = ref(null);
const currentAnimation = ref(null);
const customCurrentAnimation = ref(null);
const currentZoom = ref(null);
const showWeapon = ref(null);
const slowMode = ref(null);
const gridMode = ref(null);
const gifExportSheet = ref(null);
const showGifExport = ref(false);
const exportingGif = ref(false);
const exportingGifTotal = ref(false);
const exportingZip = ref(false);
const imgBg = ref(false);
const colorBg = ref(true);
const colorBgColor = ref('#F3F3F3');
const currentFrame = ref(0);
const currentCustomFrame = ref(0);

const customSpriteSettings = ref({})

const exportingTilesheetTotal = ref(false);
const showTilesheetExport = ref(false);
const tilesheetOptions = ref({
  sprite: null,
  tilesize: 16,
});
const spriteOptions = computed(() => {
  let options = [];
  if (droppedSprite.value) {
    options.push({
      label: 'Character',
      value: 'character'
    })
  }

  if (weaponSprite.value) {
    options.push({
      label: 'Weapon',
      value: 'weapon'
    })
  }

  if (customSprite.value) {
    options.push({
      label: 'Custom',
      value: 'custom'
    })
  }
  return options;
})

function downloadPng() {
  exporting.value = true;

  htmlToImage.toPng(document.getElementById('preview'))
      .then(function (dataUrl) {
        htmlToImage.toPng(document.getElementById('preview'))
            .then(function (dataUrl) {
              download(dataUrl);
              exporting.value = false;
            });
      });

}

function download(uri, filename) {
  var link = document.createElement("a");
  link.download = filename ? filename : 'looperlands';
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const subAnimationIndex = ref(0);
const subAnimations = ref(null);

function setCurrentAnimation(animation) {
  if (_.isArray(animation)) {
    subAnimationIndex.value = 0;
    subAnimations.value = animation;
    currentAnimation.value = animation[0];
    return;
  } else {
    subAnimations.value = null;
    currentAnimation.value = animation;
  }
}

function updateSubAnimation(index) {
  currentAnimation.value = subAnimations.value[index];
}

function setCurrentZoom(zoom) {
  currentZoom.value = zoom;
}

function setShowWeapon(show) {
  showWeapon.value = show;
}

function setSlowMode(slow) {
  slowMode.value = slow;
}

function setGridMode(grid) {
  gridMode.value = grid;
}

async function exportZip() {
  if (!droppedSprite.value && !weaponSprite.value && !customSprite.value) {
    return;
  }

  exporting.value = true;

  nextTick(() => {
    setTimeout(() => {
      let exportedImages = 0;
      let exportTarget = 0;
      if(droppedSprite.value) {
        exportTarget += 4;
      }
      if(weaponSprite.value) {
        exportTarget += 4;
      }
      if(customSprite.value) {
        exportTarget += 3;
      }

      let file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3;

      if (droppedSprite.value) {
        htmlToImage.toBlob(document.getElementById('export_character_1'), {
          pixelRatio: 1,
          width: 160,
          height: 288
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_character_1'), {
            pixelRatio: 1,
            width: 160,
            height: 288
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            file1 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_character_2'), {
          pixelRatio: 1,
          width: 320,
          height: 576
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_character_2'), {
            pixelRatio: 1,
            width: 320,
            height: 576
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            file2 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_character_3'), {
          pixelRatio: 1,
          width: 480,
          height: 864
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_character_3'), {
            pixelRatio: 1,
            width: 480,
            height: 864
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            file3 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_character_picker'), {
          pixelRatio: 1,
          width: 600,
          height: 600
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_character_picker'), {
            pixelRatio: 1,
            width: 600,
            height: 600
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            picker = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });
      }

      if (weaponSprite.value) {
        htmlToImage.toBlob(document.getElementById('export_weapon_1'), {
          pixelRatio: 1,
          width: 240,
          height: 432
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_weapon_1'), {
            pixelRatio: 1,
            width: 240,
            height: 432
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            weaponFile1 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_weapon_2'), {
          pixelRatio: 1,
          width: 480,
          height: 864
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_weapon_2'), {
            pixelRatio: 1,
            width: 480,
            height: 864
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            weaponFile2 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_weapon_3'), {
          pixelRatio: 1,
          width: 720,
          height: 1296
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_weapon_3'), {
            pixelRatio: 1,
            width: 720,
            height: 1296
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            weaponFile3 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_weapon_picker'), {
          pixelRatio: 1,
          width: 600,
          height: 600
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_weapon_picker'), {
            pixelRatio: 1,
            width: 600,
            height: 600
          }).then(function (blob) {
            exportedImages++;
            weaponPicker = blob;
            if (exportedImages === exportTarget) {
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
            }
          });
        });
      }

      if (customSprite.value) {
        htmlToImage.toBlob(document.getElementById('export_custom_1'), {
          pixelRatio: 1,
          width: customSpriteSettings.value.frameSize.width * customCurrentAnimation.value.frames,
          height: customSpriteSettings.value.frameSize.height
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_custom_1'), {
            pixelRatio: 1,
            width: customSpriteSettings.value.frameSize.width * customCurrentAnimation.value.frames,
            height: customSpriteSettings.value.frameSize.height
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            customFile1 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_custom_2'), {
          pixelRatio: 1,
          width: customSpriteSettings.value.frameSize.width * customCurrentAnimation.value.frames * 2,
          height: customSpriteSettings.value.frameSize.height * 2
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_custom_2'), {
            pixelRatio: 1,
            width: customSpriteSettings.value.frameSize.width * customCurrentAnimation.value.frames * 2,
            height: customSpriteSettings.value.frameSize.height * 2
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            customFile2 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });

        htmlToImage.toBlob(document.getElementById('export_custom_3'), {
          pixelRatio: 1,
          width: customSpriteSettings.value.frameSize.width * customCurrentAnimation.value.frames * 3,
          height: customSpriteSettings.value.frameSize.height * 3
        }).then(function (blob) {
          htmlToImage.toBlob(document.getElementById('export_custom_3'), {
            pixelRatio: 1,
            width: customSpriteSettings.value.frameSize.width * customCurrentAnimation.value.frames * 3,
            height: customSpriteSettings.value.frameSize.height * 3
          }).then(function (blob) {
            exporting.value = false;
            exportedImages++;
            customFile3 = blob;
            if (exportedImages === exportTarget)
              generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3);
          });
        });
      }

    }, 500)
  })
}

function generateZip(file1, file2, file3, picker, weaponFile1, weaponFile2, weaponFile3, weaponPicker, customFile1, customFile2, customFile3) {
  if (exportingZip.value) {
    return;
  }

  exportingZip.value = true;

  const zip = new JSZip();
  if (droppedSprite.value) {
    zip.file('avatar/avatar.png', picker);
    zip.file('avatar/1.png', file1);
    zip.file('avatar/2.png', file2);
    zip.file('avatar/3.png', file3);
  }

  if (weaponSprite.value) {
    zip.file('weapon/weapon.png', weaponPicker);
    zip.file('weapon/1.png', weaponFile1);
    zip.file('weapon/2.png', weaponFile2);
    zip.file('weapon/3.png', weaponFile3);
  }

  if (customSprite.value) {
    zip.file('custom/1.png', customFile1);
    zip.file('custom/2.png', customFile2);
    zip.file('custom/3.png', customFile3);
  }

  zip.generateAsync({type: 'blob'}).then(function (content) {
    FileSaver.saveAs(content, 'export.zip');
    setTimeout(() => {
      exportingZip.value = false;
      exporting.value = false;
    }, 100);
  });
}

let encoder = null;

function downloadGif() {

  exportingGif.value = true;
  exportingGifTotal.value = true;
  encoder = new GIF({
    workers: 2,
    quality: 1,
    width: 384,
    height: 384,
    dither: false
  });
  encoder.on('finished', function (blob) {
    exportFrame.value = null;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    document.body.appendChild(a);
    a.download = 'looperlands.gif';
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    exportingGifTotal.value = false;
    showGifExport.value = false;
    exportAnimation.value = null;
  });


  if (!_.isArray(subAnimations.value)) {
    subAnimations.value = [currentAnimation.value];
  }

  let totalTime = 500;

  for (let a = 0; a < Object.keys(subAnimations.value).length; a++) {

    let animationIndex = a;
    exportAnimation.value = subAnimations.value[Object.keys(subAnimations.value)[animationIndex]];
    setTimeout(() => {
      exportAnimation.value = subAnimations.value[Object.keys(subAnimations.value)[animationIndex]];
    }, totalTime)

    for (let i = 0; i < exportAnimation.value.frames; i++) {
      let speed = slowMode.value ? exportAnimation.value.slowSpeed : exportAnimation.value.speed;

      totalTime += speed;
      let frame = i;
      setTimeout(() => exportFrame.value = frame, totalTime + 5)
      setTimeout(() => addFrame(speed), totalTime + 10)

      if (exportAnimation.value.cooldown && i === exportAnimation.value.frames - 1) {
        totalTime += exportAnimation.value.cooldown;
        setTimeout(() => addFrame(speed), totalTime)
      }
    }
  }

  setTimeout(() => {
    exportingGif.value = false;
    encoder.render()
  }, totalTime + 100);

}

function addFrame(delay) {
  htmlToImage.toCanvas(document.getElementById('gifExport'), {
    pixelRatio: 1,
    width: 384,
    height: 384
  })
      .then((canvas) => {
        htmlToImage.toCanvas(document.getElementById('gifExport'), {
          pixelRatio: 1,
          width: 384,
          height: 384
        })
            .then((canvas) => {
              let options = {copy: true}
              if (delay) {
                options.delay = delay;
              }
              encoder.addFrame(canvas, options)
            })
      })
}

const tilesheetOutput = computed(() => {
  let framesize = null;

  if (tilesheetOptions.value.sprite === 'character') {
    framesize = {
      width: 32,
      height: 32
    };
  } else if (tilesheetOptions.value.sprite === 'weapon') {
    framesize = {
      width: 48,
      height: 48
    };
  } else if (tilesheetOptions.value.sprite === 'custom') {
    framesize = customSpriteSettings.value.frameSize;
  }

  if (framesize === null || framesize === undefined) {
    return {};
  }

  return {
    sprite: (tilesheetOptions.value.sprite === 'character') ? droppedSprite.value : (tilesheetOptions.value.sprite === 'weapon') ? weaponSprite.value : customSprite.value,
    tiles_per_column_frame: Math.ceil(framesize.width / tilesheetOptions.value.tilesize),
    tiles_per_row_frame: Math.ceil(framesize.height / tilesheetOptions.value.tilesize),
    total_frames: customCurrentAnimation.value.frames
  }
});

function getTileStyle(row, col, frame) {
  let framesize = null;

  if (tilesheetOptions.value.sprite === 'character') {
    framesize = {
      width: 32,
      height: 32
    };
  } else if (tilesheetOptions.value.sprite === 'weapon') {
    framesize = {
      width: 48,
      height: 48
    };
  } else if (tilesheetOptions.value.sprite === 'custom') {
    framesize = customSpriteSettings.value.frameSize;
  }

  if (framesize === null || framesize === undefined) {
    return {};
  }

  return {
    width: tilesheetOptions.value.tilesize + 'px',
    height: tilesheetOptions.value.tilesize + 'px',
    overflow: 'hidden',
    backgroundImage: 'url(' + tilesheetOutput.value.sprite + ')',
    backgroundPositionX: (((col * tilesheetOptions.value.tilesize) + (frame * framesize.width)) * -1) + 'px',
    backgroundPositionY: (row * tilesheetOptions.value.tilesize * -1) + (customCurrentAnimation.value.row * framesize.height) + 'px',
  }
}

function downloadTilesheet() {
  exportingTilesheetTotal.value = true;

  setTimeout(() => {
    htmlToImage.toPng(document.getElementById('tilesheetExport'), {pixelRatio: 1})
        .then(function (dataUrl) {
          htmlToImage.toPng(document.getElementById('tilesheetExport'), {pixelRatio: 1})
              .then(function (dataUrl) {
                download(dataUrl, 'tilesheet.png');
                exportingTilesheetTotal.value = false;
              });
        });
  }, 100)
}

function setCustomSpriteSettings(settings) {
  customSpriteSettings.value = settings;
}

function setCustomCurrentAnimation(animation) {
  customCurrentAnimation.value = animation;
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
