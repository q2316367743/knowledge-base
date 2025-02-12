<template>
  <div class="more-setting-theme">
    <a-form :model="instance" layout="vertical">
      <a-form-item label="主题">
        <a-select v-model="instance.theme" placeholder="请选择主题" allow-clear allow-search>
          <a-option :key="0" :value="0">不设置</a-option>
          <a-option v-for="theme in themes" :key="theme.id" :value="theme.id">{{ theme.name }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="markdown菜单">
        <a-checkbox-group v-model="instance.markdownMenus">
          <a-checkbox v-for="menu in markdownMenus" :key="menu.id" :value="menu.id">{{
              menu.name
            }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="markdown语法">
        <a-checkbox-group v-model="instance.markdownSyntaxes">
          <a-checkbox v-for="menu in markdownSyntaxes" :key="menu.id" :value="menu.id">{{
              menu.name
            }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="save()">保存</a-button>
          <a-button type="text" @click="reference()">刷新主题</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {clone} from "@/utils/lang/ObjectUtil";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";

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
