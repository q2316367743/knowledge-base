<template>
    <div class="article-search" v-if="visible">
        <a-input-search v-model="keyword" allow-clear size="mini" @search="search()" @keydown.enter="search()" @clear="stop()"/>
        <div style="text-align: right">
            <a-button-group type="text" size="mini">
                <a-button @click="pre()">
                    <template #icon>
                        <icon-arrow-up/>
                    </template>
                </a-button>
                <a-button @click="next()">
                    <template #icon>
                        <icon-arrow-down/>
                    </template>
                </a-button>
                <a-tooltip content="停止搜索">
                    <a-button @click="stop()">
                        <template #icon>
                            <icon-stop/>
                        </template>
                    </a-button>
                </a-tooltip>
                <a-tooltip content="关闭搜索">
                    <a-button status="danger" @click="closeSearch()">
                        <template #icon>
                            <icon-close/>
                        </template>
                    </a-button>
                </a-tooltip>
            </a-button-group>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {ref, watch} from "vue";

const keyword = ref('');
const visible = ref(false);

let subInput = false;
let interval = setInterval(() => {
    subInput = utools.setSubInput(action => {
        // @ts-ignore
        let text = action.text;
        if (text !== '') {
            visible.value = true;
        }
        keyword.value = text;
    }, '在文章内搜索', false);
    if (subInput) {
        clearInterval(interval);
    }
}, 100);

function search() {
    utools.findInPage(keyword.value, {
        forward: true
    });
}

function next() {
    utools.findInPage(keyword.value, {
        forward: true
    });
}

function pre() {
    utools.findInPage(keyword.value, {
        forward: false
    });
}

function stop() {
    utools.stopFindInPage('clearSelection');
}

function closeSearch() {
    keyword.value = '';
    visible.value = false;
    utools.setSubInputValue('');
    utools.stopFindInPage('clearSelection');
}

</script>
<style scoped lang="less">
.article-search {
    position: absolute;
    top: 50px;
    right: 30px;
    width: 200px;
    height: 48px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-neutral-3);
    background-color: var(--color-bg-1);
}
</style>
