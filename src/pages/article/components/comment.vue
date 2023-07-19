<template>
    <a-typography class="comment">
        <a-typography-title :heading="5" style="margin-left: 14px">全部评论 {{ articleComments.length }}
        </a-typography-title>
        <div class="add">
            <a-textarea v-model="comment" :auto-size="{minRows: 3, maxRows: 5}"
                        placeholder="请输入评论。" :disabled="lock"/>
            <div class="option">
                <a-button type="primary" @click="sendComment()" :disabled="lock">
                    发送
                </a-button>
            </div>
        </div>
        <a-divider/>
        <a-list :bordered="false">
            <a-list-item v-for="comment in articleComments">
                <a-list-item-meta :description="comment.content">
                    <template #title>
                        {{ toDate(comment.createTime) }}
                    </template>
                </a-list-item-meta>
                <template #actions>
                    <a-popconfirm content="确定删除此评论，删除后将无法恢复！" @ok="remove(comment.id)" ok-text="删除"
                                  :ok-button-props="{status: 'danger'}">
                        <a-button type="text" status="danger">
                            <template #icon>
                                <icon-delete/>
                            </template>
                        </a-button>
                    </a-popconfirm>
                </template>
            </a-list-item>
        </a-list>
    </a-typography>
</template>
<script lang="ts" setup>
import {onMounted, ref, toRaw} from "vue";
import {toDateString} from "xe-utils";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import ArticleComment from "@/entity/article/ArticleComment";
import MessageUtil from "@/utils/MessageUtil";

const props = defineProps({
    id: Number
});

const comment = ref('');
let articleComments = ref(new Array<ArticleComment>());
let articleCommentRev = undefined as string | undefined;
let lock = false

onMounted(() => init());

function toDate(date: any) {
    return toDateString(date, "")
}

function init() {
    utools.db.promises.get(LocalNameEnum.ARTICLE_COMMENT + props.id)
            .then(res => {
                if (res) {
                    articleComments.value = res.value;
                    articleCommentRev = res._rev;
                }
            });
}

async function _sync() {
    const res = await utools.db.promises.put({
        _id: LocalNameEnum.ARTICLE_COMMENT + props.id,
        _rev: articleCommentRev,
        value: toRaw(articleComments.value)
    });
    if (res.error) {
        return Promise.reject(res.message);
    }
    articleCommentRev = res.rev;
}

function sendComment() {
    if (lock) {
        MessageUtil.warning("评论发送中，不太太频繁哦！");
        return;
    }
    lock = true;
    addComment()
            .then(() => {
                MessageUtil.success("新增评论成功");
                comment.value = '';
            })
            .catch(e => MessageUtil.error("新增评论失败", e))
            .finally(() => lock = false);
}

async function addComment() {
    const now = new Date();
    const id = now.getTime();
    articleComments.value.push({
        id,
        createTime: now,
        updateTime: now,
        content: comment.value
    });
    await _sync();
}

function remove(id: number) {
    removeById(id)
            .then(() => MessageUtil.success("删除评论成功"))
            .catch(e => MessageUtil.error("删除评论失败", e))
}

async function removeById(id: number) {
    const index = articleComments.value.findIndex(e => e.id === id);
    if (index === -1) {
        return Promise.reject("评论不存在，请刷新后重试！");
    }
    articleComments.value.splice(index, 1);
    await _sync();
}

</script>
<style scoped>

</style>
