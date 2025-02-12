import {buildCodeEditorSetting} from "@/entity/setting/CodeEditorSetting";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

export const codeEditorSetting = useUtoolsDbStorage(LocalNameEnum.SETTING_CODE_EDITOR, buildCodeEditorSetting());