<template>
  <div class="w-full min-h-[calc(100vh-150px)] text-center p-10 pb-0 flex flex-col">
    <div class="flex flex-col">
      <NUpload @update:file-list="onFileChange" :show-file-list="false" class="mb-2" multiple>
        <NUploadDragger>
          Drop your <b>avatar</b> sprite here. Use the 100% version.
        </NUploadDragger>
      </NUpload>
      <div class="flex flex-col gap-y-2 w-full text-left mb-6 max-h-[20vh] overflow-y-auto" v-if="spriteFiles.length > 0">
        <div v-for="(sprite, idx) in spriteFiles" class="flex rounded flex-row p-2 border bg-slate-50 cursor-pointer"
             :class="{ 'hover:bg-slate-200': !(activeSprite === idx), 'bg-slate-700 text-white': activeSprite === idx }"
             @click="selectSprite(idx)">
          <div class="flex-grow">{{ sprite.name }}</div>
          <div>
            <n-icon :component="TrashCan" class="opacity-50 hover:opacity-100" @click.stop="removeFile(idx)"/>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full border-b border-slate-300 mb-6 flex justify-center"><div class="relative top-[10px] text-slate-400 bg-slate-100 w-6">+</div></div>
    <div class="flex flex-col">
      <NUpload @update:file-list="onWeaponFileChange" :show-file-list="false" multiple class="mb-2">
        <NUploadDragger>
          Drop your <b>weapon</b> sprite here. Use the 100% version.
        </NUploadDragger>
      </NUpload>
      <div class="flex flex-col gap-y-2 w-full text-left mb-6 max-h-[20vh] overflow-y-auto" v-if="weaponSpriteFiles.length > 0">
        <div v-for="(sprite, idx) in weaponSpriteFiles"
             class="flex rounded flex-row p-2 border bg-slate-50 cursor-pointer"
             :class="{ 'hover:bg-slate-200': !(activeWeaponSprite === idx), 'bg-slate-700 text-white': activeWeaponSprite === idx }"
             @click="selectWeaponSprite(idx)">
          <div class="flex-grow">{{ sprite.name }}</div>
          <div>
            <n-icon :component="TrashCan" class="opacity-50 hover:opacity-100" @click.stop="removeWeaponFile(idx)"/>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full border-b border-slate-300 mb-6 flex justify-center"><div class="relative top-[10px] text-slate-400 bg-slate-100 w-6">or</div></div>
    <div class="flex flex-col">
      <NUpload @update:file-list="onCustomFileChange" :show-file-list="false" class="mb-2" :max="1">
        <NUploadDragger>
          <div class="flex flex-row items-center justify-between">
            <div class="flex-grow text-center">Drop your <b>custom</b> sprite or animated gif here.</div>
          </div>
        </NUploadDragger>
      </NUpload>
      <div class="flex flex-col gap-y-2 w-full text-left mb-6 max-h-[20vh] overflow-y-auto">
        <div v-for="(sprite, idx) in customSpriteFiles"
             class="flex rounded flex-row p-2 border cursor-pointer bg-slate-700 text-white"
             @click="selectCustomSprite(idx)">
          <div class="flex-grow">{{ sprite.name }}</div>
          <div class="flex flex-row gap-x-4 items-center">
            <n-icon v-if="customSpriteFiles.length" class="opacity-70 hover:opacity-100"
                    @click.prevent.stop="showSpriteImport = true" size="large">
              <SlidersH/>
            </n-icon>
            <n-icon :component="TrashCan" class="opacity-70 hover:opacity-100" size="large" @click.stop="removeCustomFile(idx)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <n-modal v-model:show="showSpriteImport" preset="card" class="w-1/2" title="Custom Sprite configuration">
      <div class="flex xl:flex-row flex-col gap-x-10 w-full">
        <div class="flex flex-col w-full">
          <n-form-item label="Frame size">
            <n-input-number v-model:value="customSpriteFramesize.width"/>
            <div class="mx-4">X</div>
            <n-input-number v-model:value="customSpriteFramesize.height"/>
          </n-form-item>
          <div class="flex flex-col w-full">
            <div class="my-1 w-full">
              <div class="flex flex-row items-center gap-x-2">
                <div class="w-1/12 text-slate-400 text-xs">Row #</div>
                <div class="w-5/12 text-slate-400 text-xs">Name</div>
                <div class="w-3/12 text-slate-400 text-xs"># of Frames</div>
                <div class="w-3/12 text-slate-400 text-xs">Speed (ms/frame)</div>
              </div>
            </div>
            <div v-for="animation in customSettings.animations" class="my-1 w-full">
              <div class="flex flex-row items-center gap-x-2 w-full">
                <div class="w-5/12"><n-input v-model:value="animation.name" placeholder="Name"/></div>
                <div class="w-3/12"><n-input-number v-model:value="animation.frames" placeholder="Frames"/></div>
                <div class="w-3/12"><n-input-number v-model:value="animation.speed" placeholder="Speed (ms/frame)"/></div>
              </div>
            </div>

          </div>
          <n-button class="mt-6" @click="showSpriteImport=false">Save</n-button>
        </div>
      </div>
    </n-modal>
  </teleport>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import TrashCan from '@vicons/carbon/TrashCan'
import SlidersH from '@vicons/fa/SlidersH'
import { parseGIF, decompressFrames } from 'gifuct-js'
import _ from 'lodash'

const props = defineProps({
  modelValue: {required: true},
  weapon: {required: true},
  custom: {required: true}
});
const emit = defineEmits(['update:modelValue', 'update:weapon', 'update:custom', 'update:customsettings'])

const input = ref(props.modelValue);
const spriteFiles = ref([]);
const activeSprite = ref(0);
const weaponInput = ref(props.weapon);
const weaponSpriteFiles = ref([]);
const activeWeaponSprite = ref(0);

const customInput = ref(props.custom);
const showSpriteImport = ref(false);
const customSpriteFiles = ref([]);
const customSpriteFramesize = ref({width: 32, height: 32});
const customSpriteDimensions = ref({width: 0, height: 0});

watch(input, (value) => {
  emit('update:modelValue', value);
});

watch(weaponInput, (value) => {
  emit('update:weapon', value);
});


watch(customInput, (value) => {
  emit('update:custom', value);
});

function createImage(file) {
  var reader = new FileReader();

  reader.onload = (e) => {
    input.value = e.target.result;
  };
  reader.readAsDataURL(file.file);
}

function createWeaponImage(file) {
  var reader = new FileReader();

  reader.onload = (e) => {
    weaponInput.value = e.target.result;
  };
  reader.readAsDataURL(file.file);
}


function createCustomImage(file) {
  var reader = new FileReader();
  let frameDelay = 100;
  let frameCount = 0;

  reader.onload = (e) => {
    let img = new Image();
    let imgData = e.target.result;

    img.onload = () => {
      customSpriteDimensions.value = {width: img.width, height: img.height}
      customAnimations.value = [];
      for(let i = 0; i < rows.value; i++) {
        customAnimations.value.push({name: 'Animation #' + (i+1), row: i, frames: frameCount, speed: frameDelay});
      }
      customInput.value = imgData
    }

    if(file.type === "image/gif") {

      var gifReader = new FileReader();
      gifReader.onload = (e) => {
        var gif = parseGIF(gifReader.result)
        var frames = decompressFrames(gif, true)

        const canvas = document.createElement('canvas');

        console.log(frames);
        _.forEach(frames, (frame, idx) => {
          if(frame.disposalType === 2 || idx === 0 || idx+1 === frames.length) {
            frameCount++
          }
        });

        const frameWidth = frames[0].dims.width;
        const frameHeight = frames[0].dims.height;

        frameDelay = frames[0].delay;
        canvas.width = frameWidth * frameCount;
        canvas.height = frameHeight;

        const ctx = canvas.getContext("2d");
        let nextX = 0;

        _.forEach(frames, (frame, idx) => {
          const frameCanvas = document.createElement('canvas');
          frameCanvas.width = frame.dims.width;
          frameCanvas.height = frame.dims.height;

          const frameCtx = frameCanvas.getContext("2d");
          let frameImageData = frameCtx.createImageData(frame.dims.width, frame.dims.height)
          frameImageData.data.set(frame.patch);
          frameCtx.putImageData(frameImageData, 0, 0)

          ctx.drawImage(frameCanvas, nextX + frame.dims.left, frame.dims.top);
          nextX += frameWidth
          if(frame.disposalType === 1){
            let nextFrame = frames[idx+1];
            if(nextFrame) {
              // copy frame
              ctx.drawImage(canvas,  nextX - frameWidth, 0, frameWidth, frameHeight, nextX, 0, frameWidth, frameHeight)
            }
          }
        });

        imgData = canvas.toDataURL();
        img.src = imgData;
        customSpriteFramesize.value = {width: frameWidth, height: frameHeight};
      }
      gifReader.readAsArrayBuffer(file.file);
    } else {
      img.src = imgData
    }
  };

  reader.readAsDataURL(file.file);
}

watch(customSpriteFramesize, () => {
  const prevAnimations = _.cloneDeep(customAnimations.value);
  customAnimations.value = [];
  for(let i = 0; i < rows.value; i++) {
    if(prevAnimations[i]) {
      if(prevAnimations[i].frames > framesPerRow.value) {
        prevAnimations[i].frames = framesPerRow.value;
      }
      customAnimations.value.push(prevAnimations[i]);
      continue;
    }
    customAnimations.value.push({name: 'Animation #' + (i+1), row: i, frames: framesPerRow.value, speed: 100});
  }
}, { deep: true})

function onFileChange(fileList) {

  if (!fileList.length)
    return;

  spriteFiles.value = fileList;
  createImage(fileList[activeWeaponSprite.value]);
}

function selectSprite(idx) {
  activeSprite.value = idx
  createImage(spriteFiles.value[idx])
}

function removeFile(idx) {
  spriteFiles.value.splice(idx, 1);
  if (idx === activeSprite.value) {
    activeSprite.value = 0;
    if (spriteFiles.value.length) {
      createImage(spriteFiles.value[0]);
    } else {
      input.value = null;
    }
  }
  if (idx < activeSprite.value) {
    activeSprite.value--;
  }
}

function removeWeaponFile(idx) {
  weaponSpriteFiles.value.splice(idx, 1);
  if (idx === activeWeaponSprite.value) {
    activeWeaponSprite.value = 0;
    if (weaponSpriteFiles.value.length) {
      createWeaponImage(weaponSpriteFiles.value[0]);
    } else {
      weaponInput.value = null;
    }
  }
  if (idx < activeWeaponSprite.value) {
    activeWeaponSprite.value--;
  }
}

function selectWeaponSprite(idx) {
  activeWeaponSprite.value = idx
  createWeaponImage(weaponSpriteFiles.value[idx])
}

function onWeaponFileChange(fileList) {

  if (!fileList.length)
    return;

  weaponSpriteFiles.value = fileList;
  createWeaponImage(fileList[activeWeaponSprite.value]);
}


function removeCustomFile(idx) {
  customSpriteFiles.value.splice(idx, 1);
  customInput.value = null;
}

function selectCustomSprite(idx) {
  createCustomImage(customSpriteFiles.value[idx])
}

function onCustomFileChange(fileList) {
  customSpriteFiles.value = [];

  if (!fileList.length) {
    return;
  }

  customAnimations.value = [];
  customSpriteFiles.value = fileList;
  fileList = null;
  showSpriteImport.value = true;
  selectCustomSprite(0);
}

const customAnimations = ref([])

const customSettings = computed(() => {
  return {
    frameSize: customSpriteFramesize.value,
    animations: customAnimations.value
  }
})

const framesPerRow = computed(() => {
  if (!customSpriteDimensions.value.width || !customSpriteFramesize.value.width) {
    return 1;
  }
  return Math.ceil(customSpriteDimensions.value.width / customSpriteFramesize.value.width);
})

const rows = computed(() => {
  if (!customSpriteDimensions.value.height || !customSpriteFramesize.value.height) {
    return 1;
  }
  return Math.ceil(customSpriteDimensions.value.height / customSpriteFramesize.value.height);
})

watch(() => customSettings.value, (value) => {
  emit('update:customsettings', customSettings.value);
}, {deep: true, immediate: true})
</script>

