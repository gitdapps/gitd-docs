<script setup>
import { ref, watchEffect } from 'vue'

import DocArticle from '@/components/DocArticle.vue'
import DocMenu from '@/components/DocMenu.vue'
import DocOutlineAside from '@/components/DocOutlineAside.vue'
import DocCommentAside from '@/components/DocCommentAside.vue'
import { useDocsStore } from '@/stores/docs'

const asideOverlayQuery = window.matchMedia('(max-width: 72rem)'),
  doubleAsideQuery = window.matchMedia('(min-width: 1460px)')

const { docUrl } = defineProps({
    docUrl: URL
  }),
  docsStore = useDocsStore(),
  doc = ref(null),
  outlineActive = ref(false),
  commentActive = ref(false),
  filled = ref(asideOverlayQuery.matches),
  fillable = ref(!asideOverlayQuery.matches)

doubleAsideQuery.addEventListener('change', (e) => {
  if (!e.matches && outlineActive.value && commentActive.value) {
    commentActive.value = false
  }
})

asideOverlayQuery.addEventListener('change', (e) => {
  fillable.value = !e.matches

  toggleFill(e.matches)
})

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
}

function toggleComment(newValue = !commentActive.value) {
  commentActive.value = newValue

  if (outlineActive.value && commentActive.value && !doubleAsideQuery.matches) {
    outlineActive.value = false
  }
}

function toggleFill(newValue = !filled.value) {
  filled.value = newValue
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
  <main
    id="doc-view"
    :class="{
      filled: filled,
      outline: outlineActive,
      comment: commentActive,
      fillable: fillable
    }"
  >
    <doc-menu
      id="menu"
      :doc="doc"
      @toggle-outline="toggleOutline()"
      @toggle-comment="toggleComment()"
      @toggle-fill="toggleFill()"
    />
    <doc-outline-aside
      id="outline"
      :doc="doc"
      class="doc-aside"
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

    <doc-comment-aside
      id="comment"
      :doc="doc"
      class="doc-aside"
      :class="{ active: commentActive }"
    />
  </main>
</template>

<style scoped>
#doc-view {
  display: flex;
  align-items: flex-start;
  background-color: #f9f9f9;
  justify-content: center;
  gap: 1rem;
  overflow: hidden;
}

#doc-view.filled {
  background-color: white;
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
  display: none;
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
  box-shadow: 0 0 0.4rem #eee;
  border: solid 1px #ccc;
  border-radius: 0 0 0.4rem 0.4rem;
  background-color: white;
  flex-shrink: 0;
  flex-grow: 0;
  margin: 1rem 0 100vh 0;
}

.filled #article {
  box-shadow: none;
  border: none;
}

.doc-aside {
  flex-shrink: 0;
  width: 20rem;
  display: none;
}

#outline {
  position: sticky;
  top: 3rem;
}

#comment {
  margin-top: 3rem;
}

aside.active {
  display: unset;
}

@media (min-width: 72rem) {
  article {
    width: 40em;
    padding: 4em;
  }

  .filled > article {
    font-size: calc(100vw / 50);
  }

  .filled.outline > article,
  .filled.comment > article {
    font-size: calc(100vw / 70);
  }

  .filled.comment.outline > article {
    font-size: calc(100vw / 95);
  }
}

@media (max-width: 72rem) {
  article {
    max-width: 40rem;
    width: 80vw;
    padding: 4vw;
  }

  aside {
    border: solid 1px #eee;
    box-shadow: 0 0 0.3rem #eee;
    background-color: white;
  }

  #cover {
    display: flex;
  }

  #outline {
    border-radius: 0 2rem 2rem 0;
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
    padding-top: 4rem;
  }

  #comment {
    border-radius: 2rem 0 0 2rem;
  }

  #menu {
    bottom: 0;
  }

  .outline > #menu,
  .comment > #menu {
    display: none;
  }
}

@media (max-width: 24rem) {
  aside {
    width: 80vw;
  }
}

@media (max-width: 20rem) {
  article {
    width: 16rem;
    padding: 1rem;
  }
}
</style>
