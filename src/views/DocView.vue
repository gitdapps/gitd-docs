<script setup>
// import _ from 'lodash'
import { ref, watchEffect } from 'vue'

import DocArticle from '@/components/DocArticle.vue'
import DocMenu from '@/components/DocMenu.vue'
import DocOutlineAside from '@/components/DocOutlineAside.vue'
import DocCommentAside from '@/components/DocCommentAside.vue'
import { useDocsStore } from '@/stores/docs'

const asideOverlayQuery = window.matchMedia('(max-width: 1060px)'),
  doubleAsideQuery = window.matchMedia('(min-width: 1380px)')

doubleAsideQuery.addEventListener('change', (e) => {
  if (!e.matches && outlineActive.value && commentActive.value) {
    commentActive.value = false
  }
})

const { docUrl } = defineProps({
    docUrl: URL
  }),
  docsStore = useDocsStore(),
  doc = ref(null),
  outlineActive = ref(false),
  commentActive = ref(false)

watchEffect(async () => {
  // this effect will run immediately and then
  // re-run whenever docUrl changes
  if (docUrl) {
    doc.value = await docsStore.fetch(docUrl)
  }
})

function toggleOutline(newValue = !outlineActive.value) {
  outlineActive.value = newValue

  if (outlineActive.value && commentActive.value && !doubleAsideQuery.matches) {
    commentActive.value = false
  }

  // if (!outlineActive.value) {
  //   commentActive.value = false
  // }
}

function toggleComment(newValue = !commentActive.value) {
  commentActive.value = newValue

  if (outlineActive.value && commentActive.value && !doubleAsideQuery.matches) {
    outlineActive.value = false
  }

  // if (!commentActive.value) {
  //   outlineActive.value = false
  // }
}

function coverClick() {
  outlineActive.value = false
  commentActive.value = false
}

function outlineClick() {
  if (asideOverlayQuery.matches) {
    toggleOutline(false)
  }
}

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
    <doc-menu
      id="menu"
      :doc="doc"
      @toggle-outline="toggleOutline()"
      @toggle-comment="toggleComment()"
      :class="{ asideActive: outlineActive || commentActive }"
    />
    <doc-outline-aside
      id="outline"
      :doc="doc"
      :class="{ active: outlineActive }"
      @click="outlineClick()"
    />
    <div
      id="cover"
      :style="{ visibility: outlineActive || commentActive ? '' : 'hidden' }"
      :class="{ leftClose: commentActive, rightClose: outlineActive }"
      @click="coverClick()"
    >
      <font-awesome-icon icon="fa-solid fa-xmark" size="xl" style="margin: 1em 1em 0 0.5em" />
    </div>

    <doc-article id="article" :doc="doc" />

    <doc-comment-aside id="comment" :doc="doc" :class="{ active: commentActive }" />
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

#cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 2;
  display: flex;
}
#cover.rightClose {
  justify-content: flex-end;
}

#menu {
  z-index: 4;
  display: flex;
  justify-content: space-between;
  position: fixed;

  bottom: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.8);
  margin: 0;
  padding: 0;
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
  display: none;
}

#outline {
  position: sticky;
  top: 3em;
}

#comment {
  margin-top: 3em;
}

aside.active {
  display: unset;
}

@media (min-width: 1060px) {
  article {
    width: 40em;
    padding: 4em;
  }

  #cover {
    display: none;
  }
}

@media (max-width: 1060px) {
  article {
    width: 80vw;
    padding: 4vw;
  }

  aside {
    border: solid 1px #eee;
    box-shadow: 0 0 0.3em #eee;
    background-color: white;
  }

  #outline {
    border-radius: 0 2em 2em 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 10;
  }

  #comment {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    margin: 0;
    padding-top: 4em;
  }

  #comment {
    border-radius: 2em 0 0 2em;
  }

  #menu {
    bottom: 0;
  }

  #menu.asideActive {
    display: none;
  }
}

@media (max-width: 320px) {
  article {
    width: 260px;
    padding: 13px;
  }

  aside {
    width: 18em;
  }
}
</style>
