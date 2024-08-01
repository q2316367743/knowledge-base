import {defineStore} from "pinia";
import {BaseSetting, getDefaultBaseSetting} from "@/entity/setting/BaseSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import Constant from "@/global/Constant";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import dayjs from "dayjs";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import {isUtools} from "@/global/BeanFactory";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {useCustomerFileNameStore} from "@/store/setting/CustomerFileNameStore";

export const useBaseSettingStore = defineStore('base-setting', {
    state: () => ({
        baseSetting: getDefaultBaseSetting(),
        rev: undefined as string | undefined
    }),
    getters: {
        imageStrategy: state => state.baseSetting.imageStrategy,
        autoCollapsedByEditor: state => state.baseSetting.autoCollapsedByEditor,
        autoCollapsedByTodo: state => state.baseSetting.autoCollapsedByTodo,
        newArticleAutoName: state => state.baseSetting.newArticleAutoName,
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
        tableColumnCount: state => state.baseSetting.tableColumnCount,
        tableColCount: state => state.baseSetting.tableColCount,
        classicBr: state => state.baseSetting.classicBr,
        mdEditorKeyMap: state => state.baseSetting.mdEditorKeyMap ||  'sublime',
    },
    actions: {
        async init() {
            const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_BASE, getDefaultBaseSetting());
            this.baseSetting = Object.assign(this.baseSetting, res.record);
            this.rev = res.rev;
            if (!isUtools) {
                if (this.baseSetting.imageStrategy !== ImageStrategyEnum.LSKY_PRO &&
                    this.baseSetting.imageStrategy !== ImageStrategyEnum.INNER) {
                    this.baseSetting.imageStrategy = ImageStrategyEnum.INNER;
                    this.save(this.baseSetting).then(() => console.debug("重置图片策略为内部"));
                }
            }
        },
        async save(baseSetting: BaseSetting) {
            this.baseSetting = baseSetting;
            this.rev = await saveOneByAsync(LocalNameEnum.SETTING_BASE, this.baseSetting, this.rev);
        }
    }
});

export function buildArticleName(type: ArticleTypeEnum, newArticleTemplateByName: string, codeExtraName: string, pid: number): string {

    const {customerFileNameMap} = useCustomerFileNameStore();

    let newVar = customerFileNameMap.get(pid);
    if (newVar) {
        newArticleTemplateByName = newVar.script;
    }

    const name = dayjs().format(newArticleTemplateByName);
    if (type === ArticleTypeEnum.CODE) {
        return `${name}.${codeExtraName}`;
    }
    return name;
}
