<template>
    <div class="zone">
        <!-- 容器 -->
        <div class="container">
            <a-list :bordered="false" :max-height="240" scrollbar
                    @reach-bottom="render()" v-if="isInit">
                <a-list-item class="item" v-for="item in items">
                    <!-- 文章 -->
                    <div class="header">
                        <div class="arco-list-item-main">
                            <div class="item-header">
                                <!-- 元信息 -->
                                <div class="arco-list-item-meta">
                                    <!-- 头像信息 -->
                                    <div class="arco-list-item-meta-avatar">
                                        <a-avatar :style="{ backgroundColor: 'var(--primary-color)' }"
                                                  :title="admin.nickname">
                                            <img alt="头像" v-if="admin.avatar !== ''" :src="admin.avatar"/>
                                            <span v-else>{{ admin.nickname }}</span>
                                        </a-avatar>
                                    </div>
                                    <div class="arco-list-item-meta-content">
                                        <!-- 昵称 -->
                                        <div class="arco-list-item-meta-title">{{ admin.nickname }}</div>
                                        <!-- 发布时间 -->
                                        <div class="arco-list-item-meta-description">{{
                                                toDateString(item.id)
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        <a-space>
                            <a-row>
                                <a-col v-for="image in item.imageWrap" :span="8">
                                    <a-image :alt="image.name" height="150px" width="150px"
                                             @vue:mounted="renderImage($event, image.id)" fit="cover" show-loader
                                             :preview="false" @click="showImagePreview(image.id, image.name)"
                                             style="cursor: pointer;"/>
                                </a-col>
                            </a-row>
                        </a-space>
                    </div>
                    <!-- 标签 -->
                    <div class="tags" v-if="item.content.tags.length > 0">
                        <a-tag v-for="tag of item.content.tags" :key="tag" style="margin-right: 7px;">
                            # {{ tag }}
                        </a-tag>
                    </div>
                    <!-- 动作 -->
                    <ul class="action">
                        <a-button-group type="text">
                            <a-button>
                                <template #icon>
                                    <icon-heart-fill :size="16" v-if="item.collect"
                                                     style="color: rgb(var(--red-6))"/>
                                    <icon-heart :size="16" v-else/>
                                </template>
                            </a-button>
                            <a-button>
                                <template #icon>
                                    <icon-message :size="16"/>
                                </template>
                            </a-button>
                            <a-dropdown>
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
                        <a-tag v-if="item.content.location.trim() !== ''" style="margin: 4px;" color="green">
                            <template #icon>
                                <icon-location/>
                            </template>
                            {{ item.content.location }}
                        </a-tag>
                    </ul>
                    <!-- 评论 -->
                    <div class="comment">
                        <div class="comment-item" v-for="(comment, i) in item.comments">
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
                </a-list-item>
                <template #scroll-loading>
                    <div v-if="bottom">没有更多动态了</div>
                    <a-spin v-else/>
                </template>
            </a-list>
        </div>
        <!-- 新增文章 -->
        <div class="add" @click="openAdd">
            <icon-plus :size="14" style="margin: 13px;"/>
        </div>
        <!-- 新增动态 -->
        <a-modal class="zone-add" v-model:visible="zone.dialog" title="新增动态" title-align="start" ok-text="发布"
                 draggable
                 @ok="execute" @cancel="cancelAdd">
            <!-- 动态内容 -->
            <a-textarea :auto-size="{ minRows: 2, maxRows: 8 }" v-model="zone.content"
                        placeholder="有什么新鲜事想分享？"/>
            <!-- 标签 -->
            <div class="tag" style="margin: 7px 0;">
                <a-tag v-for="tag of zone.tags" :key="tag" closable @close="tagHandleRemove(tag)"
                       style="margin-right: 7px;">
                    # {{ tag }}
                </a-tag>
                <a-input v-if="zone.showTagInput" ref="inputRef" :style="{ width: '90px' }" size="mini"
                         v-model.trim="zone.tagInputVal" @keyup.enter="tagHandleAdd" @blur="tagHandleAdd">
                    <template #prefix>#</template>
                </a-input>
                <a-tag v-else @click="tagHandleEdit" style="cursor: pointer;">
                    <template #icon>
                        <icon-plus/>
                    </template>
                    新增标签
                </a-tag>
            </div>
            <!-- 媒体 -->
            <div class="media">
                <a-button-group type="text">
                    <a-button @click="zone.showImageBtn = !zone.showImageBtn">
                        <template #icon>
                            <icon-image/>
                        </template>
                        图片
                    </a-button>
                    <a-button @click="zone.showLocationInput = !zone.showLocationInput"
                              :status="zone.location === '' ? 'normal' : 'success'">
                        <template #icon>
                            <icon-location/>
                        </template>
                        地点
                    </a-button>
                </a-button-group>
            </div>
            <!-- 照片墙 -->
            <div class="image" v-if="zone.showImageBtn">
                <a-upload list-type="picture-card" action="/" :default-file-list="zone.imageList" image-preview
                          :limit="9" :custom-request="imageRequest"/>
            </div>
            <!-- 地点 -->
            <div class="location" v-if="zone.showLocationInput">
                <a-input v-model.trim="zone.location" placeholder="请输入地点"
                         @keyup.enter="zone.showLocationInput = false">
                    <template #prefix>
                        <icon-location/>
                    </template>
                </a-input>
            </div>
        </a-modal>
        <!-- 新增评论 -->
        <a-modal v-model:visible="comment.dialog" title="新增评论" title-align="start" draggable ok-text="发布"
                 @ok="addComment">
            <a-textarea v-model="comment.content" :auto-size="{ minRows: 2, maxRows: 8 }" show-word-limit
                        :max-length="100"
                        placeholder="评论不能超过100个字"/>
        </a-modal>
        <a-back-top target-container=".zone"/>
        <!-- 图片预览组件 -->
        <a-image-preview :src="imagePreview.value" v-model:visible="imagePreview.dialog" @close="releaseImagePreview">
            <template #actions>
                <a-image-preview-action name="下载" @click="downloadImage">
                    <icon-download/>
                </a-image-preview-action>
            </template>
        </a-image-preview>
    </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {defineComponent} from 'vue';
import {useGlobalStore} from '@/store/GlobalStore';
import ZoneWrap from "./domain/ZoneWrap";
import MessageUtil from '@/utils/MessageUtil';
import ZoneAttachment from "@/entity/zone/ZoneAttachment";
import {toDateString} from 'xe-utils';
import ZoneComment from '@/entity/zone/ZoneComment';
import {renderOne, renderImage} from "./render";
import {RequestOption} from "@arco-design/web-vue";
import ZoneAttachmentTypeEnum from "@/enumeration/ZoneAttachmentTypeEnum";
import {download} from "@/utils/BrowserUtil";
import Assert from "@/utils/Assert";
import {useZoneStore} from "@/store/db/ZoneStore";

export default defineComponent({
    name: 'zone',
    data: () => ({
        items: new Array<ZoneWrap>(),
        item_rev: undefined as string | undefined,
        zone: {
            dialog: false,
            content: '',
            tags: new Array<string>(),
            location: '',
            type: 0,
            showTagInput: false,
            tagInputVal: '',
            showLocationInput: false,
            imageList: [],
            showImageBtn: false,
            image: new Array<ZoneAttachment>()
        },
        comment: {
            dialog: false,
            index: -1,
            content: ''
        },
        // 显示数据
        startIndex: 0,
        imagePreview: {
            id: '',
            name: '',
            dialog: false,
            value: ''
        },
        isInit: false,
        bottom: false
    }),
    computed: {
        ...mapState(useGlobalStore, ['admin', 'size']),
        ...mapState(useZoneStore, ['zones'])
    },
    created() {
        useZoneStore().init()
                .then(() => this.isInit = true);
    },
    methods: {
        renderImage,
        // 渲染
        toDateString(date: string | Date | number) {
            return toDateString(date, 'yyyy-MM-dd HH:mm:ss');
        },
        render() {
            if (this.bottom) {
                return;
            }
            let zones = this.zones.slice(Math.max(this.startIndex, 0), Math.min(this.zones.length, this.startIndex + 5));
            zones = zones.sort((a, b) => Number(b.id) - Number(a.id));
            this.startIndex = Math.min(this.zones.length, this.startIndex + 5);
            if (this.startIndex === this.zones.length) {
                this.bottom = true;
            }
            for (let e of zones) {
                this.items.push(renderOne(e));
            }
            console.log(this.items)
        },
        openAdd() {
            this.zone = {
                dialog: true,
                content: '',
                tags: new Array<string>(),
                location: '',
                type: 0,
                showTagInput: false,
                tagInputVal: '',
                showLocationInput: false,
                imageList: [],
                showImageBtn: false,
                image: new Array<ZoneAttachment>()
            }
        },
        openComment(index: number) {
            this.comment = {
                index,
                dialog: true,
                content: '',
            }
        },
        executeCopy(content: string) {
            utools.copyText(content);
            MessageUtil.success("成功复制到剪切板");
        },

        showMore() {
            this.startIndex = this.startIndex - 5;
            this.render();
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

        // ------ 新增标签 ------

        tagHandleEdit() {
            this.zone.showTagInput = true;

            this.$nextTick(() => {
                let inputRef = this.$refs['inputRef'] as HTMLInputElement;
                if (inputRef) {
                    inputRef.focus();
                }
            });
        },
        tagHandleAdd() {
            if (this.zone.tagInputVal) {
                this.zone.tags.push(this.zone.tagInputVal);
                this.zone.tagInputVal = '';
            }
            this.zone.showTagInput = false;
        },
        tagHandleRemove(key: string) {
            this.zone.tags = this.zone.tags.filter((tag) => tag !== key);
        },

        // 新增图片

        imageRequest(option: RequestOption): any {
            if (!option.fileItem.file) {
                MessageUtil.error("文件不存在");
                return;
            }

            let now = new Date();
            let id = now.getTime() + '';
            let reader = new FileReader();
            reader.readAsArrayBuffer(option.fileItem.file);
            reader.onload = (evt: ProgressEvent<FileReader>) => {
                if (evt.target) {
                    // 本地导入
                    let result = evt.target.result as ArrayBuffer;
                    let res = utools.db.postAttachment(`/zone/attachment/${id}`,
                            new Uint8Array(result),
                            'image');
                    if (res.error) {
                        MessageUtil.error(res.message || '新增异常');
                        return;
                    }
                    this.zone.image.push({
                        id,
                        type: ZoneAttachmentTypeEnum.IMAGE,
                        name: option.fileItem.name || '未知文件',
                    });
                } else {
                    MessageUtil.error("解析失败", option.fileItem.name);
                }
            }
        },

        // ------ 空间相关 ------
        execute() {
            useZoneStore().add({
                image: this.zone.image,
                attachments: []
            }, {
                body: this.zone.content,
                location: this.zone.location,
                tags: this.zone.tags
            })
                    .then(() => MessageUtil.success("发布成功"))
                    .catch(e => MessageUtil.error("发布失败", e));
        },
        removeByIndex(id: number) {
            useZoneStore().remove(id)
                    .then(() => MessageUtil.success("删除成功"))
                    .catch(e => MessageUtil.error("删除失败", e));

        },
        cancelAdd() {
            // TODO: 删除附件
            // 删除图片
            this.zone.image.forEach(id => utools.db.remove(`/zone/attachment/${id}`));
            // TODO: 获取视频
            // TODO: 获取声音
        },
        // ------ 评论相关 ------
        addComment() {
            // 获取评论的文章信息
            Assert.isTrue(this.comment.index < this.items.length, "数据异常，文章索引越界");
            let item = this.items[this.items.length - this.comment.index - 1];
            // 获取全部评论
            let comments = new Array<ZoneComment>();
            let commentRev = undefined as string | undefined;
            let commentWrap = utools.db.get('/zone/comment/' + item.id);
            if (commentWrap) {
                commentRev = commentWrap._rev;
                comments = commentWrap.value;
            }
            comments.push({
                id: new Date().getTime() + '',
                content: this.comment.content
            });
            utools.db.put({
                _id: '/zone/comment/' + item.id,
                _rev: commentRev,
                value: comments
            });
            // 增加到当前显示中
            this.items[this.comment.index].comments.push({
                id: new Date().getTime() + '',
                content: this.comment.content
            });
            MessageUtil.success("评论新增成功");
        },
        // index: 文章索引；i：评论索引
        removeComment(index: number, i: number) {
            // 获取评论的文章信息
            Assert.isTrue(index < this.items.length, "数据异常，文章索引越界");
            let item = this.items[this.items.length - index - 1];
            // 获取全部评论
            let comments = new Array<ZoneComment>();
            let commentRev = undefined as string | undefined;
            let commentWrap = utools.db.get('/zone/comment/' + item.id);
            if (commentWrap) {
                commentRev = commentWrap._rev;
                comments = commentWrap.value;
            }
            Assert.isTrue(i < comments.length, "数据异常，评论索引越界");
            comments.splice(i, 1); // 移除指定索引的评论记录, 并将其删除掉。
            utools.db.put({
                _id: '/zone/comment/' + item.id,
                _rev: commentRev,
                value: comments
            });
            // 增加到当前显示中
            this.items[index].comments.splice(i, 1);
            MessageUtil.success("评论删除成功");
        },
        updateZoneBackgroundImage() {
            this.$router.push({
                path: '/setting',
                query: {
                    key: '2'
                }
            })
        }
    }
});
</script>
<style lang="less">
@import url(./index.less);
</style>
