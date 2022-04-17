<template>
  <div>
    <router-link
      class="heading-link"
      v-for="heading in headings"
      v-bind:key="heading.text"
      v-bind:class="headingClass(heading)"
      v-bind:style="headingStyle(heading)"
      v-bind:to="headingFragment(heading)"
    >
      {{ headingDisplay(heading) }}
    </router-link>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute(),
  props = defineProps({
    doc: Object,
  }),
  headings = computed(() => {
    return props.doc ? props.doc.headings : "";
  });

function headingClass(heading) {
  return {
    active: route.hash === this.headingFragment(heading),
  };
}

function headingStyle(heading) {
  return {
    "padding-left": `${heading.depth}em`,
  };
}

function headingDisplay(heading) {
  return heading.raw.replace(/#/gi, "").substring(1);
}

function headingFragment(heading) {
  return `#${this.headingDisplay(heading)
    .toLowerCase()
    .replace(/ /gi, "-")
    .replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`;
}
</script>
