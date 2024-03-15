import {defineStore} from "pinia";
import {BaseSetting, getDefaultBaseSetting} from "@/entity/setting/BaseSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import Constant from "@/global/Constant";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import dayjs from "dayjs";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";

export const useBaseSettingStore = defineStore('base-setting', {
    state: () => ({
        baseSetting: getDefaultBaseSetting(),
        rev: undefined as string | undefined
    }),
    getters: {
        imageStrategy: state => state.baseSetting.imageStrategy,
        autoCollapsedByEditor: state => state.baseSetting.autoCollapsedByEditor,
        autoCollapsedByTodo: state => state.baseSetting.autoCollapsedByTodo,
        newArticleTemplateByName: state => state.baseSetting.newArticleTemplateByName,
        codeExtraName: state => state.baseSetting.codeExtraName,
        mdEditorEditMode: state => state.baseSetting.mdEditorEditMode,
        mdEditorAutoMode: (state): boolean => state.baseSetting.mdEditorEditMode === MdEditorEditModeEnum.AUTO,
        defaultModel: (state): 'editOnly' | 'edit&preview' => {
            switch (state.baseSetting.mdEditorEditMode) {
                case MdEditorEditModeEnum.EDIT_ONLY:
                    return 'editOnly';
                case MdEditorEditModeEnum.EDIT_PREVIEW:
                    return 'edit&preview';
                default:
                    if (window.innerWidth > Constant.autoCollapsedWidth) {
                        return 'edit&preview';
                    }
                    return 'editOnly';
            }
        },
        todoArticleAction: state => state.baseSetting.todoArticleAction,
        relationArticleAction: state => state.baseSetting.relationArticleAction,
    },
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_BASE, getDefaultBaseSetting());
            this.baseSetting = res.record;
            this.rev = res.rev;
        },
        async save(baseSetting: BaseSetting) {
            this.baseSetting = baseSetting;
            this.rev = await saveOneByAsync(LocalNameEnum.SETTING_BASE, this.baseSetting, this.rev);
        }
    }
});

export function buildArticleName(type: ArticleTypeEnum): string {
    const name = dayjs().format(useBaseSettingStore().newArticleTemplateByName);
    if (type === ArticleTypeEnum.CODE) {
        return `${name}.${useBaseSettingStore().codeExtraName}`;
    }
    return name;
}
