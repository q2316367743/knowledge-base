<template>
    <a-layout class="lsky-pro-image">
        <header class="image-header">
            <a-button @click="openAlbum()">{{ albumName }}</a-button>
            <a-input-group>
                <a-input-search v-model="keyword" placeholder="请输入关键字搜索" @search="search()" allow-clear/>
                <a-select v-model="order" style="width: 100px" placeholder="排序">
                    <a-option value="newest">最新</a-option>
                    <a-option value="earliest">最早</a-option>
                    <a-option value="utmost">最大</a-option>
                    <a-option value="least">最小</a-option>
                </a-select>
                <a-select v-model="permission" style="width: 140px" allow-clear placeholder="权限">
                    <a-option value="public">公开</a-option>
                    <a-option value="primary">私有</a-option>
                </a-select>
            </a-input-group>
        </header>
        <main class="image-container">
            <a-result v-if="isLoad" title="加载中">
                <template #icon>
                    <icon-loading spin/>
                </template>
            </a-result>
            <a-image-preview-group infinite v-else-if="!isLoad && items.length > 0">
                <div class="images">
                    <div v-for="item in items" class="image">
                        <a-image :src="item.links.url" :alt="item.name" height="200px"/>
                        <div class="title">{{ item.name }}</div>
                        <div class="date">{{ item.human_date }}</div>
                        <div class="action">
                            <a-button-group type="text" size="mini">
                                <a-tooltip content="复制链接">
                                    <a-button @click="copyUrl(item)">
                                        <template #icon>
                                            <icon-link/>
                                        </template>
                                    </a-button>
                                </a-tooltip>
                                <a-tooltip content="复制markdown">
                                    <a-button @click="copyMarkdown(item)">
                                        <template #icon>
                                            <icon-edit/>
                                        </template>
                                    </a-button>
                                </a-tooltip>
                                <a-tooltip content="查看详情">
                                    <a-button @click="openInfo(item)">
                                        <template #icon>
                                            <icon-info-circle/>
                                        </template>
                                    </a-button>
                                </a-tooltip>
                            </a-button-group>
                        </div>
                    </div>
                </div>
            </a-image-preview-group>
            <a-result status="404" title="没有图片" v-else/>
            <a-pagination v-model:current="page" :page-size="size" :total="total" style="margin-top: 7px"/>
        </main>
        <a-drawer v-model:visible="album.visible" title="全部相册" width="400px">
            <a-input-group>
                <a-input-search v-model="album.option.keyword" @search="searchAlbum()"/>
                <a-select v-model="order" style="width: 100px">
                    <a-option value="newest">最新</a-option>
                    <a-option value="earliest">最早</a-option>
                    <a-option value="most">图片最多</a-option>
                    <a-option value="least">图片最少</a-option>
                </a-select>
            </a-input-group>
            <a-result title="加载中" v-if="album.load" style="margin-top: 7px;">>
                <template #icon>
                    <icon-loading spin/>
                </template>
            </a-result>
            <div v-else style="margin-top: 7px;">
                <a-radio-group v-model="albumId" style="width: 100%;">
                    <a-list>
                        <a-list-item v-for="item in album.records">
                            <a-radio :value="item.id">{{ item.name }}</a-radio>
                            <template #extra>{{ item.image_num }}</template>
                        </a-list-item>
                    </a-list>
                </a-radio-group>
                <a-pagination v-model:current="album.page" :page-size="album.size" :total="album.total"/>
            </div>
            <template #footer>
                <a-button @click="clearAlbum()">
                    清空
                </a-button>
                <a-button type="primary" @click="chooseAlbum()">
                    选择
                </a-button>
            </template>
        </a-drawer>
    </a-layout>
</template>
<script lang="ts" setup>
import {h, ref, watch} from "vue";
import {AlbumResult, AlbumType, ImageOrder, ImagePermission, ImageResult} from "@/plugin/sdk/LskyPro";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import {Descriptions, DescriptionsItem, Link, Modal} from "@arco-design/web-vue";
import {utools} from "@/plugin/utools";

const page = ref(1);
const size = ref(10);
const total = ref(0);
// 排序
const order = ref<ImageOrder>('newest');
// 权限
const permission = ref<ImagePermission | undefined>(undefined);
// 相册
const albumId = ref<number | undefined>(undefined);
const albumName = ref<string>("请选择相册")
// 关键字
const keyword = ref('');

const items = ref(new Array<ImageResult>())
const isLoad = ref(false);

// 相册
const album = ref({
    visible: false,
    records: new Array<AlbumResult>(),
    page: 1,
    size: 10,
    total: 0,
    load: false,
    option: {
        order: 'newest',
        keyword: ''
    }
})

watch(() => page.value, () => render(), {immediate: true});
watch(() => order.value, () => render());
watch(() => permission.value, () => render());
watch(() => albumId.value, () => render());
watch(() => album.value.page, () => renderAlbum());

function render() {
    isLoad.value = true;
    items.value = [];
    useLskyProSettingStore().instance.images({
        page: page.value,
        order: order.value,
        permission: permission.value,
        album_id: albumId.value,
        keyword: keyword.value,
    }).then(images => {
        items.value = images.data;
        total.value = images.total;
        size.value = images.per_page;
        page.value = images.current_page;
    }).catch(e => MessageUtil.error("图片列表查询失败", e))
            .finally(() => isLoad.value = false);
}

function search() {
    page.value = 1;
    render();
}

function openAlbum() {
    album.value = {
        visible: true,
        records: new Array<AlbumResult>(),
        page: 1,
        size: 10,
        total: 0,
        load: false,
        option: {
            order: 'newest',
            keyword: ''
        }
    }
    renderAlbum();
}

function renderAlbum() {
    album.value.load = true;
    useLskyProSettingStore().instance.albums({
        page: album.value.page,
        order: album.value.option.order as AlbumType,
        keyword: album.value.option.keyword
    })
            .then(rsp => {
                album.value.page = rsp.current_page;
                album.value.size = rsp.per_page;
                album.value.total = rsp.total;
                album.value.records = rsp.data;
            })
            .catch(e => MessageUtil.error("获取相册失败", e))
            .finally(() => album.value.load = false);
}

function chooseAlbum() {
    album.value.visible = false;
    albumName.value = ''
    if (albumId.value) {
        for (let record of album.value.records) {
            if (record.id === albumId.value) {
                albumName.value = record.name;
            }
        }
    }
    if (!albumName.value) {
        albumName.value = albumId.value + '';
    }
    page.value = 1;
}

function clearAlbum() {
    album.value.visible = false;
    albumId.value = undefined;
    albumName.value = "请选择相册";
    page.value = 1;
}

function searchAlbum() {
    album.value.page = 1;
    renderAlbum();
}

function openInfo(item: ImageResult) {
    Modal.open({
        title: "图片信息",
        width: "600px",
        content: () => h(Descriptions, {
            bordered: true,
            column: 1,
            width: 400,
            footer: false
        }, () => ([
            h(DescriptionsItem, {
                label: "图片唯一秘钥"
            }, () => (item.key)),
            h(DescriptionsItem, {
                label: "图片名称"
            }, () => (item.name)),
            h(DescriptionsItem, {
                label: "图片原始名称"
            }, () => (item.origin_name)),
            h(DescriptionsItem, {
                label: "图片大小"
            }, () => (item.size + " KB")),
            h(DescriptionsItem, {
                label: "图片尺寸"
            }, () => (item.width + " * " + item.height)),
            h(DescriptionsItem, {
                label: "md5"
            }, () => (item.md5)),
            h(DescriptionsItem, {
                label: "sha1"
            }, () => (item.sha1)),
            h(DescriptionsItem, {
                label: "上传时间"
            }, () => (item.human_date)),
            h(DescriptionsItem, {
                label: "上传日期"
            }, () => (item.date)),
            h(DescriptionsItem, {
                label: "链接"
            }, () => ([
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.url);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制链接")),
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.html);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制html")),
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.markdown);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制markdown")),
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.markdown_with_link);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制链接的markdown"))
            ]))
        ]))
    })
}


function copyUrl(item: ImageResult) {
    utools.copyText(item.links.url);
    MessageUtil.success("成功复制到剪切板");
}

function copyMarkdown(item: ImageResult) {
    utools.copyText(item.links.markdown);
    MessageUtil.success("成功复制到剪切板");
}

</script>
<style scoped lang="less">
.lsky-pro-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .image-header {
        display: flex;
        justify-content: space-between;
    }

    .image-container {
        position: absolute;
        top: 39px;
        left: 0;
        right: 0;
        bottom: 7px;
        overflow: auto;
        .images {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
            .image {
                height: 200px;
                position: relative;
                margin: 4px;
                .title {
                    position: absolute;
                    left: 7px;
                    bottom: 30px;
                }
                .date {
                    position: absolute;
                    left: 7px;
                    bottom: 7px;
                }
                .action {
                    position: absolute;
                    right: 7px;
                    bottom: 7px;
                }
            }
        }
    }
}
</style>
