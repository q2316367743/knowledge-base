<template>
    <div class="more-attachment">
        <div class="side" ref="side">
            <div v-for="attachment in attachments" :key="attachment" class="item"
                 :style="{backgroundImage: `url('${renderAttachmentUrl(attachment)}')`}" :data-id="attachment"/>
        </div>
        <div class="buttons">
            <a-button :disabled="attachments.length === 0" type="primary" @click="pre()">上一张</a-button>
            <a-button :disabled="attachments.length === 0" type="primary" @click="copy()" style="margin: 0 7px ;">
                复制链接
            </a-button>
            <a-button :disabled="attachments.length === 0" type="primary" @click="remove()" status="danger"
                      style="margin: 0 7px 0 0;">删除图片
            </a-button>
            <a-button :disabled="attachments.length === 0" type="primary" @click="next()">下一张</a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {listRecordByAsync, removeOneByAsync} from "@/utils/utools/DbStorageUtil";
import {renderAttachmentUrl} from "@/plugin/server";

const attachments = ref(new Array<string>());

function fetchAttachment() {
    attachments.value = [];
    listRecordByAsync<any>(LocalNameEnum.ARTICLE_ATTACHMENT)
        .then(items => {
            items.forEach(item => attachments.value.push(item.id))
        })
}

fetchAttachment();

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

function copy() {
    const item = document.querySelector(".more-attachment .item:nth-child(1)")!;
    let id = item?.attributes.getNamedItem('data-id')?.value;
    utools.copyText(`![](${id})`);
    MessageUtil.success("成功复制到剪切板");
}

function remove() {
    MessageBoxUtil.confirm("删除此附件后，使用的文章将无法展示附件", "删除确认", {
        confirmButtonText: "删除",
        cancelButtonText: "取消"
    }).then(() => {
        const item = document.querySelector(".more-attachment .item:nth-child(1)")!;
        removeOneByAsync(item?.attributes.getNamedItem('data-id')?.value!)
            .then(() => {
                if (side.value) {
                    side.value.removeChild(item);
                    MessageUtil.success("删除成功");
                }
            }).catch(e => MessageUtil.error("删除失败", e));
    })
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
