<template>
  <t-drawer v-model:visible="visible" header="代码运行帮助" size="400px" :footer="false">
    <t-paragraph>
      代码运行可以在本地电脑运行保存的代码笔记。
    </t-paragraph>
    <t-paragraph>
      「文件名匹配规则」是一个正则表达式，在点击代码运行时，会根据文件名从「文件名匹配规则」中进行匹配，会找到第一个匹配的「文件名匹配规则」，
      之后把代码笔记保存为电脑的临时文件，运行命令会根据变量替换成实际的文件路径，然后运行命令。
    </t-paragraph>
    <t-paragraph>
      在代码运行命令中，可以使用以下变量：
    </t-paragraph>
    <t-paragraph>
      <ul>
        <li v-for="line  in  lines">{{ line }}</li>
      </ul>
    </t-paragraph>
    <t-paragraph>
      <span>更多信息请查看：</span>
      <t-link theme="primary" href="https://blog.esion.xyz/archives/zhi-shi-ku-dai-ma-yun-xing">代码运行帮助</t-link>
    </t-paragraph>
  </t-drawer>
</template>
<script lang="ts" setup>
const visible = defineModel({
  type: Boolean,
  default: false
});

const lines = [
  '{{filePath}}：文件实际路径',
  '{{fileName}}：文件名',
  '{{fileDir}}：文件所在目录',
  '{{fileContent}}：文件内容'
]
</script>
<style scoped lang="less">

</style>
