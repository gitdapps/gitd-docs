<template>
  <nav class="topbar">
    <ul>
      <li v-for="section in sections" v-bind:key="section.url">
        <a v-bind:href="section.path"> {{ section.path }}</a>
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
}

li {
  font-weight: bold;
  margin: 0 1em;
  padding: 0.4em 1em;
  transition: 0.5s;
  border-radius: 1em;
  border: solid 1px transparent;
}

li:hover {
  border-left: solid 1px lightgrey;
  border-right: solid 1px lightgrey;
}
</style>

<script>
export default {
  name: "Topbar",
  props: {
    sections: Array,
  },
};
</script>
