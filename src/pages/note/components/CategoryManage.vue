<template>
  <div class="setting-dict">
    <div class="header">
      <t-input :clearable="true" v-model="keyword" placeholder="请输入分类名称"/>
    </div>
    <div class="container">
      <t-tree :data="treeData" :scroll="{type: 'virtual'}" :draggable="true" :line="true" :style="{height: height}"
              @drop="onDrop($event)">
        <template #operations="{node}">
          <t-space size="small">
            <t-button theme="primary" size="small" @click="add(node.value)">
              <template #icon>
                <plus-icon/>
              </template>
            </t-button>
            <t-button theme="primary" size="small" @click="update(node.value)">
              <template #icon>
                <edit2-icon/>
              </template>
            </t-button>
            <t-popconfirm content="确定要删除此分类？" confirm-btn="删除" @confirm="remove(node.value)">
              <t-button theme="danger" size="small">
                <template #icon>
                  <delete-icon/>
                </template>
              </t-button>
            </t-popconfirm>
          </t-space>
        </template>
      </t-tree>
    </div>
  </div>
</template>
<script lang="ts" setup>;
import {TreeOptionData} from "tdesign-vue-next";
import {DeleteIcon, Edit2Icon, PlusIcon} from "tdesign-icons-vue-next";
import {useCategoryStore} from "@/store/db/CategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil"

const size = useWindowSize();

const keyword = ref('');
const categoryTree = computed<Array<TreeOptionData>>(() => useCategoryStore().categoryTree);
const height = computed(() => (size.height.value - 40 - 7 - 48 - 6) + 'px');


function add(pid: number) {
  useCategoryStore().add(pid)
    .then(() => MessageUtil.success("新增成功"))
    .catch(e => {
      MessageUtil.error("新增失败", e)
    });
}

function update(id: number) {
  useCategoryStore().update(id)
    .then(() => MessageUtil.success("更新成功"))
    .catch(e => {
      MessageUtil.error("更新失败", e)
    });
}

function remove(id: number) {
  useCategoryStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e));
}

const treeData = computed<Array<TreeOptionData>>(() => {
  if (!keyword.value) return categoryTree.value;
  return searchData(keyword.value);
})

function searchData(keyword: string) {
  const loop = (data: Array<TreeOptionData>) => {
    const result: Array<TreeOptionData> = [];
    data.forEach(item => {
      if ((item.label as string || '').toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({...item});
      } else if (item.children && Array.isArray(item.children)) {
        const filterData = loop(item.children);
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result;
  }

  return loop(categoryTree.value);
}

function onDrop(data: { e: DragEvent, dragNode: TreeOptionData, dropNode: TreeOptionData }) {
  if (typeof data.dragNode.value !== 'undefined' && typeof data.dropNode.value !== 'undefined') {
    useCategoryStore().drop(data.dragNode.value as number, data.dropNode.value as number)
      .then(() => MessageUtil.success("移动成功"))
      .catch(e => MessageUtil.error("移动失败", e));

  }
}

</script>
<style scoped lang="less">
.setting-dict {
  position: relative;
  height: 100%;
  width: 100%;

  .header {
    height: 32px;
    padding: 4px 7px;
    display: flex;
    justify-content: space-between;
  }

  .container {
    position: absolute;
    top: 40px;
    left: 7px;
    right: 7px;
    bottom: 7px;
  }
}
</style>
