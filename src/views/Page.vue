<template>
  <div class="page">
    <!-- <p>pathRepoOwner = {{ pathRepoOwner }}</p>
    <p>pathRepoName = {{ pathRepoName }}</p>
    <p>pathRef = {{ pathRef }}</p>
    <p>repo.name = {{ repo.name }}</p>
    <p>ref = {{ ref.ref }}</p> -->
    <p>
      {{ mdFiles.length }} markdown file{{ mdFiles.length === 1 ? "" : "s" }}
    </p>
    <ul>
      <li v-for="mdFile in mdFiles" :key="mdFile.path">
        <a :href="`/${pathRepoOwner}/${pathRepoName}/${mdFile.path}`">{{
          mdFile.path
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Page",
  computed: {
    pathRepoOwner() {
      return this.$route.path.split("/")[1];
    },
    pathRepoName() {
      return this.$route.path.split("/")[2];
    },
    pathRef() {
      // use the repo's default branch when ref isnt passed
      return this.$route.query.ref || `heads/${this.repo.default_branch}`;
    },
    repo() {
      return _.get(
        this.$store.state.repos,
        `[${this.pathRepoOwner}][${this.pathRepoName}]`,
        {}
      );
    },
    ref() {
      return _.get(
        this.$store.state.refs,
        `[${this.pathRepoOwner}][${this.pathRepoName}][${this.pathRef}]`,
        {}
      );
    },
    mdFiles() {
      let sha = _.get(this.ref, "object.sha");

      if (!sha) {
        return {};
      }

      return _.get(
        this.$store.state.trees,
        `[${this.pathRepoOwner}][${this.pathRepoName}][${this.ref.object.sha}].tree`,
        []
      ).filter((item) => item.path.endsWith(".md"));
    },
  },
  async mounted() {
    let owner = this.pathRepoOwner,
      repo = this.pathRepoName;

    await this.$store.dispatch("repos/fetchRepo", {
      owner,
      repo,
    });

    let {
      object: { sha },
    } = await this.$store.dispatch("refs/fetchRef", {
      owner,
      repo,
      ref: this.pathRef,
    });

    await this.$store.dispatch("trees/fetchTree", {
      owner,
      repo,
      sha,
    });
  },
};
</script>
