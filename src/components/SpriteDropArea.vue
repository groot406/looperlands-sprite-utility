<template>
  <div class="w-full h-full text-center p-10">
    <NUpload @update:file-list="onFileChange" :show-file-list="false" class="my-10">
      <NUploadDragger>
        Drop your <b>avatar</b> sprite here. Use the 100% version.
      </NUploadDragger>
    </NUpload>

    <NUpload @update:file-list="onWeaponFileChange" :show-file-list="false">
      <NUploadDragger>
        Drop your <b>weapon</b> sprite here. Use the 100% version.
      </NUploadDragger>
    </NUpload>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  modelValue: {required: true},
  weapon: {required: true}
});
const emit = defineEmits(['update:modelValue', 'update:weapon'])

const input = ref(props.modelValue);
const weaponInput = ref(props.weapon);

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

  createImage(fileList[fileList.length - 1]);
}

function onWeaponFileChange(fileList) {

  if (!fileList.length)
    return;

  createWeaponImage(fileList[0]);
}
</script>

