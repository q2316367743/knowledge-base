<template>
    <div class="todo-side">
        <header style="margin: 7px;">
            <a-input-group>
                <a-input style="width: 218px;" disabled/>
                <a-button type="primary" @click="add(0)">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </a-input-group>
        </header>
        <a-tree v-model:selected-keys="selectKeys" :data="todoCategoryTree" block-node
                style="margin: 7px;width: calc(100% - 14px)" draggable :virtual-list-props="virtualListProps">
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
                        <a-doption @click="rename(nodeData.key, nodeData.title)">
                            <template #icon>
                                <icon-edit/>
                            </template>
                            修改
                        </a-doption>
                        <a-doption v-if="!nodeData.children || nodeData.children.length === 0"
                                   @click="remove(nodeData.key)" style="color: red;">
                            <template #icon>
                                <icon-delete/>
                            </template>
                            删除
                        </a-doption>
                    </template>

                </a-dropdown>
            </template>
        </a-tree>
        <a-modal v-model:visible="todoCategory.visible" title="新增待办分类" ok-text="新增" draggable
                 @ok="submit()">
            <a-form :model="todoCategory.record" layout="vertical">
                <a-form-item label="名称">
                    <a-input v-model="todoCategory.record.name" allow-clear/>
                </a-form-item>
                <a-form-item label="类型">
                    <a-radio-group v-model="todoCategory.record.type">
                        <a-radio :value="TodoCategoryTypeEnum.FOLDER">文件夹</a-radio>
                        <a-radio :value="TodoCategoryTypeEnum.TODO">清单</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import MessageUtil from "@/utils/MessageUtil";
import {TodoCategoryRecord, TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {useTodoStore} from "@/store/components/TodoStore";
import {useWindowSize} from "@vueuse/core";

const size = useWindowSize();

const todoCategory = ref({
    visible: false,
    record: {
        name: '',
        pid: 0,
        type: TodoCategoryTypeEnum.FOLDER
    } as TodoCategoryRecord
});
const selectKeys = ref([useTodoStore().categoryId]);

const todoCategoryTree = computed(() => useTodoCategoryStore().todoCategoryTree);
const virtualListProps = computed(() => ({
    height: size.height.value - 53
}));

watch(() => selectKeys.value, value => {
    const categoryId = value[0];
    useTodoStore().setCategoryId(categoryId);
    let category = useTodoCategoryStore().todoCategoryMap.get(categoryId);
    if (category && category.type === TodoCategoryTypeEnum.TODO) {
        useTodoStore().setId(categoryId);
        // 如果宽度小于1080，则自动隐藏
        if (size.width.value < 1080) {
            useTodoStore().switchCollapsed();
        }
    } else {
        useTodoStore().setId(0);
    }
});


function add(pid: number) {
    todoCategory.value = {
        visible: true,
        record: {
            name: '',
            pid,
            type: TodoCategoryTypeEnum.FOLDER
        }
    }
}

function submit() {
    // 新增
    useTodoCategoryStore().add(todoCategory.value.record)
        .then(() => MessageUtil.success("新增成功"))
        .catch(e => MessageUtil.error("新增失败", e));
}

function rename(id: number, name: string) {
    MessageBoxUtil.prompt("请输入新的名称", "重命名", {
        confirmButtonText: "修改",
        cancelButtonText: "取消",
        inputValue: name
    }).then(newName => useTodoCategoryStore().rename(id, newName)
        .then(() => MessageUtil.success("重命名成功"))
        .catch(e => MessageUtil.error("重命名失败", e)))
}

function remove(id: number) {
    useTodoCategoryStore().remove(id)
        .then(() => MessageUtil.success("删除成功"))
        .catch(e => MessageUtil.error("删除失败", e));

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
