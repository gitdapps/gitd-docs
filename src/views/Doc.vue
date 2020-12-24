<template>
  <div class="doc">
    <sidebar
      id="sidebar"
      v-bind:headings="docRendering.headings"
      v-bind:files="files"
    ></sidebar>
    <page id="page" v-bind:contentHtml="docRendering.html"></page>
    <div id="btm-spacer"></div>
  </div>
</template>

<style scoped>
.doc {
  height: 100%;
  padding-bottom: 30px;
  margin-bottom: 300px;
}

#btm-spacer {
  height: 100%;
}
</style>

<script>
import _ from "lodash";
import marked from "marked";
import DOMPurify from "dompurify";

import router from "@/router";

import Sidebar from "@/components/Sidebar.vue";
import Page from "@/components/Page.vue";

document.addEventListener("click", (e) => {
  if (_.includes(document.querySelectorAll(".page a"), e.target)) {
    let href = e.target.getAttribute("href");

    if (!href.includes("//")) {
      router.push(e.target.getAttribute("href"));
    } else {
      window.open(href, "_blank");
    }

    e.preventDefault();
  }
});

export default {
  name: "Doc",
  props: {
    owner: String,
    repository: String,
    path: String,
    reference: String,
  },
  components: {
    Sidebar,
    Page,
  },
  computed: {
    docContent() {
      let { owner, repository: repo, reference: ref, path } = this;

      try {
        if (!ref) {
          // fall back to repo default branch if ref not specified
          ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
        }

        let docContent = this.$store.state.content[owner][repo][ref][path];

        if (Array.isArray(docContent)) {
          // we're dealing with a directory, try to use the index.md file
          docContent = this.$store.state.content[owner][repo][ref][
            docContent.find(({ path }) => path.endsWith("index.md")).path
          ];
        }

        return docContent;
      } catch (e) {
        return undefined;
      }
    },
    docRendering() {
      if (this.docContent) {
        let baseUrl;

        if (this.docContent.path.endsWith("index.md")) {
          // we're rendering an index page, so we'll need to specify baseUrl
          baseUrl = `${_.nth(this.docContent.path.split("/"), -2)}/`;
        }

        let headings = [],
          html = DOMPurify.sanitize(
            marked(atob(this.docContent.content), {
              baseUrl,
              headerPrefix: "heading-",
              walkTokens(token) {
                if (token.type === "heading") {
                  headings.push(token);
                }
              },
            }),
            { ADD_TAGS: ["router-link"], ADD_ATTR: ["to"] }
          );
        return {
          html,
          headings,
        };
      }

      return {};
    },
    files() {
      let { owner, repository: repo, reference: ref, path } = this;

      try {
        if (!ref) {
          // fall back to repo default branch if ref not specified
          ref = `heads/${this.$store.state.repos[owner][repo].default_branch}`;
        }

        let content = this.$store.state.content[owner][repo][ref][path];

        if (!Array.isArray(content)) {
          return [];
        }

        return content.filter(
          ({ type, name }) => type === "file" && name !== "index.md"
        );
      } catch (e) {
        return undefined;
      }
    },
  },
};
</script>
