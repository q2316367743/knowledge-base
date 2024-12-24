import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import {useUmami} from "@/plugin/umami";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {init} from "@/components/update-check/record/init";
import {updateTo130FromUnder} from "@/components/update-check/record/updateTo130";
import {updateTo140FromUnder} from "@/components/update-check/record/updateTo140";
import {updateTo150FromUnder} from "@/components/update-check/record/updateTo150";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isVersionUpdate} from "@/utils/lang/FieldUtil";
import {updateTo231} from "@/components/update-check/record/updateTo231";

export default async function updateCheck(toUpdate?: () => void) {
    const res = await getFromOneByAsync<string>(LocalNameEnum.VERSION)
    if (res.record) {
        if (res.record !== Constant.version) {
            saveOneByAsync(LocalNameEnum.VERSION, Constant.version, res.rev).then(() => console.log("版本更新"));
            // 更新
            toUpdate && toUpdate();
            useUmami.track('版本更新', `[${res.record}] => [${Constant.version}]`);

            if (isVersionUpdate(Constant.version, res.record, '1.3.0')) {
                // 执行
                await updateTo130FromUnder();
                MessageUtil.success("数据迁移成功");
            }
            if (isVersionUpdate(Constant.version, res.record, '1.4.0')) {
                // 执行
                await updateTo140FromUnder();
                MessageUtil.success("数据迁移成功");
            }
            if (isVersionUpdate(Constant.version, res.record, '1.5.0')) {
                // 执行
                await updateTo150FromUnder();
                MessageUtil.success("数据迁移成功");
            }
            if (isVersionUpdate(Constant.version, res.record, '2.3.1')) {
                await updateTo231();
                MessageUtil.success("数据迁移成功");
            }

        }
    } else {
        // 第一次
        NotificationUtil.success("欢迎您使用知识库");
        saveOneByAsync(LocalNameEnum.VERSION, Constant.version).then(() => console.log("版本更新"));
        init();
        useUmami.track('新用户', `[0.0.0] => [${Constant.version}]`);
    }
}




