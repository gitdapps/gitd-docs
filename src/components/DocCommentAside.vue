<script setup>
import { Doc } from "@/stores/docs";

const props = defineProps({ doc: Doc });
</script>

<template>
  <aside>
    <template v-if="doc" v-for="comment in doc.comments">
      <h1 v-if="comment.depth === 1">{{ comment.text }}</h1>
      <h2 v-else-if="comment.depth === 2">{{ comment.text }}</h2>
      <h3 v-else-if="comment.depth === 3">{{ comment.text }}</h3>
      <h4 v-else-if="comment.depth === 4">{{ comment.text }}</h4>
      <h5 v-else-if="comment.depth === 5">{{ comment.text }}</h5>
      <h6 v-else>{{ comment.text }}</h6>
    </template>
  </aside>
</template>

<style scoped></style>
