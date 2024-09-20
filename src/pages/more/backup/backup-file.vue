<template>
    <div>
        <a-alert title="文件备份设置">通过文件进行备份</a-alert>
        <a-button-group type="primary" style="margin: 14px 0;">
            <a-button :loading="loading.exec" @click="execFileBackup()">执行备份</a-button>
            <a-button :loading="loading.load" @click="restoreByFile()" status="success">
                恢复备份
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import {toDateString} from "@/utils/lang/FormatUtil";
import Constant from "@/global/Constant";
import {buildBackup, restoreBackup} from "@/pages/more/backup/func";
import {Notification} from "@arco-design/web-vue";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";


const FOLDER = Constant.id;

const loading = ref({
    exec: false,
    load: false
})

// -------------------------------------- 文件备份 --------------------------------------

function execFileBackup() {
    loading.value.exec = true;
    buildBackup()
        .then(content => {
            download(content,
                FOLDER + "|" + toDateString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".zip",
                "application/zip");
            MessageUtil.success("备份完成");
        }).catch(e => MessageUtil.error("备份失败", e))
        .finally(() => loading.value.exec = false);
}


function restoreByFile() {
    loading.value.load = true;
    _restoreByFile()
        .then(() => {
            if (utools.getWindowType() === 'main') {
                Notification.success({
                    title: "恢复成功",
                    content: "恢复成功，3s后自动关闭插件",
                    duration: 3000,
                    onClose: () => {
                        utools.hideMainWindow();
                        utools.outPlugin(true);
                    }
                })
            } else {
                // 窗口分离，用户自行关闭
                MessageBoxUtil.loading("恢复成功，请关闭插件窗口，重新打开后生效", "恢复成功")
            }

        })
        .catch(e => {
            MessageUtil.error("恢复失败", e);
        })
        .finally(() => loading.value.load = false);
}

async function _restoreByFile() {
    window.preload.customer.openFile({
        title: "选择备份文件",
        filters: [{name: "zip", extensions: ["zip"]}],
        properties: ["openFile"],
        buttonLabel: "选择文件"
    })
        .then(file => file.arrayBuffer())
        .then(restoreBackup)
}

</script>
<style scoped>
</style>
