import { defineStore } from "pinia";
import VConsole from "vconsole";

import {useGlobalStore} from "@/store/GlobalStore";

let vconsole: VConsole | undefined;

export const useErrorStore = defineStore('error', {
    state: () => ({
        consoleShow: false
    }),
    actions: {
        show() {
            if (vconsole) {
                vconsole.destroy();
            }
            vconsole = new VConsole({
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
