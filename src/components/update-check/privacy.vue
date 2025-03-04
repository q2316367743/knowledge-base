<template>
  <a-modal title="知识库隐私政策" :closable="false" :esc-to-close="false" :mask-closable="false"
           :visible="visible" fullscreen ok-text="同意" cancel-text="拒绝" @ok="enable" @cancel="disable">
    <a-typography>
      <a-typography-paragraph>欢迎使用知识库!</a-typography-paragraph>
      <a-typography-paragraph>
        知识库尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，
        知识库会按照本隐私政策的规定收集、使用、共享、存储和保护您的个人信息。
        但知识库将以高度的勤勉、审慎义务对待这些信息。
        除本隐私政策另有规定外，在未征得您事先许可的情况下，知识库不会将这些信息对外披露或向第三方提供。
        知识库会不定时更新本隐私政策。
        您同意隐私政策表示您已了解应用提供的基本功能，以及基本功能运行所需的必要个人信息，并给予相应的收集使用授权，
        但并不代表您已单独同意开启附加功能、处理非必要个人信息，相关附加功能的开启、处理非必要个人信息以及处理敏感个人信息，
        我们会根据您的实际使用情况单独征求您的同意。
      </a-typography-paragraph>
      <a-typography-paragraph>
        <p>插件在运行过程中，为了让您有更好的使用体验，故插件中加入了埋点功能，该功能会收集一下信息：</p>
        <ol>
          <li>您新建笔记的类型</li>
          <li>各个功能模块的使用情况</li>
          <li>您现在使用的版本</li>
          <li>您在进入插件和离开插件的时间</li>
        </ol>
        <p>我并不会收集您任何的笔记信息，也不会收集任何与您隐私相关的信息。</p>
      </a-typography-paragraph>
      <a-typography-paragraph>
        <b>如拒绝本协议，将仅会收集您的插件总体使用时间。</b>
      </a-typography-paragraph>
    </a-typography>
  </a-modal>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";

const visible = computed(() => useGlobalStore().privacy === 0);

function enable() {
  useGlobalStore().privacy = 1;
  MessageUtil.success("感谢您的信任，知识库因为你将会更好！");
}

function disable() {
  useGlobalStore().privacy = 2;

}
</script>
<style scoped>

</style>
