<template>
  <nav id="sidebar">
    <a
      class="heading-link"
      v-for="heading in headings"
      v-bind:key="heading.text"
      v-bind:class="headingClass(heading)"
      v-bind:style="headingStyle(heading)"
      v-bind:href="headingFragment(heading)"
    >
      {{ headingDisplay(heading) }}
    </a>
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
// function decodeHtml(html) {
//   let txt = document.createElement("textarea");
//   txt.innerHTML = html;
//   return txt.value;
// }

export default {
  name: "Sidebar",
  props: {
    headings: Array,
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
      // return decodeHtml(
      //   heading.tokens
      //     .filter(({ type }) => type === "text")
      //     .reduce((a, v) => a + v.text, "")
      // );
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
