<script setup>
// import _ from 'lodash'
import { ref, watchEffect } from 'vue'

// import DocMenu from '@/components/DocMenu.vue'
// import DocArticle from '@/components/DocArticle.vue'
import { useGithubStore } from '@/stores/github'
// import { useDocsStore } from '@/stores/docs'

const { docUrl } = defineProps({
    docUrl: URL
  }),
  githubStore = useGithubStore(),
  // docsStore = useDocsStore(),
  content = ref(null)

watchEffect(async () => {
  // this effect will run immediately and then
  // re-run whenever docUrl changes
  content.value = await githubStore.fetch(docUrl)
})

// doc = computed(() => {
//   let { docUrl } = props

//   try {
//     if (!ref) {
//       // fall back to repo default branch if ref not specified
//       ref = `heads/${githubStore.repos[owner][repo].default_branch}`
//     }

//     return githubStore.docs[owner][repo][ref][path]
//   } catch (e) {
//     return null
//   }
// })

// files = computed(() => {
//   let { owner, repository: repo, reference: ref, path } = this;

//   try {
//     if (!ref) {
//       // fall back to repo default branch if ref not specified
//       ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
//     }

//     let content = this.$store.state.content[owner][repo][ref][path];

//     if (!Array.isArray(content)) {
//       return [];
//     }

//     return content.filter(
//       ({ type, name }) => type === "file" && name !== "index.md"
//     );
//   } catch (e) {
//     return undefined;
//   }
// });

document.addEventListener('click', (e) => {
  if (_.includes(document.querySelectorAll('.page a'), e.target)) {
    let href = e.target.getAttribute('href')

    if (!href.includes('//')) {
      router.push(e.target.getAttribute('href'))
    } else {
      window.open(href, '_blank')
    }

    e.preventDefault()
  }
})
</script>

<style scoped>
main {
  height: 100vh;
  overflow: scroll;
}
</style>

<template>
  <main>
    <!-- <doc-menu /> -->
    <!-- <doc-article v-bind:doc="doc" /> -->
    {{ content }}
  </main>
</template>
