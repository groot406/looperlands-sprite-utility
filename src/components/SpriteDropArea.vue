<template>
  <div class="w-full h-full text-center p-10">
    <div class="flex flex-col">
      <NUpload @update:file-list="onFileChange" :show-file-list="false" class="mt-10 mb-2" multiple>
        <NUploadDragger>
          Drop your <b>avatar</b> sprite here. Use the 100% version.
        </NUploadDragger>
      </NUpload>
      <div class="flex flex-col gap-y-2 w-full text-left mb-6 max-h-[20vh] overflow-y-auto">
        <div v-for="(sprite, idx) in spriteFiles" class="flex flex-row p-2 border bg-slate-50 cursor-pointer" :class="{ 'hover:bg-slate-200': !(activeSprite === idx), 'bg-slate-700 text-white': activeSprite === idx }" @click="selectSprite(idx)">
            <div class="flex-grow">{{ sprite.name }}</div>
          <div><n-icon :component="TrashCan" class="opacity-50 hover:opacity-100" @click.stop="removeFile(idx)"/></div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <NUpload @update:file-list="onWeaponFileChange" :show-file-list="false" multiple class="mt-10 mb-2">
        <NUploadDragger>
          Drop your <b>weapon</b> sprite here. Use the 100% version.
        </NUploadDragger>
      </NUpload>
      <div class="flex flex-col gap-y-2 w-full text-left mb-6 max-h-[20vh] overflow-y-auto">
        <div v-for="(sprite, idx) in weaponSpriteFiles" class="flex flex-row p-2 border bg-slate-50 cursor-pointer" :class="{ 'hover:bg-slate-200': !(activeWeaponSprite === idx), 'bg-slate-700 text-white': activeWeaponSprite === idx }" @click="selectWeaponSprite(idx)">
          <div class="flex-grow">{{ sprite.name }}</div>
          <div><n-icon :component="TrashCan" class="opacity-50 hover:opacity-100" @click.stop="removeWeaponFile(idx)"/></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import TrashCan from '@vicons/carbon/TrashCan'
const props = defineProps({
  modelValue: {required: true},
  weapon: {required: true}
});
const emit = defineEmits(['update:modelValue', 'update:weapon'])

const input = ref(props.modelValue);
const spriteFiles = ref([]);
const activeSprite = ref(0);
const weaponInput = ref(props.weapon);
const weaponSpriteFiles = ref([]);
const activeWeaponSprite = ref(0);

watch(input, (value) => {
  emit('update:modelValue', value);
});

watch(weaponInput, (value) => {
  emit('update:weapon', value);
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

function removeFile(idx){
  spriteFiles.value.splice(idx, 1);
  if(idx === activeSprite.value) {
    activeSprite.value = 0;
    if(spriteFiles.value.length) {
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
  if(idx === activeWeaponSprite.value) {
    activeWeaponSprite.value = 0;
    if(weaponSpriteFiles.value.length) {
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
</script>

