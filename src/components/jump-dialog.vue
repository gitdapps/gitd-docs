<style scoped>
#jump-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(104, 104, 104, 0.5);
  backdrop-filter: blur(0.5em);
}

dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  background: white;
  border-radius: 1em;
  padding: 1em;
  border: none;
  max-width: 50%;
  min-width: 20em;
}

#dialog-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1em;
  width: 100%;
}
</style>

<template>
  <div id="jump-dialog" v-if="open === 'JUMP'" @click="done">
    <dialog open @click.stop>JUMP</dialog>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore(),
  open = computed(() => dialogsStore.open === 'JUMP')

function done() {
  dialogsStore.closeDialog()
}
</script>
