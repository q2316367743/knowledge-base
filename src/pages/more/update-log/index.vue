<template>
    <div class="more-update-log">
        <a-alert>
            <span>反馈建议前往</span>
            <a-link @click="toTxc()">兔小巢</a-link>
            <span>，支持图片反馈。</span>
            <template #action>
                <a-button type="text" @click="toUpdateLog()">
                    全部反馈
                </a-button>
            </template>
        </a-alert>
        <a-list :bordered="false">
            <a-list-item v-for="(log, name) in data.data" :key="name">
                <a-typography>
                    <component :is="renderContent(log, name)"/>
                    <a-typography-paragraph style="text-align: right;">
                        <a-space>
                            <a-button type="text" @click="jumpToInfo(log.id)">
                                <template #icon>
                                    <icon-thumb-up/>
                                </template>
                                <span>{{ log.like_count }}</span>
                            </a-button>
                            <a-button type="text" @click="jumpToInfo(log.id)">
                                <template #icon>
                                    <icon-message/>
                                </template>
                            </a-button>
                            <a-button type="text" @click="jumpToInfo(log.id)">
                                <template #icon>
                                    <icon-share-external/>
                                </template>
                            </a-button>
                        </a-space>
                    </a-typography-paragraph>
                    <a-list>
                        <a-list-item v-for="repl in log.replies">
                            <a-list-item-meta :description="repl.f_reply_text">
                                <template #avatar>
                                    <a-avatar :image-url="repl.avatar_url"/>
                                </template>
                                <template #title>
                                    <a-space>
                                        <span>{{ repl.nick_name }}</span>
                                        <a-tag color="arcoblue" v-if="repl.is_admin">管理员</a-tag>
                                    </a-space>
                                </template>
                            </a-list-item-meta>
                        </a-list-item>
                        <template #footer>
                            <a-link @click="jumpToInfo(log.id)">查看全部 {{ log.reply_count }} 条评论</a-link>
                        </template>
                    </a-list>
                </a-typography>
            </a-list-item>
        </a-list>
    </div>
    <a-back-top target-container=".more-update-log"/>
</template>
<script lang="ts" setup>
import Constant, {toTxc} from "@/global/Constant";
import {onMounted, ref} from "vue";
import axios from "axios";
import {TxcUpdateLog} from "@/pages/more/update-log/types";
import {jumpToInfo, renderContent, toUpdateLog} from "@/pages/more/update-log/func";

const data = ref<TxcUpdateLog>({
    status: 200,
    pagination: {
        "total": 98,
        "per_page": 20,
        "current_page": 1,
        "last_page": 5,
        "has_more_pages": true,
        "from": 1,
        "to": 20,
        "next_page_url": "\/?page=2",
        "prev_page_url": null,
        "next_page_id": "2023-01-04 15:29:02",
        "prev_page_id": "2024-03-05 10:05:37"
    },
    object: 'post',
    data: {}
});
onMounted(() => {
    axios.get<TxcUpdateLog>(`https://txc.qq.com/api/v2/${Constant.txcId}/posts/label/feat?_=${new Date().getTime()}`)
        .then(rsp => {
            data.value = rsp.data;
        })
});


</script>
<style scoped>
.more-update-log {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 7px;
    font-size: 16px;
}
</style>
