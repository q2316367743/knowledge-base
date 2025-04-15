<template>
  <div class="p-8px">
    <t-alert title="文件备份设置">通过文件进行备份</t-alert>
    <t-space style="margin: 14px 0;">
      <t-button :loading="loading.exec" @click="execFileBackup()">执行备份</t-button>
      <t-button :loading="loading.load" @click="restoreByFile()" status="success">
        恢复备份
      </t-button>
    </t-space>
  </div>
</template>
<script lang="ts" setup>
import {NotifyPlugin} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import Constant from "@/global/Constant";
import {buildBackup, restoreBackup} from "@/pages/more/backup/func";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";


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
        FOLDER + "|" + toDateTimeString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".zip",
        "application/zip");
      MessageUtil.success("备份完成");
    }).catch(e => MessageUtil.error("备份失败", e))
    .finally(() => loading.value.exec = false);
}


function restoreByFile() {
  loading.value.load = true;
  _restoreByFile()
    .then(() => {
      if (InjectionUtil.getWindowType() === 'main') {
        NotifyPlugin.success({
          title: "恢复成功",
          content: "恢复成功，3s后自动关闭插件",
          duration: 3000,
          onCloseBtnClick: () => {
            InjectionUtil.outPlugin(true);
          },
          onDurationEnd: () => {
            InjectionUtil.outPlugin(true);
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
    .then(files => {
      const file = files[0];
      if (!file) {
        MessageUtil.error("未选择图片")
        return Promise.reject("未选择图片");
      }
      return file.arrayBuffer()
    })
    .then(restoreBackup)
}

</script>
<style scoped>
</style>
