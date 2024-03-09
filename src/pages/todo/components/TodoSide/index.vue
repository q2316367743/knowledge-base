<template>
    <div class="todo-side">
        <header style="margin: 7px;">
            <a-input-group>
                <a-input style="width: 218px;" v-model="keyword" allow-clear/>
                <a-button type="primary" @click="add(0)">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </a-input-group>
        </header>
        <a-tree v-model:selected-keys="selectKeys" :data="treeNodeData" block-node
                style="margin: 7px;width: calc(100% - 14px)" draggable :virtual-list-props="virtualListProps"
                :allow-drop="checkAllowDrop" @drop="onDrop($event)">
            <template #extra="nodeData">
                <a-dropdown>
                    <a-button type="text">
                        <template #icon>
                            <icon-more/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption v-if="!nodeData.isLeaf" @click="add(nodeData.key)">
                            <template #icon>
                                <icon-plus/>
                            </template>
                            新增
                        </a-doption>
                        <a-doption @click="update(nodeData.key)">
                            <template #icon>
                                <icon-edit/>
                            </template>
                            修改
                        </a-doption>
                        <a-doption v-if="!nodeData.children || nodeData.children.length === 0"
                                   @click="remove(nodeData.key, nodeData.title)" style="color: red;">
                            <template #icon>
                                <icon-delete/>
                            </template>
                            删除
                        </a-doption>
                        <a-doption v-if="nodeData.isLeaf" @click="switchFeature(nodeData.key)">
                            <template #icon>
                                <icon-star-fill v-if="hasFeature(nodeData.key)"/>
                                <icon-star v-else/>
                            </template>
                            快速启动
                        </a-doption>
                    </template>
                </a-dropdown>
            </template>
        </a-tree>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import {TreeNodeData} from "@arco-design/web-vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useTodoStore} from "@/store/components/TodoStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import {searchData} from "@/entity/ListTree";
import Constant from "@/global/Constant";
import {openAddTodoCategory, openUpdateTodoCategory} from "@/pages/todo/components/TodoSide/AddTodoCategory";

const size = useWindowSize();

const selectKeys = ref([useTodoStore().categoryId]);
const keyword = ref('')

const todoCategoryTree = computed(() => useTodoCategoryStore().todoCategoryTree);
const virtualListProps = computed(() => ({
    height: size.height.value - 53
}));
const treeNodeData = computed(() => searchData(keyword.value, todoCategoryTree.value));

watch(() => selectKeys.value, value => {
    const categoryId = value[0];
    useTodoStore().setCategoryId(categoryId);
    let category = useTodoCategoryStore().todoCategoryMap.get(categoryId);
    if (category && category.type === TodoCategoryTypeEnum.TODO) {
        useTodoStore().setId(categoryId);
        if (useBaseSettingStore().autoCollapsedByTodo && size.width.value < Constant.autoCollapsedWidth) {
            useTodoStore().switchCollapsed();
        }
    } else {
        useTodoStore().setId(0);
    }
});

const hasFeature = (id: number) => useTodoCategoryStore().hasFeature(id);
const addFeature = (id: number) => useTodoCategoryStore().addFeature(id);
const removeFeature = (id: number) => useTodoCategoryStore().removeFeature(id);

function switchFeature(id: number) {
    if (hasFeature(id)) {
        removeFeature(id);
    } else {
        addFeature(id);
    }
}

function add(pid: number) {
    openAddTodoCategory(pid);
}


function update(id: number) {
    openUpdateTodoCategory(id);
}

function remove(id: number, title: string) {
    MessageBoxUtil.confirm("确认删除清单【" + title + '】吗，删除时会将清单下全部待办一并删除', "删除", {
        confirmButtonText: "删除",
        cancelButtonText: "取消"
    }).then(() => useTodoCategoryStore().remove(id)
        .then(() => MessageUtil.success("删除成功"))
        .catch(e => MessageUtil.error("删除失败", e)));

}

/**
 * 检测节点是否允许被释放
 * @param options 参数
 */
function checkAllowDrop(options: { dropNode: TreeNodeData; dropPosition: -1 | 0 | 1; }): boolean {
    return !options.dropNode.isLeaf
}

function onDrop(data: { dragNode: TreeNodeData, dropNode: TreeNodeData, dropPosition: number }) {
    if (typeof data.dragNode.key !== 'undefined' &&
        typeof data.dropNode.key !== 'undefined') {
        if (data.dropPosition === 0) {
            useTodoCategoryStore().drop(data.dragNode.key as number, data.dropNode.key as number)
                .then(() => MessageUtil.success("移动成功"))
                .catch(e => MessageUtil.error("移动失败", e));
        } else {
            const target = useTodoCategoryStore().todoCategoryMap.get(data.dropNode.key as number);
            if (!target) {
                return;
            }
            useTodoCategoryStore().drop(data.dragNode.key as number, target.pid)
                .then(() => MessageUtil.success("移动成功"))
                .catch(e => MessageUtil.error("移动失败", e));
        }
    }
}

</script>
<style scoped>
.todo-side {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 269px;
    border-right: 1px solid var(--color-neutral-3);
}
</style>
