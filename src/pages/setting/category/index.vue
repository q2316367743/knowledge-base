<template>
    <div class="setting-dict">
        <div class="header">
            <a-input allow-clear v-model="keyword" placeholder="请输入分类名称" style="width: 320px"/>
            <a-button type="primary" @click="add(0)">新增</a-button>
        </div>
        <div class="container">
            <a-tree :data="treeData" block-node :virtual-list-props="{height: height}" draggable @drop="onDrop($event)">
                <template #extra="nodeData">
                    <a-button-group type="text">
                        <a-button @click="add(nodeData.key)">
                            <template #icon>
                                <icon-plus/>
                            </template>
                        </a-button>
                        <a-button @click="update(nodeData.key)">
                            <template #icon>
                                <icon-edit/>
                            </template>
                        </a-button>
                        <a-popconfirm content="确定要删除此分类？" ok-text="删除" @ok="remove(nodeData.key)">
                            <a-button status="danger">
                                <template #icon>
                                    <icon-delete/>
                                </template>
                            </a-button>
                        </a-popconfirm>
                    </a-button-group>
                </template>
            </a-tree>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import { useCategoryStore} from "@/store/db/CategoryStore";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {statistics} from "@/global/BeanFactory";
import {TreeNodeData} from "@arco-design/web-vue";


const keyword = ref('');
const categoryTree = computed<Array<TreeNodeData>>(() => useCategoryStore().categoryTree);
const height = computed(() => useGlobalStore().size.height - 40 - 7);


function add(pid: number) {
    statistics.access("新增分类");
    useCategoryStore().add(pid)
        .then(() => MessageUtil.success("新增成功"))
        .catch(e => {
            if (e !== 'cancel') {
                MessageUtil.error("新增失败", e)
            }
        });
}

function update(id: number) {
    useCategoryStore().update(id)
        .then(() => MessageUtil.success("更新成功"))
        .catch(e => {
            if (e !== 'cancel') {
                MessageUtil.error("更新失败", e)
            }
        });
}

function remove(id: number) {
    useCategoryStore().remove(id)
        .then(() => MessageUtil.success("删除成功"))
        .catch(e => MessageUtil.error("删除失败", e));
}

const treeData = computed<Array<TreeNodeData>>(() => {
    if (!keyword.value) return categoryTree.value;
    return searchData(keyword.value);
})

function searchData(keyword: string) {
    const loop = (data: Array<TreeNodeData>) => {
        const result: Array<TreeNodeData> = [];
        data.forEach(item => {
            if ((item.title || '').toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                result.push({...item});
            } else if (item.children) {
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

function onDrop(data: { e: DragEvent, dragNode: TreeNodeData, dropNode: TreeNodeData }) {
    if (typeof data.dragNode.key !== 'undefined' && typeof data.dropNode.key !== 'undefined') {
        useCategoryStore().drop(data.dragNode.key as number, data.dropNode.key as number)
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
