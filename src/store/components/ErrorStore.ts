import {defineStore} from "pinia";

import {useGlobalStore} from "@/store/GlobalStore";

let vconsole: any | undefined;

export const useErrorStore = defineStore('error', {
  state: () => ({
    consoleShow: false
  }),
  actions: {
    show() {
      if (vconsole) {
        vconsole.destroy();
      }
      vconsole = new window.VConsole({
        theme: useGlobalStore().isDark ? 'dark' : 'light',
      });
      this.consoleShow = true;
    },
    hide() {
      if (vconsole) {
        vconsole.destroy();
        vconsole = undefined;
      }
      this.consoleShow = false;
    },
    changeConsole() {
      if (this.consoleShow) {
        this.hide();
      } else {
        this.show();
      }
    }
  }
})
