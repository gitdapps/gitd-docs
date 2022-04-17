import { defineStore } from "pinia";

export const useDialogsStore = defineStore("dialogs", {
  state: () => {
    return {
      open: null,
    };
  },
  getters: {
    open: (state) => {
      return state.open;
    },
  },
  actions: {
    async openDialog(name) {
      document.body.style.overflow = "hidden";

      this.open = name;
    },
    async closeDialog() {
      document.body.style.overflow = "";

      this.open = null;
    },
  },
});
