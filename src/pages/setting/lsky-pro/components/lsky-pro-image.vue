<template>
    <div class="lsky-pro-image">
        <header class="image-header">
            <a-button>请选择相册</a-button>
            <a-input-group>
                <a-input-search v-model="keyword" placeholder="请输入关键字搜索" @search="search()" allow-clear/>
                <a-select v-model="order" style="width: 100px" placeholder="权限">
                    <a-option value="newest">最新</a-option>
                    <a-option value="earliest">最早</a-option>
                    <a-option value="utmost">最大</a-option>
                    <a-option value="least">最下</a-option>
                </a-select>
                <a-select v-model="permission" style="width: 100px" allow-clear placeholder="权限">
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
                <a-image v-for="item in items" :src="item.links.url" :width="200" :title="item.name"
                         :description='item.human_date'>
                    <template #loader>
                        <img alt="item.name" width="200" :src="item.links.thumbnail_url"/>
                    </template>
                </a-image>
            </a-image-preview-group>
            <a-result status="404" title="没有图片" v-else/>
            <a-pagination v-model:current="page" :page-size="size" :total="total"/>
        </main>
    </div>
</template>
<script lang="ts" setup>

import {ref, watch} from "vue";
import {ImageOrder, ImagePermission, ImageResult} from "@/plugin/sdk/LskyPro";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageUtil from "@/utils/MessageUtil";

const page = ref(1);
const size = ref(10);
const total = ref(0);
const order = ref<ImageOrder>('newest');
const permission = ref<ImagePermission | undefined>(undefined);
const albumId = ref<number | undefined>(undefined);
const keyword = ref('');
const items = ref(new Array<ImageResult>())
const isLoad = ref(false);

watch(() => page.value, () => render());


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

render();

function search() {
    page.value = 1;
    render();
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
        left: 7px;
        right: 7px;
        bottom: 7px;
        overflow: auto;
    }
}
</style>
