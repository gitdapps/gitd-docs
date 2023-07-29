<style scoped>
#settings-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(104, 104, 104, 0.5);
  backdrop-filter: blur(0.5em);
}

dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
  background: white;
  border-radius: 1em;
  padding: 1em;
  border: none;
  max-width: 50%;
  min-width: 20em;
}

#dialog-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1em;
  width: 100%;
}

#avatar {
  height: 15em;
  border-radius: 15em;
}

#authenticated-card {
  padding: 2em;
}

#authenticated-name {
  font-size: 2em;
}

#authenticated-login {
  font-size: 1.5em;
}

#gh-token-input {
  width: 100%;
  font-family: monospace;
  padding: 0.5em;
  width: 25em;
  text-align: center;
}
</style>

<template>
  <div id="settings-dialog" v-if="open" @click="done" @scroll.stop>
    <dialog open @click.stop>
      <span id="authenticated-card" v-if="authenticatedGithubUser">
        <img id="avatar" v-bind:src="authenticatedGithubUser.avatar_url" /><br />
        <span id="authenticated-name">{{ authenticatedGithubUser.name }}</span
        ><br />
        <span id="authenticated-login">
          <i class="fab fa-github" />&nbsp;
          <a target="blank" v-bind:href="authenticatedGithubUser.html_url">{{
            authenticatedGithubUser.login
          }}</a>
        </span>
      </span>
      <span v-if="!authenticatedGithubUser">
        Gitd works with GitHub, and needs your
        <a target="blank" @click="toggleToken" href="https://github.com/settings/tokens"
          >personal access token</a
        >
        to access your data there in order to proceed.
      </span>

      <input
        id="gh-token-input"
        v-model="githubPatInput"
        placeholder="paste your github token here"
      />

      <span id="dialog-controls">
        <i class="fas fa-key gitd-i-btn" @click="toggleToken" />

        <button class="gitd-btn" @click="ghConnect" v-if="!authenticatedGithubUser">
          <i class="fab fa-github" /> connect
        </button>

        <button class="gitd-btn" @click="ghDisconnect" v-if="authenticatedGithubUser">
          <i class="fab fa-github" /> disconnect
        </button>

        <button class="gitd-btn" @click="done" v-if="authenticatedGithubUser">done</button>
      </span>
    </dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGithubStore } from '@/stores/github'
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore(),
  githubStore = useGithubStore(),
  githubPatInput = ref(''),
  open = computed(() => dialogsStore.open === 'SETTINGS'),
  authenticatedGithubUser = computed(() => githubStore.users.authenticated)

onMounted(async () => {
  if (!githubStore.isConnected) {
    console.log('not connected to github')
    dialogsStore.openDialog('SETTINGS')
  }
})

function ghConnect() {
  githubStore.connect({ personalAccessToken: githubPatInput.value })
}

function ghDisconnect() {
  githubStore.disconnect()
}

function done() {
  if (authenticatedGithubUser.value) {
    dialogsStore.closeDialog()
  }
}
</script>
