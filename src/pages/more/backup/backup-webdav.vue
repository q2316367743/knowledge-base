<template>
  <div class="p-8px">
    <t-alert title="WebDAV备份设置">通过WebDAV进行备份</t-alert>
    <t-alert type="warning" style="margin-top: 14px;">恢复备份前请先备份当前数据，以免数据丢失</t-alert>
    <t-alert type="error" v-if="disabledBackup" style="margin-top: 14px;">请先设置备份信息</t-alert>
    <t-space style="margin: 14px 0;">
      <t-button @click="instance.visible = true;">设置备份信息</t-button>
      <t-button :disabled="disabledBackup" :loading="loading.exec" @click="execBackup()">执行备份</t-button>
      <t-button :disabled="disabledBackup" :loading="loading.load" @click="loadFiles()" theme="success">
        查看备份列表
      </t-button>
    </t-space>
    <!-- 弹框 -->
    <t-dialog v-model:visible="instance.visible" title="设置备份"
              :confirm-btn="{default: '保存', loading: instance.loading}" placement="center" :draggable="true"
              @confirm="save()">
      <t-form :model="instance" layout="vertical" style="margin-top: 7px;">
        <t-form-item label="服务器地址">
          <t-input v-model="instance.record.url" allow-clear/>
        </t-form-item>
        <t-form-item label="用户名">
          <t-input v-model="instance.record.username" allow-clearstyle="width: 400px;"/>
        </t-form-item>
        <t-form-item label="密码">
          <t-input type="password" v-model="instance.record.password" allow-clear style="width: 400px;"/>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-drawer title="备份列表" v-model:visible="backup.visible" size="400px"
              :confirm-btn="{disabled: backup.file === '', default: '恢复'}" @confirm="restore()">
      <t-radio-group v-model="backup.file" class="w-full">
        <t-list class="w-full" :split="true">
          <t-list-item v-for="file in backup.files">
            <t-radio :value="file">{{ file }}</t-radio>
            <template #action>
              <t-button variant="text" theme="danger" @click="deleteFile(file)">删除</t-button>
            </template>
          </t-list-item>
        </t-list>
      </t-radio-group>
    </t-drawer>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {createClient, FileStat} from "webdav";
import {getDefaultBackupSetting, useBackupSettingStore} from "@/store/db/BackupSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {urlJoin} from "@/utils/file/FileUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import updateCheck from "@/components/update-check/UpdateCheck";
import {buildBackup, restoreBackup} from "@/pages/more/backup/func";


const FOLDER = Constant.id;
const FOLDER_PATH = '/' + FOLDER;

const notBackup = new Set<string>();
notBackup.add(LocalNameEnum.SETTING_BACKUP);

const instance = ref({
  visible: false,
  loading: false,
  record: getDefaultBackupSetting()
});
const backup = ref({
  visible: false,
  files: new Array<string>(),
  file: ''
});
const loading = ref({
  exec: false,
  load: false
})
const disabledBackup = computed(() => instance.value.record.url === '' ||
  instance.value.record.username === '' ||
  instance.value.record.password === '');
const backupSetting = computed(() => useBackupSettingStore().backupSetting);
instance.value.record = Object.assign(instance.value.record, backupSetting.value);

function save() {
  instance.value.loading = true;
  useBackupSettingStore().save(instance.value.record)
    .then(() => {
      MessageUtil.success("保存成功");
      instance.value.visible = false;
    })
    .catch(e => MessageUtil.error("保存失败", e))
    .finally(() => instance.value.loading = false);
}

// -------------------------------------- WebDAV备份 --------------------------------------

function loadFiles() {
  loading.value.load = true;
  backup.value.file = '';
  _loadFiles()
    .then(files => {
      backup.value.files = files;
      backup.value.visible = true;
    })
    .catch(e => MessageUtil.error("获取备份列表失败", e))
    .finally(() => loading.value.load = false);
}

async function _loadFiles(): Promise<Array<string>> {
  const client = createClient(instance.value.record.url, {
    username: instance.value.record.username,
    password: instance.value.record.password,
  });

  // 先判断是否有这个目录
  let rootFiles = await client.getDirectoryContents("/") as Array<FileStat>;
  let needCreate = true;

  rootFiles.forEach(item => {
    if (item.basename === FOLDER) {
      needCreate = false;
    }
  })

  if (needCreate) {
    await client.createDirectory(FOLDER_PATH)
  }

  let files = await client.getDirectoryContents(FOLDER_PATH) as Array<FileStat>;
  return Promise.resolve(files
    .filter(e => e.type === 'file')
    .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())
    .map(e => e.basename));
}

function execBackup() {
  useGlobalStore().startLoading("开始备份");
  loading.value.exec = true;
  _execBackup()
    .then(() => MessageUtil.success("备份成功"))
    .catch(e => MessageUtil.error("备份失败", e))
    .finally(() => {
      loading.value.exec = false;
      useGlobalStore().closeLoading();
    });
}

async function _execBackup() {
  const content = await buildBackup()
  const client = createClient(instance.value.record.url, {
    username: instance.value.record.username,
    password: instance.value.record.password,
  });
  const hasFolder = await client.exists(FOLDER_PATH);
  if (!hasFolder) {
    // 如果不存在文件夹
    await client.createDirectory(FOLDER_PATH);
  }
  await client.putFileContents(
    urlJoin(FOLDER_PATH, toDateTimeString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".zip"),
    content);
}

function deleteFile(name: string) {
  MessageBoxUtil.confirm("确认删除此备份？删除后将无法恢复", "删除备份警告", {
    confirmButtonText: "删除"
  }).then(() => _deleteFile(name)
    .then(() => {
      MessageUtil.success("删除备份成功");
      loadFiles();
    })
    .catch(e => MessageUtil.error("删除备份失败", e)));

}

async function _deleteFile(name: string) {
  const client = createClient(instance.value.record.url, {
    username: instance.value.record.username,
    password: instance.value.record.password,
  });
  await client.deleteFile(urlJoin(FOLDER_PATH, name));
}

function restore() {
  _restore()
    .then(() => {
      MessageUtil.success("恢复成功");
      // 重新初始化数据
      import('@/global/BeanFactory').then(data => {
        useGlobalStore().startLoading("开始初始化数据...");
        // 检查更新、执行更新
        updateCheck().catch(e => MessageUtil.error("更新失败", e))
          .finally(() =>
            data.initData().catch(e => MessageUtil.error("数据初始化失败", e))
              .finally(() => useGlobalStore().closeLoading()))
      });
    })
    .catch(e => MessageUtil.error("恢复失败", e));
}

async function _restore(): Promise<void> {
  const client = createClient(instance.value.record.url, {
    username: instance.value.record.username,
    password: instance.value.record.password,
  });
  // 获取文件
  const res = await client.getFileContents(urlJoin(FOLDER_PATH, backup.value.file), {
    format: 'binary'
  }) as ArrayBuffer;
  await restoreBackup(res);
}

</script>
<style scoped>
</style>
