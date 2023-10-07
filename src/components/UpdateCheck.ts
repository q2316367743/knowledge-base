import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import NotificationUtil from "@/utils/NotificationUtil";
import {useAuthStore} from "@/store/components/AuthStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default function updateCheck(toUpdate?: () => void) {
    useAuthStore().authDriver.get(LocalNameEnum.VERSION)
        .then(res => {
            if (res) {
                if (res.value !== Constant.version) {
                    useAuthStore().authDriver.put({
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
                    if (Constant.version === '1.1.0') {
                        MessageBoxUtil.confirm("本次更新进行了几个重要的更新：\n" +
                            "1. 增加多种存储方式，现在数据可以存到alist中，不依赖utools就可以实现同步，未来将新增本地模式和webdav\n" +
                            "2. 新增编辑器模式的主页，这样主页可以直接编辑文章，并且支持目录\n" +
                            "3. 分类升级，现在的分类为多级分类，可以创建无限多的子分类", "重要更新", {
                            confirmButtonText: "查看更多"
                        })
                            .then(() => utools.shellOpenExternal(Constant.updateLog));
                    }
                }
            } else {
                // 第一次
                NotificationUtil.success("欢迎您使用知识库");
                useAuthStore().authDriver.put({
                    _id: LocalNameEnum.VERSION,
                    value: Constant.version
                });
            }
        })
}

