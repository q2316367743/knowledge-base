<template>
  <div class="more-setting-theme">
    <t-form :model="{}">
      <t-form-item label="主题颜色" label-align="top">
        <t-radio-group v-model="themeColor" :options="ThemeColors"/>
      </t-form-item>
      <t-form-item label="是否启用图片背景" label-align="top">
        <t-switch :value="theme.enabled" @change="handleChange('enabled', $event)"/>
      </t-form-item>
      <template v-if="theme.enabled">
        <t-form-item label="背景模糊" label-align="top">
          <t-input-number v-model="theme.bgBlur" :min="0" :max="100" suffix="像素" style="width: 186px" @change="handleChange('bgBlur', $event)"/>
        </t-form-item>
        <t-form-item label="背景图片" label-align="top">
          <div class="w-full flex justify-between items-center gap-8px">
            <t-card header="明亮" class="w-full">
              <t-upload accept="image/*" class='w-full' theme="image" :files="lightFiles" :request-method="lightTheme"/>
            </t-card>
            <t-card header="暗黑" class="w-full">
              <t-upload accept="image/*" class='w-full' theme="image" :files="darkFiles" :request-method="darkTheme"/>
            </t-card>
          </div>
        </t-form-item>
      </template>
    </t-form>
  </div>
</template>
<script lang="ts" setup>
import {TdUploadProps, UploadFile} from 'tdesign-vue-next';
import {ThemeColors} from "@/global/theme";
import {useGlobalStore} from "@/store";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {basename} from "@/utils/file/FileUtil";
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";
import {RequestMethodResponse} from "tdesign-vue-next/es/upload/type";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ThemeSetting} from "@/entity/setting/ThemeSetting";

const {themeColor} = toRefs(useGlobalStore());
const {theme} = toRefs(useThemeSettingStore());
const lightFiles = computed<Array<UploadFile>>(() => {
  const {lightBgImage} = useThemeSettingStore().theme;
  if (lightBgImage) return [{
    name: basename(lightBgImage),
    url: lightBgImage
  }];
  return [];
})
const darkFiles = computed<Array<UploadFile>>(() => {
  const {darkBgImage} = useThemeSettingStore().theme;
  if (darkBgImage) return [{
    name: basename(darkBgImage),
    url: darkBgImage
  }];
  return [];
})

const lightTheme: TdUploadProps["requestMethod"] = async (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> => {
  const f: UploadFile = Array.isArray(files) ? files[0] : files;
  const {raw} = f;
  if (!raw) return {status: 'fail', error: '文件不存在', response: {}};
  const r = await useAttachmentUpload.upload(raw, raw.name, raw.type);
  await useThemeSettingStore().update({lightBgImage: r.url});
  return {status: 'success', response: {url: r.url, files: [f]}}
}
const darkTheme: TdUploadProps["requestMethod"] = async (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> => {
  const f: UploadFile = Array.isArray(files) ? files[0] : files;
  const {raw} = f;
  if (!raw) return {status: 'fail', error: '文件不存在', response: {}};
  const r = await useAttachmentUpload.upload(raw, raw.name, raw.type);
  await useThemeSettingStore().update({darkBgImage: r.url});
  return {status: 'success', response: {url: r.url, files: [f]}}
}
const handleChange = <K extends keyof ThemeSetting>(k: K, v: any) => {
  const p: Partial<ThemeSetting> = {}
  p[k] = v;
  useThemeSettingStore().update(p).catch(e => MessageUtil.error("更新失败", e));
}
</script>
<style scoped>
</style>
