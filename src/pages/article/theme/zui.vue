<template>
    <article class="info zui" id="article-zui">
        <header>
            <h1>{{ article.name }}</h1>
            <div class="base">
                <div>
                    <span v-if="article.source.trim() !== ''" style="font-weight: bold;">来源：</span>
                    <span v-if="article.source.trim() !== ''" style="font-weight: bold;">{{article.source}}</span>
                    <span style="font-weight: bold;margin-left: 7px;">最后修订：</span>
                    <span>{{renderDate(article.updateTime)}}</span>
                </div>
                <div class="pull-right">
                    <a-tag v-for="tag in article.tags" style="margin-right: 7px;" :color="randomColor()">{{
                            tag
                        }}
                    </a-tag>
                </div>
            </div>
            <div class="desc" v-if="article.description.trim() !== ''">
                摘要：{{ article.description }}
            </div>
        </header>
        <section class="content" v-html="preview"></section>
    </article>
</template>
<script lang="ts" setup>
import {nextTick, PropType, ref, watch} from "vue";
import {ArticleIndex} from "@/entity/article";
import {randomColor} from "@/utils/BrowserUtil";
import {onAfterRender} from "@/pages/article/func";
import {toDateString} from "xe-utils";

const props = defineProps({
    article: {
        type: Object as PropType<ArticleIndex>,
        required: true
    },
    preview: String
});
const article = ref<ArticleIndex>({
    id: 0,
    name: '',
    description: '',
    categoryId: null,
    tags: [],
    createTime: '',
    updateTime: '',
    source: ''
});
Object.assign(article.value, props.article);
watch(() => props.article, () => Object.assign(article.value, props.article));
watch(() => props.preview, preview => {
    if (preview) {
        nextTick(() => onAfterRender());
    }
});

function renderDate(date: string | Date) {
    return toDateString(date, 'yyyy年MM月dd日 HH:mm:ss')
}
</script>
<style lang="less">
.zui {
    padding: 14px;

    header {
        h1 {
            margin-bottom: 20px;
            line-height: 1.5;
            text-align: center;
            font-size: 26px;
            margin-top: 20px;
        }
    }

    .base {
        margin: 0;
        border-bottom: 1px solid var(--color-neutral-4);
        padding: 10px 15px;
        font-size: 12px;
        color: var(--color-text-2);
        background-color: var(--color-neutral-3);
        display: flex;
        justify-content: space-between;
        height: 24px;
        line-height: 24px;

        dl {
            display: flex;

            dt {
                font-weight: 700;
            }
        }
    }

    .desc {
        background-color: var(--color-neutral-3);
        padding: 10px 15px;
        font-size: 12px;
        color: var(--color-text-1);
    }

    a {
        color: #145ccd;
        text-decoration: none;
        cursor: pointer;
        -webkit-transition: .4s cubic-bezier(.175, .885, .32, 1);
        -o-transition: .4s cubic-bezier(.175, .885, .32, 1);
        transition: .4s cubic-bezier(.175, .885, .32, 1);
        -webkit-transition-property: color, background, opacity, -webkit-transform;
        -o-transition-property: color, background, opacity, -o-transform;
        transition-property: color, background, transform, opacity, -webkit-transform, -o-transform;
    }

    code {
        padding: 2px 4px;
        font-size: 90%;
        color: var(--color-text-1);
        background-color: var(--color-neutral-3);
        border-radius: 4px;
    }

    pre {
        margin-block-start: 12px;
        margin-block-end: 12px;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding-block-start: 12px;
        padding-block-end: 12px;
        padding-inline-start: 16px;
        padding-inline-end: 16px;
        overflow: auto;
        font-family: JetBrainsMono, "SFMono-Regular", consolas, "Liberation Mono", menlo, courier, monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        white-space: pre;
        word-wrap: normal;
        border-radius: 4px;
        background-color: var(--color-neutral-2);

        code {
            padding: 2px 4px;
            font-size: 90%;
            color: var(--color-text-1);
            background-color: var(--color-neutral-2);
            border-radius: 4px;
        }
    }
}

.zui {
    padding: 20px;
}

.zui > header h1,
.zui > header h2,
.zui > header h3 {
    margin-bottom: 20px;
    line-height: 1.5;
}

.zui > header > .abstract,
.zui > header > dl {
    padding: 10px 15px;
    font-size: 12px;
    color: #686868;
    background-color: #f1f1f1;
}

.zui > header > .abstract > p:last-child,
.zui > header > dl > p:last-child {
    margin-bottom: 0;
}

.zui > header > dl {
    margin: 0;
    border-bottom: 1px solid #e9e9e9;
}

.zui > header > dl.pull-right {
    background-color: transparent;
    border: none;
}

.zui > footer {
    border-top: 1px dashed #d7d7d7;
}

.zui > footer > p {
    padding: 10px 15px;
}

.zui > .content,
.zui-content {
    padding: 20px 0;
    font-size: 14px;
    line-height: 1.78571429;
}

.zui > .content h1,
.zui-content h1 {
    font-size: 20px;
}

.zui > .content h2,
.zui-content h2 {
    font-size: 18px;
}

.zui > .content h3,
.zui-content h3 {
    font-size: 16px;
}

.zui > .content h4,
.zui-content h4 {
    margin-top: 15px;
    font-size: 14px;
}

.zui > .content h5,
.zui-content h5 {
    margin-top: 15px;
    font-size: 13px;
}

.zui > .content h6,
.zui-content h6 {
    margin-top: 15px;
    font-size: 11px;
}

.zui > .content img,
.zui-content img {
    margin: 10px 0;
}

.zui > .content p > img + img,
.zui-content p > img + img {
    margin-left: 10px;
}

.zui > .content p > img[align='right'],
.zui-content p > img[align='right'] {
    margin-left: 10px;
}

.zui > .content dl,
.zui-content dl {
    padding-right: 2em;
    padding-left: 2em;
}

.zui > .content table,
.zui-content table {
    margin-bottom: 20px;
}

.zui > .content table th,
.zui-content table th,
.zui > .content table td,
.zui-content table td {
    padding: 8px;
    line-height: 1.53846154;
    vertical-align: top;
    border-bottom: 1px solid #ddd;
}

.zui > .content table > thead > tr > th,
.zui-content table > thead > tr > th {
    vertical-align: bottom;
    background-color: #f1f1f1;
}

.zui-content p {
    margin-bottom: 0;
}

.zui > .content table th,
.zui > .content table td,
.zui > .content table > thead > tr > th {
    border: 1px solid #ddd;
}

body.zui-content {
    padding: 8px;
}

.zui-condensed {
    padding: 20px 0;
}

.zui-condensed > header {
    padding: 0 20px;
}

.zui-condensed > header > .abstract,
.zui-condensed > header > dl {
    padding: 10px 15px;
    margin: 0 -20px;
}

.zui-condensed > .content,
.zui-condensed > .zui-content {
    padding: 20px;
}

.zui-condensed > .content > img,
.zui-condensed > .zui-content > img,
.zui-condensed > .content > pre,
.zui-condensed > .zui-content > pre {
    margin-right: -20px;
    margin-left: -20px;
    border-radius: 0;
}

.zui-condensed > .content > pre,
.zui-condensed > .zui-content > pre {
    border-right: none;
    border-left: none;
}

.zui-condensed > footer {
    border-top: 1px dashed #d7d7d7;
}

.zui-condensed > footer > p {
    padding: 10px 15px;
}

.zui-condensed > footer > .pager-justify > .previous > a {
    border-left: none;
    border-radius: 0;
}

.zui-condensed > footer > .pager-justify > .next > a {
    border-right: none;
    border-radius: 0;
}

.zui {
    blockquote {
        padding: 10px 20px;
        margin: 0 0 20px;
        font-size: 16.25px;
        border-left: 5px solid #e5e5e5;
    }

    a {
        color: #145ccd;
        text-decoration: none;
        cursor: pointer;
        -webkit-transition: .4s cubic-bezier(.175, .885, .32, 1);
        -o-transition: .4s cubic-bezier(.175, .885, .32, 1);
        transition: .4s cubic-bezier(.175, .885, .32, 1);
        -webkit-transition-property: color, background, opacity, -webkit-transform;
        -o-transition-property: color, background, opacity, -o-transform;
        transition-property: color, background, transform, opacity, -webkit-transform, -o-transform;
    }
}

</style>
