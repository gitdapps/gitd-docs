<template>
  <div class="repo">
    REPO
  </div>
</template>

<script>
export default {
  name: "Repo",
  data: () => ({
    markdownBlobs: [],
    defaultMarkdownBlob: {},
  }),
  async mounted() {
    let owner = this.$route.params.owner,
      repo = this.$route.params.repo,
      ref = this.$route.params.ref;

    let { default_branch } = await this.$store.dispatch("repos/fetchRepo", {
      owner,
      repo,
    });

    let {
      object: { sha },
    } = await this.$store.dispatch("refs/fetchRef", {
      owner,
      repo,
      ref: ref || `heads/${default_branch}`,
    });

    await this.$store.dispatch("trees/fetchTree", {
      owner,
      repo,
      sha,
    });

    this.markdownBlobs = this.$store.getters["trees/markdownBlobs"]({
      owner,
      repo,
      sha,
    });

    this.defaultMarkdownBlob = this.$store.getters["trees/defaultMarkdownBlob"](
      {
        owner,
        repo,
        sha,
      }
    );

    let path = this.defaultMarkdownBlob.path;

    this.$router.push(
      `/${owner}/${repo}/blob/${ref || default_branch}/${path}`
    );
  },
};
</script>
