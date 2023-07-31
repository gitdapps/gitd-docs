<script setup>
import { computed, nextTick, onUpdated, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Doc } from '@/stores/docs'

const route = useRoute(),
  props = defineProps({ doc: Doc }),
  docHtml = computed(() => {
    return props.doc ? props.doc.html : ''
  })

function scrollToHash(hash) {
  nextTick(() => {
    let el = document.querySelector(`#heading-${hash.substring(1)}`)

    if (el) {
      window.scroll({
        top: el.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: 'smooth'
      })
    }
  })
}

watch(route, ({ hash }) => {
  scrollToHash(hash)
})

onUpdated(() => {
  scrollToHash(route.hash)
})
</script>

<template>
  <article v-html="docHtml"></article>
</template>

<style scoped></style>
