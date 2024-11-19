import { defineStore } from "pinia";

export const useDialogsStore = defineStore("dialogs", {
  state: () => {
    return {
      open: null,
    };
  },
  actions: {
    openDialog(name) {
      document.body.style.overflow = "hidden";

      this.open = name;
    },
    closeDialog() {
      document.body.style.overflow = "";

      this.open = null;
    },
  },
});
