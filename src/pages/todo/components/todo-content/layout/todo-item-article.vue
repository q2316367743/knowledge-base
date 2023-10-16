<template>
    <a-modal v-model:visible="visible" ok-text="保存" class="todo-item-article" width="60vw"
             title-align="start" :mask-closable="false" :unmount-on-close="false" @ok="submit()">
        <template #title>
            <a-input-search v-model="keyword" allow-clear style="width: 40vw"
                            placeholder="请输入文章名称，点击新增进行文章关联。"/>
        </template>
        <a-checkbox-group v-model="selectKeys">
            <a-typography>
                <a-typography-paragraph v-for="item in results">
                    <a-checkbox :key="item.item.id" :value="item.item.id">
                        {{ item.item.name }}
                    </a-checkbox>
                </a-typography-paragraph>
            </a-typography>
        </a-checkbox-group>
    </a-modal>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useTodoAddArticleEvent} from "@/global/BeanFactory";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFuse} from "@vueuse/integrations/useFuse";
import {ArticleIndex} from "@/entity/article";
import {useTodoStore} from "@/store/components/TodoStore";

const visible = ref(false);
const keyword = ref('');
const selectKeys = ref(new Array<number>());

const articles = computed(() => useArticleStore().articles);

const {results} = useFuse<ArticleIndex>(keyword, articles, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }]
    }
})
useTodoAddArticleEvent.reset();
useTodoAddArticleEvent.on(() => {
    visible.value = true;
    keyword.value = '';
    selectKeys.value = useTodoStore().todoArticles;
});

function submit() {
    useTodoStore().associationArticle(selectKeys.value);
}

</script>
<style lang="less">
.todo-item-article {
    .arco-modal-body {
        height: 50vh;
    }
}
</style>
