<template>
    <div class="setting-dict">
        <div class="header">
            <a-input allow-clear v-model="keyword" placeholder="请输入分类名称" style="width: 320px"/>
            <a-button type="primary" @click="add()">新增</a-button>
        </div>
        <div class="container">
            <a-list :virtual-list-props="{height: height - 47}" :data="results">
                <template #item="{ item, index }">
                    <a-list-item>
                        <a-list-item-meta :title="item.item.name" :description="item.item.description"/>
                        <template #actions>
                            <a-button-group type="text">
                                <a-tooltip content="修改字典">
                                    <a-button @click="update(item.item.id)">
                                        <template #icon>
                                            <icon-edit/>
                                        </template>
                                    </a-button>
                                </a-tooltip>
                                <a-popconfirm content="是否删除此字典，删除后无法恢复！"
                                              @ok="remove(item.item.id)"
                                              ok-text="删除">
                                    <a-button status="danger">
                                        <template #icon>
                                            <icon-delete/>
                                        </template>
                                    </a-button>
                                </a-popconfirm>
                            </a-button-group>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useFuse} from "@vueuse/integrations/useFuse";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {statistics} from "@/global/BeanFactory";


const keyword = ref('');
const categories = computed(() => useCategoryStore().categories);
const height = computed(() => useGlobalStore().size.height)


const {results} = useFuse(keyword, categories, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: "name",
            weight: 1
        }]
    }
});

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
