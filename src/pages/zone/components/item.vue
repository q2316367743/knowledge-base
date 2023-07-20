<template>
    <a-card class="item" hoverable>
        <template #title>
            <span style="color: var(--color-neutral-6);">
                {{ toDateString(props.zone.createTime) }}
            </span>
        </template>
        <!-- 内容 -->
        <div class="content">
            <a-typography-paragraph :ellipsis="{
                            rows: 3,
                            expandable: true,
                        }" style="overflow-x: auto;margin-bottom: 0;">
                <div v-html="preview.html"></div>
            </a-typography-paragraph>
        </div>
        <!-- 图片 -->
        <div class="image" v-if="base.image.length > 0">
            <a-row :gutter="7">
                <a-col v-for="image in base.image" :span="8">
                    <a-image :alt="image.name" height="150px" width="150px"
                             @vue:mounted="renderImage($event, image.id)" fit="cover" show-loader
                             :preview="false" @click="showImagePreview(image.id, image.name)"
                             style="cursor: pointer;"/>
                </a-col>
            </a-row>
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
                    <a-popconfirm content="确认删除？">
                        <a-button type="text" status="danger">
                            <template #icon>
                                <icon-delete />
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
        <template #extra>
            <a-button-group type="text">
                <a-button @click="openComment()">
                    <template #icon>
                        <icon-message :size="16"/>
                    </template>
                </a-button>
                <a-dropdown position="br">
                    <a-button>
                        <template #icon>
                            <icon-more-vertical/>
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
                    </template>
                </a-dropdown>
            </a-button-group>
        </template>
        <!-- 新增评论 -->
        <a-modal v-model:visible="comment.dialog" title="新增评论" title-align="start" draggable ok-text="发布"
                 @ok="addComment()">
            <a-textarea v-model="comment.content" :auto-size="{ minRows: 2, maxRows: 8 }" show-word-limit
                        :max-length="100"
                        placeholder="评论不能超过100个字"/>
        </a-modal>
        <!-- 图片预览组件 -->
        <a-image-preview :src="imagePreview.value" v-model:visible="imagePreview.dialog" @close="releaseImagePreview">
            <template #actions>
                <a-image-preview-action name="下载" @click="downloadImage">
                    <icon-download/>
                </a-image-preview-action>
            </template>
        </a-image-preview>
    </a-card>
</template>
<script lang="ts" setup>
import {PropType, ref, toRaw} from "vue";
import {toDateString} from 'xe-utils'
import MessageUtil from "@/utils/MessageUtil";
import {renderImage} from "@/pages/zone/render";
import {download, randomColor} from "@/utils/BrowserUtil";
import {ZoneBase, ZoneComment, ZoneContent, ZoneIndex, ZonePreview} from "@/entity/zone";
import {useZoneStore} from "@/store/db/ZoneStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const props = defineProps({
    zone: Object as PropType<ZoneIndex>
});
const emits = defineEmits(['remove']);

const base = ref<ZoneBase>({
    image: [],
    attachments: [],
    tags: [],
    location: ''
});
const preview = ref<ZonePreview>({
    html: ''
});
const comments = ref<Array<ZoneComment>>([]);
let commentRev = undefined as string | undefined;
const imagePreview = ref({
    id: '',
    name: '',
    dialog: false,
    value: ''
})
const comment = ref({
    dialog: false,
    content: ''
});

// =============================================================================
// ---------------------------------- 数据渲染 ----------------------------------
// =============================================================================

if (props.zone) {
// 获取基础信息
    utools.db.promises.get(LocalNameEnum.ZONE_BASE + props.zone.id)
            .then(res => {
                if (res) {
                    base.value = res.value;
                }
            });
    // 预览
    utools.db.promises.get(LocalNameEnum.ZONE_PREVIEW + props.zone.id)
            .then(res => {
                if (res) {
                    preview.value = res.value;
                }
            });
    // 评论
    utools.db.promises.get(LocalNameEnum.ZONE_COMMENT + props.zone.id)
            .then(res => {
                if (res) {
                    comments.value = res.value;
                    commentRev = res._rev;
                }
            });

}

// =========================================================================
// ---------------------------------- 功能 ----------------------------------
// =========================================================================

function toDate(date: Date | string | number) {
    return toDateString(date, 'yyyy年MM月dd日 HH:mm')
}

function executeCopy() {
    utools.db.promises.get(LocalNameEnum.ZONE_CONTENT + props.zone?.id)
            .then(res => {
                if (res) {
                    const content = res.value as ZoneContent;
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
            .catch(e => MessageUtil.error("删除失败", e));
}

// =========================================================================
// ---------------------------------- 图片 ----------------------------------
// =========================================================================

function showImagePreview(id: string, name: string) {
    utools.db.promises.getAttachment('/zone/attachment/' + id)
            .then(buffer => {
                if (!buffer) {
                    MessageUtil.warning("图片未找到");
                    return;
                }
                imagePreview.value = {
                    id,
                    name,
                    dialog: true,
                    value: URL.createObjectURL(new Blob([buffer]))
                };
            });
}

function releaseImagePreview() {
    URL.revokeObjectURL(imagePreview.value.value);
    imagePreview.value.value = '';
}

function downloadImage() {
    utools.db.promises.getAttachment(LocalNameEnum.ZONE_ATTACHMENT + imagePreview.value.id)
            .then(buffer => {
                if (!buffer) {
                    MessageUtil.warning("图片未找到");
                    return;
                }
                download(buffer, imagePreview.value.name, 'image');
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

async function syncComment() {
    if (!props.zone) {
        MessageUtil.error("动态不存在，请刷新后重试")
        return;
    }
    const res = await utools.db.promises.put({
        _id: LocalNameEnum.ZONE_COMMENT + props.zone.id,
        _rev: commentRev,
        value: toRaw(comments.value)
    });
    if (res.error) {
        return Promise.reject(res.message);
    }
    commentRev = res.rev;
}

</script>
<style scoped>

</style>
