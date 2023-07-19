<template>
    <div class="home">
        <div class="header">
            <a-tabs v-model:active-key="activeKey">
                <a-tab-pane :key="0" title="全部"/>
                <a-tab-pane v-for="category in categories" :title="category.name" :key="category.id"/>
                <template #extra>
                    <a-button-group type="primary">
                        <a-button @click="triggerSearch()" style="margin-right: 7px">
                            <template #icon>
                                <icon-search/>
                            </template>
                        </a-button>
                        <a-button @click="toEditor()">
                            <template #icon>
                                <icon-plus/>
                            </template>
                        </a-button>
                    </a-button-group>
                </template>
            </a-tabs>
        </div>
        <div class="container">
            <a-list :data="articles" :virtual-list-props="{height: height}">
                <template #item="{item}">
                    <a-list-item action-layout="vertical">
                        <a-list-item-meta :description="item.description">
                            <template #title>
                                <a-link @click="jumpTo(item.id)">{{ item.name }}</a-link>
                            </template>
                        </a-list-item-meta>
                        <template #actions>
                            <a-tag color="orange">
                                <template #icon>
                                    <icon-clock-circle/>
                                </template>
                                {{ toDateString(item.createTime) }}
                            </a-tag>
                            <a-tag v-for="tag in item.tags" style="margin-right: 7px;" :color="randomColor(tag)">
                                {{ tag }}
                            </a-tag>
                        </template>
                        <template #extra>
                            <span>{{ item.source }}</span>
                            <a-dropdown trigger="click">
                                <a-button type="text" style="margin-left: 14px;">
                                    <template #icon>
                                        <icon-more-vertical/>
                                    </template>
                                </a-button>
                                <template #content>
                                    <a-doption @click="editTo(item.id)">编辑</a-doption>
                                    <a-doption>删除</a-doption>
                                </template>
                            </a-dropdown>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useSearchEvent} from "@/global/BeanFactory";
import {randomColor} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";

const router = useRouter();

const activeKey = ref(0);
const categories = computed(() => useCategoryStore().categories);
const articles = computed(() => {
    if (activeKey.value === 0) {
        return useArticleStore().articles;
    } else {
        return useArticleStore().articles.filter(a => a.categoryId === activeKey.value);
    }
});
const height = computed(() => useGlobalStore().size.height - 54);

function toEditor() {
    router.push("/editor/0")
}

function triggerSearch() {
    useSearchEvent.emit();
}

function jumpTo(id: number) {
    router.push('/article/' + id);
}

function editTo(id: number) {
    router.push('/editor/' + id);
}


</script>
<style scoped lang="less">
.home {
    position: absolute;
    top: 0;
    left: 7px;
    right: 7px;
    bottom: 7px;

    .header {
        height: 47px;
        width: 100%;
    }

    .container {
        position: absolute;
        top: 47px;
        left: 0;
        right: 0;
        bottom: 0;
    }

}
</style>
