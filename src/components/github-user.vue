<template>
  <div class="github-user">
    <img v-bind:src="user.avatar_url" />
    <p>{{ user.name }}</p>
    <p>
      <a v-bind:href="user.html_url">{{ user.login }}</a>
    </p>
    <p>{{ user.company }}</p>
    <p>{{ user.location }}</p>
  </div>
</template>

<style scoped>
img {
  width: 100px;
}
</style>

<script setup>
defineProps({ user: Object })
</script>
