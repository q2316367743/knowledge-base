<template>
    <div class="more-attachment">
        <div class="side" ref="side">
            <div v-for="attachment in attachments" :key="attachment" class="item"
                 :style="{backgroundImage: `url('${render(attachment)}')`}" :data-id="attachment"/>
        </div>
        <div class="buttons">
            <a-button type="primary" @click="pre()">上一张</a-button>
            <a-button type="primary" style="margin: 0 7px">下载图片</a-button>
            <a-button type="primary" status="danger" style="margin: 0 7px 0 0;">删除图片</a-button>
            <a-button type="primary" @click="next()">下一张</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {onUnmounted, ref} from "vue";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const attachments = ref(new Array<string>());
let resources = new Array<string>();

function fetchAttachment() {
    attachments.value = [];
    utools.db.promises.allDocs(LocalNameEnum.ARTICLE_ATTACHMENT)
            .then(items => {
                items.forEach(item => attachments.value.push(item._id))
            })
}

fetchAttachment();

function render(id: string): string {
    const buffer = utools.db.getAttachment(id);
    if (!buffer) {
        return "";
    }
    return window.URL.createObjectURL(new Blob([buffer]));
}

function revokeAll() {
    resources.forEach(url => window.URL.revokeObjectURL(url));
    resources = [];
}

onUnmounted(() => revokeAll());

// 动画处理
const side = ref<HTMLDivElement | null>(null);
let openClick = true;

function next() {
    if (openClick) {
        openClick = false;
        const items = document.querySelectorAll(".more-attachment .item");
        if (side.value && items.length > 0) {
            side.value.append(items[0]);
            setTimeout(() => openClick = true, 1000);
        } else {
            openClick = true
        }
    }
}

function pre() {
    if (openClick) {
        openClick = false;
        const items = document.querySelectorAll(".more-attachment .item");
        if (side.value && items.length > 0) {
            side.value.prepend(items[items.length - 1]);
            setTimeout(() => openClick = true, 1000);
        } else {
            openClick = true
        }

    }
}

</script>
<style scoped lang="less">
.more-attachment {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(200deg, pink, #918ef9);
    overflow: hidden;

    .item {
        width: 240px;
        height: 160px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        border-radius: 2px;
        background-size: cover;
        background-color: pink;
        background-position: center;
        transition: 1s;
        box-shadow: 0 30px 50px #505050;

        &:nth-child(1) {
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            transform: translateY(0);
            box-shadow: none;
            border-radius: 0;
        }

        &:nth-child(2) {
            left: 70%;
        }

        &:nth-child(3) {
            left: calc(70% + 250px);
        }

        &:nth-child(4) {
            left: calc(70% + 500px);
        }

        &:nth-child(n+5) {
            left: calc(70% + 750px);
            opacity: 0;
        }
    }

    .buttons {
        width: 100%;
        position: absolute;
        bottom: 50px;
        text-align: center;
        display: flex;
        justify-content: center;
    }
}
</style>
