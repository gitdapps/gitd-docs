<script setup>
import { computed, nextTick, onUpdated, watch } from "vue";
import { useRoute } from "vue-router";
import { Doc } from "@/stores/docs";

const route = useRoute(),
  props = defineProps({ doc: Doc }),
  docHtml = computed(() => {
    return props.doc ? props.doc.html : "";
  });

function scrollToHash(hash) {
  nextTick(() => {
    let el = document.querySelector(`#heading-${hash.substring(1)}`);

    if (el) {
      window.scroll({
        top: el.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: "smooth",
      });
    }
  });
}

watch(route, ({ hash }) => {
  scrollToHash(hash);
});

onUpdated(() => {
  scrollToHash(route.hash);
});
</script>

<template>
  <article v-html="docHtml"></article>
</template>

<style scoped>
:deep(blockquote) {
  border-left: solid 0.5em #aaa;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.5em;
  padding: 0.5em;
}

:deep(blockquote p) {
  margin: 0;
}

:deep(img) {
  max-width: 100%;
}

:deep(a) {
  color: #0078d4;
}

:deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.2em;
  padding: 0.2em;
}

:deep(pre code) {
  border: solid 1px #ccc;
  display: block;
  border-radius: 0.5em;
  padding: 0.5em;
}

:deep(img.emoji) {
  height: 1em;
}

:deep(div.exclamation) {
  background-color: rgba(255, 0, 0, 0.05);
  border-radius: 0.2em;
  padding: 0.2em;
  border: solid 1px rgba(255, 0, 0, 0.5);
}
</style>
