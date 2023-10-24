import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import NotificationUtil from "@/utils/NotificationUtil";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {init} from "@/components/update-check/record/init";
import {parseVersion} from "@/components/update-check/domain";
import {updateTo130FromUnder} from "@/components/update-check/record/updateTo130";
import {updateTo140FromUnder} from "@/components/update-check/record/updateTo140";

export default function updateCheck(toUpdate?: () => void) {
    getFromOneByAsync<string>(LocalNameEnum.VERSION)
        .then(res => {
            if (res.record) {
                if (res.record !== Constant.version) {
                    saveOneByAsync(LocalNameEnum.VERSION, Constant.version, res.rev).then(() => console.log("版本更新"));
                    toUpdate && toUpdate();

                    const oldVersion = parseVersion(res.record);
                    const newVersion = parseVersion(Constant.version);

                    if (oldVersion.main <= 1 && oldVersion.sub < 3) {
                        if (newVersion.main > 1 || (newVersion.main == 1 && oldVersion.sub >= 3)) {
                            // 执行
                            updateTo130FromUnder();
                        }
                    }
                    if (oldVersion.main <= 1 && oldVersion.sub < 4) {
                        if (newVersion.main > 1 || (newVersion.main == 1 && oldVersion.sub >= 4)) {
                            // 执行
                            updateTo140FromUnder();
                        }
                    }

                }
            } else {
                // 第一次
                NotificationUtil.success("欢迎您使用知识库");
                saveOneByAsync(LocalNameEnum.VERSION, Constant.version).then(() => console.log("版本更新"));
                init();
            }
        })
}




