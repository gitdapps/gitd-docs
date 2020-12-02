<template>
  <div class="blob">
    <!-- <p>routeRepoOwner = {{ routeRepoOwner }}</p>
    <p>routeRepoName = {{ routeRepoName }}</p>
    <p>routeRef = {{ routeRef }}</p>
    <p>repo.name = {{ repo.name }}</p>
    <p>ref = {{ ref.ref }}</p> -->
    <!-- <p>$route.params.owner = {{ $route.params.owner }}</p>
    <p>$route.params.repo = {{ $route.params.repo }}</p>
    <p>
      {{ markdownBlobs.length }} markdown blob{{
        markdownBlobs.length === 1 ? "" : "s"
      }}
    </p>
    <p>defaultMarkdownBlob = {{ defaultMarkdownBlob.path }}</p>
    <ul>
      <li v-for="markdownBlob in markdownBlobs" :key="markdownBlob.path">
        <a
          :href="
            `/${$route.params.owner}/${$route.params.repo}/${markdownBlob.path}`
          "
          >{{ markdownBlob.path }}</a
        >
      </li>
    </ul> -->
    {{ content }}
  </div>
</template>

<script>
export default {
  name: "Blob",
  data: () => ({
    content: "",
  }),
  async mounted() {
    let owner = this.$route.params.owner,
      repo = this.$route.params.repo,
      ref = this.$route.params.ref,
      path = this.$route.params.path,
      { content } = await this.$store.dispatch("content/fetchContent", {
        owner,
        repo,
        ref,
        path,
      });

    this.content = atob(content);
  },
};
</script>
