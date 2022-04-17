import { defineStore } from "pinia";

import { useGithubStore } from "@/stores/github";
import { useDocsStore } from "@/stores/docs";

export const useFocusStore = defineStore("focus", {
  state: () => {
    return {};
  },
  actions: {
    async look({ owner, repo, path, ref }) {
      const githubStore = useGithubStore(),
        docsStore = useDocsStore();

      // make sure repo is in the store
      let { default_branch: defaultBranch } = await githubStore.fetchRepo({
        owner,
        repo,
      });

      // if the ref isnt specified, fall back to repo default branch
      ref = ref || `heads/${defaultBranch}`;

      // fetch content
      let content = await githubStore.fetchContent({
        owner,
        repo,
        ref,
        path,
      });

      // handle directory case
      if (Array.isArray(content)) {
        // try to use an index.md file
        let indexContent = content.find(({ path }) =>
          path.endsWith("index.md")
        );

        if (indexContent) {
          // fetch the index contents
          content = await githubStore.fetchContent({
            owner,
            repo,
            ref,
            path: indexContent.path,
          });
        }
      }

      await docsStore.parse({
        owner,
        repo,
        ref,
        path,
        contentBlob: content.content,
      });

      this.owner = owner;
      this.repo = repo;
      this.path = path;
      this.ref = ref;

      return { content };
    },
  },
});
