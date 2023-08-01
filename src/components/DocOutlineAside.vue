<script setup>
import { Doc } from '@/stores/docs'

const props = defineProps({ doc: Doc })
</script>

<template>
  <aside>
    <li v-for="heading in doc.headings">{{ heading.depth }} {{ heading.text }}</li>
  </aside>
</template>

<style scoped></style>
