<template>
    <header v-if="articleHeaderVisible">
        <blockquote>
            <ul>
                <li v-if="article.source.trim() !== ''"><b>来源：</b>{{ article.source }}</li>
                <li><b>创建时间：</b>{{ toDate(article.createTime) }}</li>
                <li><b>更新时间：</b>{{ toDate(article.updateTime) }}</li>
                <li v-if="article.tags.length > 0"><b>标签：</b>
                    <a-tag v-for="tag in article.tags" :color="randomColor()"
                           style="margin-right: 7px;">{{
                            tag
                        }}
                    </a-tag>
                </li>
                <li v-if="article.description.trim() !== ''"><b>摘要：</b>{{ article.description }}
                </li>
            </ul>
        </blockquote>
    </header>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {randomColor} from "@/utils/BrowserUtil";
import {mapState} from "pinia";
import {useSettingStore} from "@/store/db/SettingStore";
import {toDateString} from "xe-utils";

export default defineComponent({
    name: 'article-info',
    props: {
        value: Object
    },
    data: () => ({
        article: {
            id: 0,
            name: '',
            description: '',
            categoryId: null,
            tags: [],
            createTime: '',
            updateTime: '',
            source: ''
        }
    }),
    computed: {
        ...mapState(useSettingStore, ['articleHeaderVisible'])
    },
    created() {
        this.article = Object.assign(this.article, this.value);
    },
    methods: {
        randomColor,
        toDate(date: Date | string): string {
            if (date === '') {
                return '';
            }
            return toDateString(date, "yyyy年MM月dd日 HH:mm:ss")
        }
    }
});
</script>
<style scoped>

</style>
