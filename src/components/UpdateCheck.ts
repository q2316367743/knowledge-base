import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import NotificationUtil from "@/utils/NotificationUtil";

export default function updateCheck(toUpdate?: () => void) {
    utools.db.promises.get(LocalNameEnum.VERSION)
        .then(res => {
            if (res) {
                if (res.value !== Constant.version) {
                    // 更新
                    NotificationUtil.success(`欢迎您更新到【${Constant.version}】`);
                    utools.db.promises.put({
                        _id: LocalNameEnum.VERSION,
                        _rev: res._rev,
                        value: Constant.version
                    });
                    toUpdate && toUpdate();
                }
            } else {
                // 第一次
                NotificationUtil.success("欢迎您使用知识库");
                utools.db.promises.put({
                    _id: LocalNameEnum.VERSION,
                    value: Constant.version
                });
            }
        })
}

