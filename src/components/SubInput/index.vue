<template>
    <a-modal v-model:visible="visible" :footer="false" title-align="start" :width="500">
        <template #title>
            <a-input-search v-model="keyword" style="width: 300px" allow-clear/>
        </template>
        <a-list :virtual-list-props="{height: height}" :data="results">
            <template #item="{item}">
                <a-list-item>
                    <a-list-item-meta :description="item.item.description">
                        <template #title>
                            <a-link @click="jumpTo(item.item.id)">{{ item.item.name }}</a-link>
                        </template>
                    </a-list-item-meta>
                    <template #actions>
                        <a-tag v-for="tag in item.item.tags" style="margin-right: 7px;" :color="randomColor(tag)">
                            {{ tag }}
                        </a-tag>
                    </template>
                </a-list-item>
            </template>
        </a-list>
    </a-modal>
</template>
<script lang="ts" setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFuse} from "@vueuse/integrations/useFuse";
import {useRouter} from "vue-router";
import {useSearchEvent} from "@/global/BeanFactory";
import {useGlobalStore} from "@/store/GlobalStore";
import {randomColor} from "@/utils/BrowserUtil";

const router = useRouter();

const visible = ref(false);
const keyword = ref('');
const articles = computed(() => useArticleStore().articles);
const height = computed(() => useGlobalStore().height / 2);

const {results} = useFuse(keyword, articles, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }, {
            name: 'tags'
        }, {
            name: 'description'
        }, {
            name: 'source'
        }]
    }
});

// 子输入框
let subInput = false;
let interval = setInterval(() => {
    subInput = utools.setSubInput(action => {
        // @ts-ignore
        let text = action.text;
        if (text !== '') {
            visible.value = true;
        }
        keyword.value = text;
    }, '请输入名称|标签|来源|描述', false);
    if (subInput) {
        clearInterval(interval);
    }
}, 100);

watch(() => keyword.value, newValue => {
    utools.setSubInputValue(newValue);
});
watch(() => visible.value, newValue => {
    if (!newValue) {
        utools.setSubInputValue("");
    }
});

// 离开时移除子输入框
onUnmounted(() => utools.removeSubInput());

useSearchEvent.on(() => visible.value = true);

function jumpTo(id: number) {
    visible.value = false;
    router.push('/article/' + id);
}

</script>
<style scoped>

</style>
