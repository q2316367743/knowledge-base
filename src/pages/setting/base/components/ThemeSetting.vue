<template>
  <div class="more-setting-theme">
    <t-form :model="instance">
      <t-form-item label="主题颜色" label-align="top">
        <t-radio-group v-model="themeColor" :options="ThemeColors"/>
      </t-form-item>
      <t-form-item label="主题" label-align="top">
        <t-select v-model="instance.theme" placeholder="请选择主题" :clearable="true" :filterable="true"
                  :disabled="true">
          <t-option :key="0" :value="0">不设置</t-option>
          <t-option v-for="theme in themes" :key="theme.id" :value="theme.id">{{ theme.name }}</t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="markdown菜单" label-align="top">
        <t-checkbox-group v-model="instance.markdownMenus" :disabled="true">
          <t-checkbox v-for="menu in markdownMenus" :key="menu.id" :value="menu.id">{{
              menu.name
            }}
          </t-checkbox>
        </t-checkbox-group>
      </t-form-item>
      <t-form-item label="markdown语法" label-align="top">
        <t-checkbox-group v-model="instance.markdownSyntaxes" :disabled="true">
          <t-checkbox v-for="menu in markdownSyntaxes" :key="menu.id" :value="menu.id">{{
              menu.name
            }}
          </t-checkbox>
        </t-checkbox-group>
      </t-form-item>
      <t-form-item label-align="top">
        <t-space>
          <t-button theme="primary" @click="save()" :disabled="true">保存</t-button>
          <t-button variant="text" @click="reference()" :disabled="true">刷新主题</t-button>
        </t-space>
      </t-form-item>
    </t-form>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {clone} from "@/utils/lang/ObjectUtil";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";
import {themeColor} from "@/store";
import {ThemeColors} from "@/global/theme";

const emits = defineEmits(['save']);

const instance = ref(clone(useThemeSettingStore().themeSetting, true));

const plugins = computed(() => usePluginSettingStore().plugins);
const themes = computed(() => plugins.value.filter(p => p.type === PluginSettingTypeEnum.THEME));
const markdownMenus = computed(() => plugins.value.filter(p => p.type === PluginSettingTypeEnum.MARKDOWN_MENU));
const markdownSyntaxes = computed(() => plugins.value.filter(p => p.type === PluginSettingTypeEnum.MARKDOWN_SYNTAX));

function save() {
  useThemeSettingStore().save(instance.value)
    .then(() => MessageUtil.success("保存成功"))
    .catch(e => MessageUtil.error("保存失败", e))
    .finally(() => emits('save'));
}

function reference() {
  try {
    useThemeSettingStore().buildThemeStyle();
    MessageUtil.success("刷新成功");
  } catch (e) {
    MessageUtil.error("刷新失败", e)
  }
}
</script>
<style scoped>
</style>
