import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import NotificationUtil from "@/utils/NotificationUtil";

export default function updateCheck(toUpdate?: () => void) {
    utools.db.promises.get(LocalNameEnum.VERSION)
        .then(res => {
            if (res) {
                if (res.value !== Constant.version) {
                    utools.db.promises.put({
                        _id: LocalNameEnum.VERSION,
                        _rev: res._rev,
                        value: Constant.version
                    });
                    toUpdate && toUpdate();
                    // 更新
                    NotificationUtil.confirm(`欢迎您更新到【${Constant.version}】`, "版本更新", {
                        confirmButtonText: "查看更新日志",
                        cancelButtonText: "取消",
                        duration: 10
                    })
                        .then(() => {
                            utools.shellOpenExternal(Constant.updateLog);
                        });
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

