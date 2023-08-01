<script setup>
// import _ from 'lodash'
import { ref, watchEffect } from 'vue'

// import DocMenu from '@/components/DocMenu.vue'
import DocArticle from '@/components/DocArticle.vue'
import DocOutlineAside from '@/components/DocOutlineAside.vue'
import DocDiscussionAside from '@/components/DocDiscussionAside.vue'
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
    <doc-outline-aside id="outline" :doc="doc" />
    <doc-article :doc="doc" />
    <doc-discussion-aside id="discussion" :doc="doc" />
  </main>
</template>

<style scoped>
main {
  /* height: 100vh;
  overflow: scroll; */
  display: flex;
  background-color: #f9f9f9;
  justify-content: center;
  padding-top: 3em;
  gap: 1em;
}

main > article {
  flex-shrink: 0;
  width: 60em;
}

main > aside {
  flex-shrink: 0;
  width: 20em;
}
</style>
