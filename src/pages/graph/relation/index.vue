<template>
    <div>
        <div style="border: #efefef solid 1px; height: 100vh;width: 100%;">
            <relation-graph ref="relationGraph$" :options="options" :on-node-click="onNodeClick"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import RelationGraph, {JsonLine, JsonNode, RGJsonData, RGOptions} from 'relation-graph/vue3'
import {useArticleStore} from "@/store/db/ArticleStore";
import {ArticleIndex} from "@/entity/article";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useRouter} from "vue-router";
import MessageUtil from "@/utils/MessageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

const router = useRouter();

const relationGraph$ = ref<RelationGraph>()
const options = {
    defaultExpandHolderPosition: 'right',
    // defaultLineShape: 4,
    debug: false,
    allowSwitchLineShape: true,
    allowSwitchJunctionPoint: true,
    defaultJunctionPoint: 'border',
    showDebugPanel: false,
} as RGOptions;

const TAG = '#ff7d00';
const CATEGORY = '#f53f3f';
const ARTICLE = '#00b42a';
const LINE = '#43a2f1';

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
    nodes.push({id: category.id + '', text: category.name, color: CATEGORY});
    lines.push({from: "0", to: category.id + '', color: LINE});
}

// 文章
for (let article of articles) {
    nodes.push({id: article.id + '', text: article.name, color: ARTICLE});
    lines.push({from: article.categoryId ? (article.categoryId + '') : '1', to: article.id + '', color: LINE});
    if (notCategory && !article.categoryId) {
        nodes.push({id: '1', text: "未分类", color: CATEGORY});
        lines.push({from: "0", to: '1', color: LINE});
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
    nodes.push({id: index + '', text: tag, color: TAG});
    // 插入关联
    let articleList = tagArticleMap.get(tag);
    if (articleList) {
        for (let articleIndex of articleList) {
            lines.push({from: articleIndex.id + '', to: index + '', color: LINE});
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
});


function onNodeClick(nodeObject: any): boolean {
    if (nodeObject.color === ARTICLE) {
        useHomeEditorStore().setId(parseInt(nodeObject.id));
        router.push('/home');
    } else if (nodeObject.color === TAG) {
        router.push({
            path: '/home',
            query: {
                tag: nodeObject.text
            }
        });
    } else if (nodeObject.color === CATEGORY) {
        if (nodeObject.text === '未分类') {
            MessageUtil.warning("无法搜索未分类")
            return false;
        }
        router.push({
            path: '/home',
            query: {
                category: nodeObject.id
            }
        });
    }
    return true
}

</script>
