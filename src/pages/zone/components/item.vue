<template>
    <a-card class="item" hoverable>
        <a-result v-if="loading" title="正在加载中" status="info">
            <template #icon>
                <icon-refresh spin/>
            </template>
        </a-result>
        <div class="header">
            <div class="create-time">{{ createTime }}</div>
            <a-button-group type="text" size="mini" v-if="ellipsis">
                <a-button @click="openComment()">
                    <template #icon>
                        <icon-message/>
                    </template>
                </a-button>
                <a-dropdown position="br">
                    <a-button>
                        <template #icon>
                            <icon-more/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption @click="executeCopy()">
                            <template #icon>
                                <icon-copy/>
                            </template>
                            复制
                        </a-doption>
                        <a-doption @click="removeZone()">
                            <template #icon>
                                <icon-delete/>
                            </template>
                            删除
                        </a-doption>
                        <a-doption @click="toImage()">
                            <template #icon>
                                <icon-share-external/>
                            </template>
                            导出
                        </a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </div>
        <!-- 内容 -->
        <div class="content">
            <a-typography-paragraph :ellipsis="ellipsis" style="overflow-x: auto;margin-bottom: 0;">
                <div v-html="preview.html"></div>
            </a-typography-paragraph>
        </div>
        <!-- 标签 -->
        <div class="tags" v-if="base.tags.length > 0">
            <a-tag v-for="tag of base.tags" :key="tag" style="margin-right: 7px;" :color="randomColor(tag)">
                # {{ tag }}
            </a-tag>
        </div>
        <!-- 地址 -->
        <div class="location" v-if="base.location.trim() !== ''">
            <icon-location/>
            <span style="margin-left: 7px;">{{ base.location }}</span>
        </div>
        <!-- 评论 -->
        <div class="comment">
            <div class="comment-item" v-for="comment in comments">
                <div class="comment-content">{{ comment.content }}</div>
                <a-button-group type="text" class="action">
                    <a-popconfirm content="确认删除？" @ok="removeComment(comment.id)">
                        <a-button type="text" status="danger">
                            <template #icon>
                                <icon-delete/>
                            </template>
                        </a-button>
                    </a-popconfirm>
                    <a-tag color="orange">
                        <template #icon>
                            <icon-clock-circle/>
                        </template>
                        {{ toDate(comment.id) }}
                    </a-tag>
                </a-button-group>
            </div>
        </div>
        <!-- 新增评论 -->
        <a-modal v-model:visible="comment.dialog" title="新增评论" title-align="start" draggable ok-text="发布"
                 @ok="addComment()">
            <a-textarea v-model="comment.content" :auto-size="{ minRows: 2, maxRows: 8 }" show-word-limit
                        :max-length="100"
                        placeholder="评论不能超过100个字"/>
        </a-modal>
    </a-card>
</template>
<script lang="ts" setup>
import {nextTick, PropType, ref, toRaw} from "vue";
import {toDateString} from 'xe-utils'
import MessageUtil from "@/utils/MessageUtil";
import {download, randomColor} from "@/utils/BrowserUtil";
import {ZoneBase, ZoneComment, ZoneContent, ZoneIndex, ZonePreview} from "@/entity/zone";
import {useZoneStore} from "@/store/db/ZoneStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {statistics} from "@/global/BeanFactory";
import {useGlobalStore} from "@/store/GlobalStore";
import html2canvas from "html2canvas";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";

const props = defineProps({
    zone: Object as PropType<ZoneIndex>
});
const emits = defineEmits(['remove']);

const loading = ref(true);
const base = ref<ZoneBase>({
    tags: [],
    location: ''
});
const preview = ref<ZonePreview>({
    html: ''
});
const comments = ref<Array<ZoneComment>>([]);
let commentRev = undefined as string | undefined;
const comment = ref({
    dialog: false,
    content: ''
});
const createTime = ref('');
const ellipsis = ref<boolean | {
    rows: 3,
    expandable: true,
}>({
    rows: 3,
    expandable: true,
});

// =============================================================================
// ---------------------------------- 数据渲染 ----------------------------------
// =============================================================================

if (props.zone) {
    createTime.value = toDateString(props.zone.createTime, "yyyy-MM-dd HH:mm:ss");
    // 获取基础信息
    getFromOneByAsync<ZoneBase>(LocalNameEnum.ZONE_BASE + props.zone.id)
        .then(res => {
            if (res.record) {
                base.value = res.record;
            }
        });
    // 预览
    getFromOneByAsync<ZonePreview>(LocalNameEnum.ZONE_PREVIEW + props.zone.id)
        .then(res => {
            if (res.record) {
                preview.value = res.record;
            }
        })
        .finally(() => loading.value = false);
    // 评论
    getFromOneByAsync<Array<ZoneComment>>(LocalNameEnum.ZONE_COMMENT + props.zone.id)
        .then(res => {
            if (res.record) {
                comments.value = res.record;
            }
            commentRev = res.rev;
        });

}

// =========================================================================
// ---------------------------------- 功能 ----------------------------------
// =========================================================================

function toDate(date: Date | string | number) {
    return toDateString(date, 'yyyy年MM月dd日 HH:mm')
}

function executeCopy() {
    getFromOneByAsync<ZoneContent>(LocalNameEnum.ZONE_CONTENT + props.zone?.id)
        .then(res => {
            if (res.record) {
                const content = res.record;
                utools.copyText(content.body);
                MessageUtil.success("成功复制到剪切板");
            }
        })
}

function removeZone() {
    if (!props.zone) {
        MessageUtil.error("动态不存在，请刷新后重试")
        return;
    }
    useZoneStore().remove(props.zone.id)
        .then(() => {
            MessageUtil.success("删除完成");
            emits('remove');
        })
        .catch(e => {
            if (e !== 'cancel') {
                MessageUtil.error("删除失败", e);
            }
        });
}

// =========================================================================
// ---------------------------------- 评论 ----------------------------------
// =========================================================================

function openComment() {
    comment.value = {
        dialog: true,
        content: '',
    }
}

function addComment() {
    statistics.access("新增动态评论")
    const id = new Date().getTime();
    comments.value.push({
        id,
        content: comment.value.content
    });
    syncComment()
        .then(() => MessageUtil.success("新增成功"))
        .catch(e => {
            comments.value.pop();
            MessageUtil.error("新增失败", e);
        });
}

function removeComment(id: number) {
    const index = comments.value.findIndex(e => e.id === id);
    if (index === -1) {
        MessageUtil.warning("数据异常，无法删除此评论");
        return
    }
    comments.value.splice(index, 1);
    syncComment()
        .then(() => MessageUtil.success("删除成功"))
        .catch(e => {
            comments.value.pop();
            MessageUtil.error("删除失败", e);
        });
}

async function syncComment() {
    if (!props.zone) {
        MessageUtil.error("动态不存在，请刷新后重试")
        return;
    }
    commentRev = await saveOneByAsync(LocalNameEnum.ZONE_COMMENT + props.zone.id, toRaw(comments.value), commentRev);
}

// =========================================================================
// ---------------------------------- 导出 ----------------------------------
// =========================================================================

function toImage() {
    useGlobalStore().startLoading("开始导出");
    ellipsis.value = false;
    nextTick(() => {
        try {
            html2canvas(document.getElementById("zone-" + props.zone!.id!)!, {
                backgroundColor: useGlobalStore().isDark ? '#000000' : '#ffffff'
            }).then(res => {
                res.toBlob(blob => {
                    if (blob) {
                        download(blob, "导出.png", "image/png");
                    }
                })
            }).finally(() => {
                useGlobalStore().closeLoading();
                ellipsis.value = {
                    rows: 3,
                    expandable: true
                };
            });
        } catch (e) {
            console.error(e);
            useGlobalStore().closeLoading();
            ellipsis.value = {
                rows: 3,
                expandable: true
            };
        }
    })
}

</script>
<style scoped>

</style>
