<template>
  <div class="more-setting-base">
    <t-form :model="instance" layout="vertical">
      <t-divider>图床设置</t-divider>
      <t-form-item label="图片上传策略" label-align="top">
        <t-radio-group v-model="instance.imageStrategy">
          <t-radio :value="ImageStrategyEnum.INNER">内部实现</t-radio>
          <t-radio :value="ImageStrategyEnum.IMAGE">插件【图床】</t-radio>
          <t-radio :value="ImageStrategyEnum.LSKY_PRO" :disabled="true">兰空图床</t-radio>
          <t-radio :value="ImageStrategyEnum.PIC_GO">PicGo</t-radio>
          <t-radio :value="ImageStrategyEnum.IMAGE_PLUS">插件【图床 Plus】（推荐使用）</t-radio>
        </t-radio-group>
        <template #help>
          <span v-if="instance.imageStrategy === ImageStrategyEnum.INNER">
            markdown图片上传到插件内部，占用个人存储空间，图片最大仅支持10m。
          </span>
          <span v-else-if="instance.imageStrategy === ImageStrategyEnum.IMAGE">需要安装插件【图床】</span>
          <span v-else-if="instance.imageStrategy === ImageStrategyEnum.LSKY_PRO">不推荐使用</span>
          <span v-else-if="instance.imageStrategy === ImageStrategyEnum.PIC_GO">本地安装PicGo</span>
          <span v-else-if="instance.imageStrategy === ImageStrategyEnum.IMAGE_PLUS">需要安装插件【图床 Plus】</span>
        </template>
      </t-form-item>
      <t-form-item label="PicGo端口" label-align="top" v-if="instance.imageStrategy === ImageStrategyEnum.PIC_GO">
        <t-input-number v-model="instance.imagePicGoPort" placeholder="请输入端口号" :min="1">
        </t-input-number>
      </t-form-item>
      <t-divider>菜单设置</t-divider>
      <t-alert style="margin-bottom: 8px">当插件宽度小于1080px时生效</t-alert>
      <t-paragraph>
        <t-checkbox v-model="instance.autoCollapsedByEditor">编辑文章自动收起菜单</t-checkbox>
      </t-paragraph>
      <t-paragraph>
        <t-checkbox v-model="instance.autoCollapsedByTodo">点击待办自动收起菜单</t-checkbox>
      </t-paragraph>
      <t-divider>新建文章</t-divider>
      <t-paragraph>
        <t-checkbox v-model="instance.newArticleAutoName">新建文章是否自动命名</t-checkbox>
      </t-paragraph>
      <t-form-item label="新建文章名模板" label-align="top" v-if="instance.newArticleAutoName">
        <t-space>
          <t-input v-model="instance.newArticleTemplateByName" allow-clear style="width: 400px;"/>
          <t-button theme="primary" @click="openCustomerFileNameDrawer()">
            更多
          </t-button>
        </t-space>
        <template #help>
          [YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z] => YYYYescape 2019-01-25T00:00:00-02:00Z
        </template>
      </t-form-item>
      <t-form-item label="默认代码拓展名" label-align="top" v-if="instance.newArticleAutoName">
        <t-input v-model="instance.codeExtraName" allow-clear style="width: 200px;"/>
      </t-form-item>
      <t-divider>markdown编辑器设置</t-divider>
      <t-form-item label="md编辑器是否启用经典换行" label-align="top">
        <t-switch v-model="instance.classicBr"/>
        <template #help v-if="instance.classicBr">
          一个换行会被忽略，两个以上连续换行会分割成段落，
        </template>
        <template #help v-else>
          一个换行会转成&lt;br&gt;，两个连续换行会分割成段落，三个以上连续换行会转成&lt;br&gt;并分割段落
        </template>
      </t-form-item>
      <t-form-item label="md编辑器默认编辑模式" label-align="top">
        <t-radio-group v-model="instance.mdEditorEditMode">
          <t-radio :value="MdEditorEditModeEnum.EDIT_ONLY">仅编辑</t-radio>
          <t-radio :value="MdEditorEditModeEnum.EDIT_PREVIEW">编辑和预览</t-radio>
          <t-radio :value="MdEditorEditModeEnum.AUTO">自动切换</t-radio>
          <t-radio :value="MdEditorEditModeEnum.PREVIEW">仅预览</t-radio>
        </t-radio-group>
        <template #help>
                    <span v-if="instance.mdEditorEditMode === MdEditorEditModeEnum.AUTO">
                        当插件宽度小于{{ Constant.autoCollapsedWidth }}px时切换为【仅编辑】，
                        大于{{ Constant.autoCollapsedWidth }}px时切换为【编辑和预览】
                    </span>
          <span v-else-if="instance.mdEditorEditMode === MdEditorEditModeEnum.PREVIEW">
                        开启后，md编辑器默认是预览模式，想要编辑需要在右上角切换模式
                    </span>
        </template>
      </t-form-item>
      <t-form-item label="md编辑器快捷键" label-align="top">
        <t-radio-group v-model="instance.mdEditorKeyMap">
          <t-radio value="sublime">sublime</t-radio>
          <t-radio value="vim">vim</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-divider>动作设置</t-divider>
      <t-form-item label="待办文章动作" label-align="top">
        <t-radio-group v-model="instance.todoArticleAction">
          <t-radio :value="ArticleActionEnum.TO_ARTICLE">前往文章</t-radio>
          <t-radio :value="ArticleActionEnum.DRAWER">侧边预览</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="关联文章动作" label-align="top">
        <t-radio-group v-model="instance.relationArticleAction">
          <t-radio :value="ArticleActionEnum.TO_ARTICLE">前往文章</t-radio>
          <t-radio :value="ArticleActionEnum.DRAWER">侧边预览</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="表格组件初始化表格大小" label-align="top">
        <t-input-number v-model="instance.tableColumnCount" placeholder="请输入列数" style="width: 120px"
                        :min="1">
          <template #suffix>
            列
          </template>
        </t-input-number>
        <span style="margin: 0 14px"> X </span>
        <t-input-number v-model="instance.tableColCount" placeholder="请输入行数" style="width: 120px" :min="1">
          <template #suffix>
            行
          </template>
        </t-input-number>
      </t-form-item>
      <t-paragraph>
        <t-button theme="primary" @click="save()">保存</t-button>
      </t-paragraph>
    </t-form>
  </div>
</template>
<script lang="ts" setup>
import MessageUtil from "@/utils/modal/MessageUtil";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {clone} from "@/utils/lang/ObjectUtil";
import Constant from "@/global/Constant";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import {ArticleActionEnum} from "@/entity/setting/BaseSetting";
import {openCustomerFileNameDrawer} from "@/pages/setting/base/drawer/CustomerFileNameDrawer";

const instance = ref(clone(useBaseSettingStore().baseSetting, true));

function save() {
  useBaseSettingStore().save(instance.value)
    .then(() => MessageUtil.success("保存成功"))
    .catch(e => MessageUtil.error("保存失败", e));
}

</script>
<style scoped>
</style>
