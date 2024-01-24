<template>
    <!-- 新增文章 -->
    <div class="add" @click="openAdd()">
        <icon-plus :size="14" style="margin: 13px;"/>
    </div>
    <!-- 新增动态 -->
    <a-modal class="zone-add" v-model:visible="zone.dialog" title="新增动态" title-align="start" ok-text="发布"
             draggable
             @ok="execute()" @cancel="cancelAdd()">
        <!-- 动态内容 -->
        <a-textarea :auto-size="{ minRows: 2, maxRows: 8 }" v-model="zone.content"
                    placeholder="有什么新鲜事想分享？（支持Markdown）"/>
        <!-- 标签 -->
        <div class="tag" style="margin: 7px 0;">
            <a-tag v-for="tag of zone.tags" :key="tag" closable @close="tagHandleRemove(tag)"
                   style="margin-right: 7px;">
                # {{ tag }}
            </a-tag>
            <a-input v-if="zone.showTagInput" ref="inputRef" :style="{ width: '90px' }" size="mini"
                     v-model.trim="zone.tagInputVal" @keyup.enter="tagHandleAdd" @blur="tagHandleAdd()">
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
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ZoneAttachment} from "@/entity/zone";
import {useZoneStore} from "@/store/db/ZoneStore";
import MessageUtil from "@/utils/MessageUtil";
import {RequestOption} from "@arco-design/web-vue";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {FileItem} from "@arco-design/web-vue";
import {statistics} from "@/global/BeanFactory";
import {postAttachment} from "@/utils/utools/DbStorageUtil";
import {openAddDialog} from "@/pages/zone/components/add";

export default defineComponent({
    name: 'zone-add',
    emits: ['add'],
    data: () => ({
        zone: {
            dialog: false,
            content: '',
            tags: new Array<string>(),
            location: '',
            type: 0,
            showTagInput: false,
            tagInputVal: '',
            showLocationInput: false,
            imageList: new Array<FileItem>(),
            showImageBtn: false,
            image: new Array<ZoneAttachment>()
        },
    }),
    methods: {
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
            postAttachment(LocalNameEnum.ZONE_ATTACHMENT + id,
                option.fileItem.file)
                .then(url => {
                    if (option.fileItem.file) {
                        this.zone.imageList.push({
                            uid: LocalNameEnum.ZONE_ATTACHMENT + id,
                            file: option.fileItem.file,
                            url: url
                        })
                    }
                });
        },

        // ------ 空间相关 ------
        execute() {
            statistics.access("新增动态");
            useZoneStore().add({
                image: this.zone.image,
                attachments: [],
                location: this.zone.location,
                tags: this.zone.tags
            }, {
                body: this.zone.content
            })
                    .then(() => {
                        MessageUtil.success("发布成功");
                        this.$emit('add');
                    })
                    .catch(e => MessageUtil.error("发布失败", e));
        },
        cancelAdd() {
            // TODO: 删除附件
            // 删除图片
            this.zone.image.forEach(id => utools.db.remove(LocalNameEnum.ZONE_ATTACHMENT + id));
            // 释放图片
            this.zone.imageList.forEach(url => url.url ? window.URL.revokeObjectURL(url.url) : null);
            // TODO: 获取视频
            // TODO: 获取声音
        },
        openAdd() {
            openAddDialog()
            // this.zone = {
            //     dialog: true,
            //     content: '',
            //     tags: new Array<string>(),
            //     location: '',
            //     type: 0,
            //     showTagInput: false,
            //     tagInputVal: '',
            //     showLocationInput: false,
            //     imageList: [],
            //     showImageBtn: false,
            //     image: new Array<ZoneAttachment>()
            // }
        },
    }
});
</script>
<style scoped>

</style>
