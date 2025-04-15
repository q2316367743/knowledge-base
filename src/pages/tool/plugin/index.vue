<template>
  <t-layout class="setting-plugin">
    <t-aside width="300px">
      <setting-plugin-side @select="onSelect"/>
    </t-aside>
    <t-content>
      <setting-plugin-content :plugin="plugin" v-if="load"/>
      <t-empty v-else title="主题、插件和模板" type="fail" style="margin-top: 20vh;">
        <template #image>
          <questionnaire-icon />
        </template>
        <template #description>
          <p>选择左侧的插件进行编辑</p>
          <p>通过主题与插件，可以自定义您的知识库插件</p>
          <p>主题、markdown菜单、markdown语法需要设置才可以启用。</p>
          <p>markdown模板命名请以<b style="color: rgb(var(--danger-6))">正则表达式</b>的方式进行命名，创建markdown时回去匹配第一个匹配到的。
          </p>
          <p style="color: rgb(var(--warning-6))">请注意，如果修改的主题是正在使用的，修改后需要前往主题设置中刷新主题</p>
        </template>
        <template #action>
          <t-space size="small">
            <t-button theme="primary" @click="toHelp" >
              <template #icon>
                <questionnaire-icon />
              </template>
              查看帮助
            </t-button>
            <t-button theme="primary" @click="toSetting">
              <template #icon>
                <setting-icon />
              </template>
              前往设置
            </t-button>
          </t-space>
        </template>
      </t-empty>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import {nextTick, ref} from "vue";
import {useRouter} from "vue-router";
import Constant from "@/global/Constant";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {PluginSettingIndex} from "@/entity/setting/PluginSetting";
import SettingPluginSide from "@/pages/tool/plugin/layout/SettingPluginSide.vue";
import SettingPluginContent from "@/pages/tool/plugin/layout/SettingPluginContent.vue";
import {QuestionnaireIcon, SettingIcon} from "tdesign-icons-vue-next";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const router = useRouter();

const plugin = ref<PluginSettingIndex>();
const load = ref(false);

const toHelp = () => InjectionUtil.shellOpenExternal(Constant.help.plugin);
const toSetting = () => router.push({
  path: '/setting/base',
  query: {
    tab: 'theme'
  }
});

function onSelect(selectKey: string | number) {
  // 文件
  load.value = false;
  plugin.value = undefined;
  nextTick(() => {
    plugin.value = usePluginSettingStore().pluginMap.get(selectKey as number);
    load.value = !!plugin.value;
  })
}


</script>
<style scoped>
.setting-plugin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
