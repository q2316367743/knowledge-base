import {defineStore} from "pinia";
import {BaseSetting, getDefaultBaseSetting} from "@/entity/setting/BaseSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getFromOneWithDefaultByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import Constant from "@/global/Constant";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import dayjs from "dayjs";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {useCustomerFileNameStore} from "@/store/setting/CustomerFileNameStore";

export const useBaseSettingStore = defineStore('base-setting', () => {
  const baseSetting = ref<BaseSetting>(getDefaultBaseSetting());
  const rev = ref<string | undefined>(undefined);

  const imageStrategy = computed(() => baseSetting.value.imageStrategy);
  const autoCollapsedByEditor = computed(() => baseSetting.value.autoCollapsedByEditor);
  const autoCollapsedByTodo = computed(() => baseSetting.value.autoCollapsedByTodo);
  const newArticleAutoName = computed(() => baseSetting.value.newArticleAutoName);
  const newArticleTemplateByName = computed(() => baseSetting.value.newArticleTemplateByName);
  const codeExtraName = computed(() => baseSetting.value.codeExtraName);
  const mdEditorEditMode = computed(() => baseSetting.value.mdEditorEditMode);
  const mdEditorAutoMode = computed(() => baseSetting.value.mdEditorEditMode === MdEditorEditModeEnum.AUTO);
  const defaultModel = computed(() => {
    switch (baseSetting.value.mdEditorEditMode) {
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
  });
  const todoArticleAction = computed(() => baseSetting.value.todoArticleAction);
  const relationArticleAction = computed(() => baseSetting.value.relationArticleAction);
  const tableColumnCount = computed(() => baseSetting.value.tableColumnCount);
  const tableColCount = computed(() => baseSetting.value.tableColCount);
  const classicBr = computed(() => baseSetting.value.classicBr);
  const mdEditorKeyMap = computed(() => baseSetting.value.mdEditorKeyMap || 'sublime');

  const init = async () => {
    const res = await getFromOneWithDefaultByAsync(LocalNameEnum.SETTING_BASE, getDefaultBaseSetting());
    baseSetting.value = {...baseSetting.value, ...res.record};
    rev.value = res.rev;
    if (baseSetting.value.imageStrategy === ImageStrategyEnum.LSKY_PRO) {
      baseSetting.value.imageStrategy = ImageStrategyEnum.INNER;
      await save(baseSetting.value);
      console.debug("重置图片策略为内部");
    }
  };

  const save = async (newBaseSetting: BaseSetting) => {
    baseSetting.value = newBaseSetting;
    rev.value = await saveOneByAsync(LocalNameEnum.SETTING_BASE, baseSetting.value, rev.value);
  };

  return {
    baseSetting,
    rev,
    imageStrategy,
    autoCollapsedByEditor,
    autoCollapsedByTodo,
    newArticleAutoName,
    newArticleTemplateByName,
    codeExtraName,
    mdEditorEditMode,
    mdEditorAutoMode,
    defaultModel,
    todoArticleAction,
    relationArticleAction,
    tableColumnCount,
    tableColCount,
    classicBr,
    mdEditorKeyMap,
    init,
    save,
  };
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
