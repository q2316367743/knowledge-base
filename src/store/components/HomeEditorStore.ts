import {defineStore} from "pinia";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

export const useHomeEditorStore = defineStore('home-editor', {
    state: () => ({
        id: 0,
        collapsed: getItemByDefault<boolean>(LocalNameEnum.KEY_HOME_COLLAPSED, false),
        widthWrap: getItemByDefault<string>(LocalNameEnum.KEY_HOME_WIDTH, '264px')
    }),
    getters: {
        width: (state): string => {
            if (state.collapsed) {
                return '0px';
            } else {
                return state.widthWrap
            }
        }
    },
    actions: {
        switchCollapsed() {
            this.collapsed = !this.collapsed;
            setItem<boolean>(LocalNameEnum.KEY_HOME_COLLAPSED, this.collapsed);
        },
        setId(id: number) {
            this.id = id;
        },
        setWidth(width: string) {
            if (width === '0px' && this.collapsed) {
                return;
            }
            this.widthWrap = width;
            setItem<string>(LocalNameEnum.KEY_HOME_WIDTH, this.widthWrap);
        }
    }
})
