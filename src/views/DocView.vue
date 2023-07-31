<script setup>
// import _ from 'lodash'
import { ref, watchEffect } from 'vue'

// import DocMenu from '@/components/DocMenu.vue'
import DocArticle from '@/components/DocArticle.vue'
import { useDocsStore } from '@/stores/docs'

const { docUrl } = defineProps({
    docUrl: URL
  }),
  docsStore = useDocsStore(),
  doc = ref(null)

watchEffect(async () => {
  // this effect will run immediately and then
  // re-run whenever docUrl changes
  if (docUrl) {
    doc.value = await docsStore.fetch(docUrl)
  }
})

// document.addEventListener('click', (e) => {
//   if (_.includes(document.querySelectorAll('.page a'), e.target)) {
//     let href = e.target.getAttribute('href')

//     if (!href.includes('//')) {
//       router.push(e.target.getAttribute('href'))
//     } else {
//       window.open(href, '_blank')
//     }

//     e.preventDefault()
//   }
// })
</script>

<template>
  <main>
    <!-- <doc-menu /> -->
    <doc-article v-bind:doc="doc" />
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  overflow: scroll;
}
</style>
