<template>
    <div>
        <div style="border: #efefef solid 1px; height: 100vh;width: 100%;">
            <relation-graph ref="relationGraph$" :options="options">
            </relation-graph>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import RelationGraph, {RGOptions, RGJsonData, JsonNode, JsonLine} from 'relation-graph/vue3'
import {useArticleStore} from "@/store/db/ArticleStore";
import {ArticleIndex} from "@/entity/article";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useGlobalStore} from "@/store/GlobalStore";

const relationGraph$ = ref<RelationGraph>()
const options = {
    defaultExpandHolderPosition: 'right',
    // defaultLineShape: 4,
    debug: false,
    allowSwitchLineShape: true,
    allowSwitchJunctionPoint: true,
    defaultJunctionPoint: 'border',
    showDebugPanel: false,
} as RGOptions

// 文章
// 标签
const articles = useArticleStore().articles;
const tags = useArticleStore().articleTags;
const categories = useCategoryStore().categories;
const nodes = new Array<JsonNode>();
const lines = new Array<JsonLine>();
let notCategory = true;
// 标签Map，标签=>id;
const tagArticleMap = new Map<string, Array<ArticleIndex>>();
nodes.push({id: '0', text: '知识库', color: '#165dff'});

// 分类
for (let category of categories) {
    nodes.push({id: category.id + '', text: category.name, color: '#f53f3f'});
    lines.push({from: "0", to: category.id + '', color: '#43a2f1'});
}

// 文章
for (let article of articles) {
    nodes.push({id: article.id + '', text: article.name, color: '#00b42a'});
    lines.push({from: article.categoryId ? (article.categoryId + '') : '1', to: article.id + '', color: '#43a2f1'});
    if (notCategory && !article.categoryId) {
        nodes.push({id: '1', text: "未分类", color: '#f53f3f'});
        lines.push({from: "0", to: '1', color: '#43a2f1'});
        notCategory = false
    }
    for (let tag of article.tags) {
        let temp = tagArticleMap.get(tag);
        if (!temp) {
            temp = new Array<ArticleIndex>();
        }
        temp.push(article)
        tagArticleMap.set(tag, temp);
    }
}
// 标签
let index = 2;
for (let tag of tags) {
    index += 1;
    nodes.push({id: index + '', text: tag, color: '#ff7d00'});
    // 插入关联
    let articleList = tagArticleMap.get(tag);
    if (articleList) {
        for (let articleIndex of articleList) {
            lines.push({from: articleIndex.id + '', to: index + '', color: '#43a2f1'});
        }
    }
}


onMounted(() => {
    const graphJsonData: RGJsonData = {
        rootId: '0',
        nodes,
        lines,
    };
    if (relationGraph$.value) {
        relationGraph$.value.setJsonData(graphJsonData, () => {
            console.log('relationGraph ready!');
        })
    }
})
</script>
