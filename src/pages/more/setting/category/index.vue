<template>
    <div class="setting-dict">
        <div class="header">
            <a-input allow-clear v-model="keyword" placeholder="请输入分类名称" style="width: 320px"/>
            <a-button type="primary" @click="add()">新增</a-button>
        </div>
        <div class="container">
            <a-table :data="items" :virtual-list-props="{height: height - 87}" :pagination="false" scrollbar
                     :draggable="draggable" @change="handleDraggable">
                <template #columns>
                    <a-table-column title="分类名称" data-index="name"/>
                    <a-table-column title="创建时间" :width="190">
                        <template #cell="{record }">
                            {{ renderDate(record.createTime) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="最后更新时间" :width="190">
                        <template #cell="{record }">
                            {{ renderDate(record.updateTime) }}
                        </template>
                    </a-table-column>
                    <a-table-column title="操作" :width="64">
                        <template #cell="{record}">
                            <a-button-group type="text">
                                <a-tooltip content="修改字典">
                                    <a-button @click="update(record.id)">
                                        <template #icon>
                                            <icon-edit/>
                                        </template>
                                    </a-button>
                                </a-tooltip>
                                <a-popconfirm content="是否删除此字典，删除后无法恢复！"
                                              @ok="remove(record.id)"
                                              ok-text="删除">
                                    <a-button status="danger">
                                        <template #icon>
                                            <icon-delete/>
                                        </template>
                                    </a-button>
                                </a-popconfirm>
                            </a-button-group>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {useFuse} from "@vueuse/integrations/useFuse";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {statistics} from "@/global/BeanFactory";
import {toDateString} from "xe-utils";
import {TableDraggable} from "@arco-design/web-vue";


const keyword = ref('');
const categories = computed(() => useCategoryStore().categories);
const height = computed(() => useGlobalStore().size.height);
const draggable = reactive<TableDraggable>({type: 'handle', width: 40});


const {results} = useFuse(keyword, categories, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: "name",
            weight: 1
        }]
    }
});
const items = computed(() => results.value.map(e => e.item));

function renderDate(date: Date | string) {
    return toDateString(date);
}

function add() {
    statistics.access("新增分类");
    useCategoryStore().add()
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
            .then(() => MessageUtil.success("更新成功"))
            .catch(e => MessageUtil.error("更新失败", e));
}

function handleDraggable(categories: any) {
    useCategoryStore().save(categories)
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
