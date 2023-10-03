<template>
    <a-layout class="home">
        <a-layout-header class="header">
            <a-breadcrumb>
                <a-breadcrumb-item>
                    <a-link @click="clearFilter()">
                        <icon-home/>
                    </a-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item v-for="breadcrumb in breadcrumbs"> {{ breadcrumb }}</a-breadcrumb-item>
            </a-breadcrumb>
            <a-button-group type="text">
                <a-button @click="triggerSearch()" style="margin-right: 7px">
                    <template #icon>
                        <icon-search/>
                    </template>
                </a-button>
                <a-button @click="toEditor()" style="margin-right: 7px">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
                <a-button @click="collapsed = !collapsed">
                    <template #icon>
                        <icon-layout/>
                    </template>
                </a-button>
            </a-button-group>
        </a-layout-header>
        <a-layout class="container">
            <a-layout-content style="padding-right: 6px">
                <a-list :max-height="maxHeight" v-if="render" :bordered="false"
                        :split="false">
                    <home-item v-for="article in articles" :article="article" :key="article.id" @remove="remove()"
                               @use-tag="useTag"/>
                </a-list>
            </a-layout-content>
            <a-layout-sider :width="200" :collapsed-width="0" v-model:collapsed="collapsed">
                <a-divider>分类</a-divider>
                <a-link v-for="category in categories" @click="useCategory(category.id, category.name)"
                        :key="category.id" style="margin-bottom: 4px;">
                    {{ category.name }}
                </a-link>
                <a-divider>标签</a-divider>
                <a-tag v-for="tag in articleTags" @click="useTag(tag)" :color="randomColor(tag)" :key="tag"
                       style="margin-left: 4px;margin-bottom: 4px;cursor:pointer;">{{ tag }}
                </a-tag>
            </a-layout-sider>
        </a-layout>
        <sub-input/>
    </a-layout>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {computed, nextTick, ref} from "vue";
// 存储
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useGlobalStore} from "@/store/GlobalStore";
// 其他
import {useSearchEvent} from "@/global/BeanFactory";
import {ArticleIndex} from "@/entity/article";
import {randomColor} from "@/utils/BrowserUtil";
// 组件
import HomeItem from './item.vue';
import SubInput from '@/components/SubInput/index.vue';

const route = useRoute();
const router = useRouter();

const render = ref(true);
const activeKey = ref(0);
const articles = ref<Array<ArticleIndex>>(new Array<ArticleIndex>());
const collapsed = ref(true);
const breadcrumbs = ref<Array<string>>([]);
const categories = computed(() => useCategoryStore().categories);
const articleTags = computed(() => useArticleStore().articleTags);
const maxHeight = computed(() => useGlobalStore().size.height - 47);

if (route.query.categroy) {
    console.log(route.query.categroy)
    for (let valueElement of categories.value) {
        if ((valueElement.id + '') === route.query.categroy) {
            useCategory(valueElement.id, valueElement.name);
            break;
        }
    }
} else if (route.query.tag) {
    useTag(route.query.tag as string);
} else {
    filter();
}

function toEditor() {
    router.push("/editor/0")
}

function triggerSearch() {
    useSearchEvent.emit();
}

function remove() {
    render.value = false;
    nextTick(() => render.value = true);
}

// 筛选
function clearFilter() {
    breadcrumbs.value = [];
    collapsed.value = true
    filter();
}

function useCategory(id: number, name: string) {
    breadcrumbs.value = ['分类', name];
    filter(true, id + '')
}

function useTag(tag: string) {
    breadcrumbs.value = ['标签', tag];
    filter(false, tag);
}


function filter(isCategory: boolean | null = null, keyword: string = '') {
    const items = useArticleStore().articles;
    if (isCategory !== null) {
        if (isCategory) {
            articles.value = items.filter(e => (e.categoryId + '') === keyword);
        } else {
            articles.value = items.filter(e => {
                for (let tag of e.tags) {
                    if (tag == keyword) {
                        return true;
                    }
                }
                return false;
            })
        }
    } else {
        articles.value = items;
    }
}


</script>
<style scoped lang="less">
.home {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .header {
        display: flex;
        justify-content: space-between;
        padding: 4px 7px;
    }

    .container {
        position: absolute;
        top: 40px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        width: auto;
    }

}
</style>
