<template>
    <a-card class="item" :bordered="false" hoverable>
        <template #title>
            <span style="color: var(--color-neutral-6);">
                {{toDateString(item.createTime)}}
            </span>
        </template>
        <!-- 内容 -->
        <div class="content">
            <a-typography-paragraph :ellipsis="{
                            rows: 3,
                            expandable: true,
                        }" style="overflow-x: auto;margin-bottom: 0;">
                <div v-html="item.content.body"></div>
            </a-typography-paragraph>
        </div>
        <!-- 图片 -->
        <div class="image" v-if="item.imageWrap.length > 0">
                <a-row :gutter="7">
                    <a-col v-for="image in item.imageWrap" :span="8">
                        <a-image :alt="image.name" height="150px" width="150px"
                                 @vue:mounted="renderImage($event, image.id)" fit="cover" show-loader
                                 :preview="false" @click="showImagePreview(image.id, image.name)"
                                 style="cursor: pointer;"/>
                    </a-col>
                </a-row>
        </div>
        <!-- 标签 -->
        <div class="tags" v-if="item.content.tags.length > 0">
            <a-tag v-for="tag of item.content.tags" :key="tag" style="margin-right: 7px;">
                # {{ tag }}
            </a-tag>
        </div>
        <!-- 地址 -->
        <div class="location" v-if="item.content.location.trim() !== ''">
            <icon-location />
            <span style="margin-left: 7px;">{{item.content.location}}</span>
        </div>
        <!-- 评论 -->
        <div class="comment">
            <div class="comment-item" v-for="comment in item.comments">
                <div class="comment-content">{{ comment.content }}</div>
                <div class="action">
                    <div class="time">
                        <a-tag color="var(--primary-color)">
                            <template #icon>
                                <icon-clock-circle/>
                            </template>
                            {{ toDateString(comment.id) }}
                        </a-tag>
                    </div>
                    <div class="btn">
                        <a-popconfirm content="确认删除？">
                            <a-button type="text" status="danger">删除</a-button>
                        </a-popconfirm>
                    </div>
                </div>
            </div>
        </div>
        <template #extra>
            <a-button-group type="text">
                <a-button @click="openComment(item.id)">
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
                        <a-doption @click="executeCopy(item.source)">
                            <template #icon>
                                <icon-copy/>
                            </template>
                            复制
                        </a-doption>
                        <a-doption>
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
<script lang="ts">
import {defineComponent} from "vue";
import {toDateString} from 'xe-utils'
import ZoneWrap from "@/pages/zone/domain/ZoneWrap";
import MessageUtil from "@/utils/MessageUtil";
import {getDefaultZoneWrap, renderImage, renderOne} from "@/pages/zone/render";
import ZoneAdd from "@/pages/zone/components/add.vue";
import {download} from "@/utils/BrowserUtil";
import Zone from "@/entity/zone";

export default defineComponent({
    name: 'zone-item',
    components: {ZoneAdd},
    props: {
        zone: Object
    },
    data: () => ({
        item: getDefaultZoneWrap() as ZoneWrap,
        imagePreview: {
            id: '',
            name: '',
            dialog: false,
            value: ''
        },
        comment: {
            dialog: false,
            id: 0,
            content: ''
        },
    }),
    created() {
        if (this.zone) {
            this.item = Object.assign(this.item, renderOne(this.zone as Zone));
        }
    },
    methods: {
        renderImage,
        toDateString(date: Date | string) {
            return toDateString(date, 'yyyy年MM月dd日 HH:mm')
        },
        executeCopy(content: string) {
            utools.copyText(content);
            MessageUtil.success("成功复制到剪切板");
        },
        showImagePreview(id: string, name: string) {
            utools.db.promises.getAttachment('/zone/attachment/' + id)
                .then(buffer => {
                    if (!buffer) {
                        MessageUtil.warning("图片未找到");
                        return;
                    }
                    this.imagePreview = {
                        id,
                        name,
                        dialog: true,
                        value: URL.createObjectURL(new Blob([buffer]))
                    };
                });
        },
        releaseImagePreview() {
            URL.revokeObjectURL(this.imagePreview.value);
            this.imagePreview.value = '';
        },
        openComment(id: number) {
            this.comment = {
                id,
                dialog: true,
                content: '',
            }
        },
        downloadImage() {
            utools.db.promises.getAttachment('/zone/attachment/' + this.imagePreview.id)
                .then(buffer => {
                    if (!buffer) {
                        MessageUtil.warning("图片未找到");
                        return;
                    }
                    download(buffer, this.imagePreview.name, 'image');
                });
        },
        // ------ 评论相关 ------
        addComment() {

        },
        // index: 文章索引；i：评论索引
        removeComment(index: number, i: number) {
        },
    }
});
</script>
<style scoped>

</style>
