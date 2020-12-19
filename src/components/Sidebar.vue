<template>
  <nav class="sidebar">
    <ol>
      <li
        v-for="heading in headings"
        v-bind:key="heading.text"
        v-bind:class="headingClass(heading)"
        v-bind:style="headingStyle(heading)"
      >
        <a v-bind:href="headingFragment(heading)">{{
          headingDisplay(heading)
        }}</a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 80px;
  bottom: 20px;
  left: 30px;
  overflow-y: scroll;
  width: 250px;
  border-radius: 1em;
}

ol {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font-weight: bold;
  margin: 0.1em 0;
  padding: 0.4em 1em;
  transition: 0.5s;
  border-radius: 1em;
  border: solid 1px transparent;
}

li.active {
  background: lightgrey;
}

a {
  text-decoration: none;
  color: #555;
  transition: 0.5s;
}

li.active a {
  color: black;
}

li:hover {
  border-left: solid 1px lightgrey;
  border-right: solid 1px lightgrey;
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
