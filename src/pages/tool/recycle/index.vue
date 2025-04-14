<template>
  <div class="recycle">
    <header class="header">
      <t-input v-model="keyword" placeholder="请输入笔记标题" style="width: 50%" :clearable="true">
        <template #prefix-icon>
          <search-icon/>
        </template>
      </t-input>
      <t-popconfirm content="是否清空回收站，此操作不可逆" @confirm="clearAll" confirm-btn="清空"
                    :ok-button-props="{status:'danger'}">
        <t-button theme="danger">清空</t-button>
      </t-popconfirm>
    </header>
    <t-list style="margin: 0 7px;" :split="true" :style="{height: virtualHeight}"
            :scroll="{ type: 'virtual', rowHeight: 96, bufferSize: 10, threshold: 10 }">
      <t-list-item v-for="item in results" :key="item.item.id">
        <t-list-item-meta :title="item.item.name">
          <template #description>
            <div>创建时间：{{ formatDate(item.item.createTime) }}</div>
            <div>删除时间：{{ formatDate(item.item.updateTime) }}</div>
          </template>
        </t-list-item-meta>
        <template #action>
          <t-space size="small">
            <t-button theme="primary" @click="restore(item.item.id)">
              恢复
            </t-button>
            <t-popconfirm content="删除后将无法恢复，是否继续？" @confirm="remove(item.item.id)"
                          placement="bottom-right" confirm-btn="彻底删除">
              <t-button theme="danger">
                彻底删除
              </t-button>
            </t-popconfirm>
          </t-space>
        </template>
      </t-list-item>
    </t-list>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useWindowSize} from "@vueuse/core";
import {useFuse} from "@vueuse/integrations/useFuse";
import {ArticleIndex} from "@/entity/article";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {SearchIcon} from "tdesign-icons-vue-next";

const size = useWindowSize();

const keyword = ref('');
const items = computed(() => useArticleStore().articleDeletes
  .sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()));

const {results} = useFuse<ArticleIndex>(keyword, items, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: [{
      name: 'name'
    }]
  }
});

const virtualHeight = computed(() => (size.height.value - 52) + 'px')
const formatDate = (date: Date | string | number) => toDateTimeString(date);

function restore(id: number) {
  useArticleStore().updateIndex(id, {
    isDelete: false
  }).then(() => MessageUtil.success("恢复成功"))
    .catch(e => MessageUtil.error("恢复失败", e))
}

function remove(id: number) {
  useArticleStore().removeRealById(id)
    .then(() => MessageUtil.success("彻底删除成功"))
    .catch(e => MessageUtil.error("彻底删除失败", e))
}

function clearAll() {
  useArticleStore().removeRealByIds(items.value.map(e => e.id))
    .then(() => MessageUtil.success("彻底删除成功"))
    .catch(e => MessageUtil.error("彻底删除失败", e))
}

</script>
<style scoped lang="less">
.recycle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .header {
    padding: 7px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
