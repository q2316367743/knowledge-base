<template>
    <a-modal v-model:visible="visible" title="文章导入" :footer="false" :mask-closable="false" :closable="false"
             :esc-to-close="false" :unmount-on-close="false">
        <a-result status="info" title="正在导入中，请勿关闭。" :subtitle="subtitle"/>
    </a-modal>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useImportEvent} from "@/global/BeanFactory";
import MessageUtil from "@/utils/MessageUtil";
import ArticleImport from "@/components/MarkdownImport/ArticleImport";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase} from "@/entity/article";

const visible = ref(false);
const subtitle = ref('');

useImportEvent.on(content => {
    visible.value = true;
    subtitle.value = '开始导入';

    try {
        const zone = JSON.parse(content) as ArticleImport;
        if (typeof zone.title === 'undefined' || zone.title.trim() === '') {
            MessageUtil.error("文章标题为必填！");
            visible.value = false;
            return;
        }
        if (typeof zone.content === 'undefined' || zone.content.trim() === '') {
            MessageUtil.error("文章内容为必填！");
            visible.value = false;
            return;
        }
        useArticleStore().add({
            tags: zone.tags || [],
            source: zone.source || '',
            description: zone.description || '',
            name: zone.title,
            categoryId: null,
            folder: 0,
            preview: false
        }, {
            ...getDefaultArticleBase(),
            sourceUrl: zone.sourceUrl || ''
        }, zone.content)
                .then(() => MessageUtil.success("文章导入成功！"))
                .catch(e => MessageUtil.error("文章导入失败", e))
                .finally(() => visible.value = false);
    } catch (e) {
        MessageUtil.error("文章导入失败，内容不受支持", e);
        visible.value = false;
    }
});

</script>
<style scoped>

</style>
