import {defineStore} from "pinia";

export const useHomeEditorStore = defineStore('home-editor', {
    state: () => ({
        id: 0,
        collapsed: false
    }),
    actions: {
        switchCollapsed() {
            this.collapsed = !this.collapsed;
        },
        setId(id: number) {
            this.id = id;
        }
    }
})
