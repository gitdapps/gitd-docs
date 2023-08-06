<script setup>
import { ref } from 'vue'
import { Doc } from '@/stores/docs'

const props = defineProps({ doc: Doc }),
  collapsed = ref(false)
</script>

<template>
  <aside :class="{ collapsed: collapsed }">
    <font-awesome-icon icon="fa-solid fa-list" @click="collapsed = !collapsed" />
    <template v-if="doc" v-for="heading in doc.headings">
      <a :href="`#${heading.level === 1 ? '' : heading.id}`">
        <h1 v-if="heading.level === 1" v-html="heading.text"></h1>
        <h2 v-else-if="heading.level === 2" v-html="heading.text"></h2>
        <h3 v-else-if="heading.level === 3" v-html="heading.text"></h3>
        <h4 v-else-if="heading.level === 4" v-html="heading.text"></h4>
        <h5 v-else-if="heading.level === 5" v-html="heading.text"></h5>
        <h6 v-else>{{ heading.text }}</h6>
      </a>
    </template>
  </aside>
</template>

<style scoped>
.collapsed :is(h1, h2, h3, h4, h5, h6) {
  padding-inline-start: 0;
  display: none;
}

a {
  text-decoration: none;
  color: inherit;
}

h2 {
  padding-inline-start: 1ch;
}

h3 {
  padding-inline-start: 2ch;
}

h4 {
  padding-inline-start: 3ch;
}

h5 {
  padding-inline-start: 4ch;
}

h6 {
  padding-inline-start: 5ch;
}
</style>
