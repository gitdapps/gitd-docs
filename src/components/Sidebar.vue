<template>
  <nav id="sidebar">
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
  </nav>
</template>

<style scoped>
#sidebar {
  position: fixed;
  top: 80px;
  bottom: 20px;
  left: 30px;
  overflow-y: scroll;
  width: 250px;
  z-index: 1;
}

.heading-link {
  font-weight: bold;
  margin: 0.4em;
  padding: 0.4em;
  transition: 0.2s;
  color: #333;
  text-decoration: none;
  border-radius: 0.4em;
  text-transform: capitalize;
  display: block;
}

.heading-link.active {
  background: lightgrey;
}

.heading-link:hover {
  background: lightgrey;
}
</style>

<script>
export default {
  name: "Sidebar",
  props: {
    headings: Array,
    files: Array,
  },
  methods: {
    headingClass(heading) {
      return {
        active: this.$route.hash === this.headingFragment(heading),
      };
    },
    headingStyle(heading) {
      return {
        "padding-left": `${heading.depth}em`,
      };
    },
    headingDisplay(heading) {
      return heading.raw.replace(/#/gi, "").substring(1);
    },
    headingFragment(heading) {
      return `#${this.headingDisplay(heading)
        .toLowerCase()
        .replace(/ /gi, "-")
        .replace(/^[^a-z]+|[^\w:.-]+/gi, "")}`;
    },
  },
};
</script>
