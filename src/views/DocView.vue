<script setup>
// import _ from 'lodash'
import { ref, watchEffect } from 'vue'

// import DocMenu from '@/components/DocMenu.vue'
import DocArticle from '@/components/DocArticle.vue'
import DocOutlineAside from '@/components/DocOutlineAside.vue'
import DocCommentAside from '@/components/DocCommentAside.vue'
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
    <doc-comment-aside id="comment" :doc="doc" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  align-items: flex-start;
  background-color: #f9f9f9;
  justify-content: center;
  padding: 3em;
  gap: 1em;
}

main > article {
  flex-shrink: 0;
  max-width: 40em;
  padding: 4em;
}

main > aside {
  flex-shrink: 0;
  background-color: grey;
  width: 20em;
}

main > aside.collapsed {
  flex-shrink: 0;
  background-color: grey;
  width: 2em;
}

#outline {
  position: sticky;
  top: 3em;
}

@media (max-width: 1380px) {
  #comment {
    position: absolute;
    top: 0;
    right: 0;
    height: 100vh;
  }
}

@media (max-width: 1060px) {
  #outline {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
  }
}

@media (max-width: 780px) {
  main > article {
    width: 80vw;
    padding: 8vw;
  }
}

@media (max-width: 320px) {
  main > article {
    width: 260px;
    padding: 26px;
  }
}
</style>
