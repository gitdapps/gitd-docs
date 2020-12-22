<template>
  <nav id="sidebar">
    <router-link
      class="file-link"
      v-for="file in files"
      v-bind:key="file.url"
      v-bind:to="file.path"
    >
      {{ fileDisplay(file) }}
    </router-link>
    ---
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

.file-link {
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
import { displayCase } from "@/utils";

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
    fileDisplay(file) {
      try {
        return displayCase(
          file.name
            .split(".")
            .slice(0, -1)
            .join(".")
        );
      } catch (e) {
        return "";
      }
    },
  },
};
</script>
