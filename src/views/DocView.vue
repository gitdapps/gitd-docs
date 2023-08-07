<script setup>
// import _ from 'lodash'
import { ref, watchEffect } from 'vue'

import DocArticle from '@/components/DocArticle.vue'
import DocMenu from '@/components/DocMenu.vue'
import DocOutlineAside from '@/components/DocOutlineAside.vue'
import DocCommentAside from '@/components/DocCommentAside.vue'
import { useDocsStore } from '@/stores/docs'

const { docUrl } = defineProps({
    docUrl: URL
  }),
  docsStore = useDocsStore(),
  doc = ref(null),
  outlineCollapsed = ref(false),
  commentCollapsed = ref(false)

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
    <div id="toolbar"></div>
    <doc-outline-aside id="outline" :doc="doc" :class="{ collapsed: outlineCollapsed }" />

    <div id="article-container">
      <doc-menu
        id="menu"
        :doc="doc"
        @toggle-outline="outlineCollapsed = !outlineCollapsed"
        @toggle-comment="commentCollapsed = !commentCollapsed"
      />
      <doc-article id="article" :doc="doc" />
    </div>

    <doc-comment-aside id="comment" :doc="doc" :class="{ collapsed: commentCollapsed }" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  align-items: flex-start;
  background-color: #f9f9f9;
  justify-content: center;
  gap: 1em;
}

#toolbar {
  position: fixed;
  left: 0;
  width: 100%;
  height: 4em;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 3;
}

#menu {
  position: sticky;
  width: 100%;
  /* background-color: turquoise; */
  z-index: 4;
  display: flex;
  justify-content: space-between;
  padding: 1em 0;
  margin: 0;
}

#article {
  box-shadow: 0 0 0.3em #eee;
  border: solid 1px #ddd;
  border-radius: 0 0 0.3em 0.3em;
  background-color: white;

  flex-shrink: 0;
  flex-grow: 0;

  margin: 1em 0 100vh 0;
}

aside {
  flex-shrink: 0;
  width: 20em;
}

#outline {
  position: sticky;
  top: 3em;
}

#comment {
  margin-top: 3em;
}

aside.collapsed {
  display: none;
}

@media (max-width: 1380px) {
  #comment {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    margin: 0;
    background-color: whitesmoke;
    padding-top: 4em;
  }
}

@media (max-width: 1060px) {
  #outline {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 2;
    background-color: whitesmoke;
    padding-top: 4em;
  }

  #outline.collapsed {
    display: none;
  }
}

@media (min-width: 800px) {
  article {
    width: 40em;
    padding: 4em;
  }

  #toolbar {
    top: 0;
  }

  #menu {
    top: 0;
  }
}

@media (max-width: 800px) {
  article {
    width: 80vw;
    padding: 4vw;
  }

  #toolbar {
    bottom: 0;
  }

  #menu {
    position: fixed;
    bottom: 0;
    width: 88vw;
  }
}

@media (max-width: 320px) {
  article {
    width: 260px;
    padding: 13px;
  }

  #menu {
    width: 286px;
  }
}
</style>
