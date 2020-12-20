<template>
  <nav class="topbar">
    <ul>
      <li v-for="section in sections" v-bind:key="section.url">
        <a v-bind:href="sectionHref(section)"> {{ sectionDisplay(section) }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 61px;
  width: 100%;
  background: white;
  overflow-y: hidden;
  overflow-x: scroll;
  border-bottom: solid 1px #ddd;
}

ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  font-weight: bold;
  margin: 0;
  padding: 0.3em;
  transition: 0.5s;
}

li a {
  /* text-decoration: none; */
  color: #555;
  transition: 0.5s;
}

li.active a {
  color: black;
}
</style>

<script>
import { displayCase } from "@/utils";

export default {
  name: "Topbar",
  props: {
    repo: Object,
    sections: Array,
  },
  methods: {
    sectionDisplay(section) {
      return displayCase(section.path.split("/").pop());
    },
    sectionHref(section) {
      try {
        return `/${this.repo.full_name}/${section.path}`;
      } catch (e) {
        return undefined;
      }
    },
  },
};
</script>
