<template>
    <div class="editor">
        <div class="header">
            <div class="left">
                <a-button type="text" @click="toHome()">
                    <template #icon>
                        <icon-left/>
                    </template>
                </a-button>
                <a-input v-model="title" placeholder="请输入文章标题" allow-clear style="margin-left: 7px;"/>
            </div>
            <a-button-group type="primary">
                <a-button @click="save()" style="margin-right: 7px">保存</a-button>
                <a-button @click="extra.visible = true">
                    <template #icon>
                        <icon-settings/>
                    </template>
                </a-button>
            </a-button-group>
        </div>
        <div class="container">
            <div id="editor-instance"/>
        </div>
        <a-image-preview v-model:visible="preview.show" :src="preview.src"/>
        <a-drawer v-model:visible="extra.visible" title="额外信息" :width="300" :footer="false">
            <a-form :model="extra" layout="vertical">
                <a-form-item label="来源">
                    <a-input v-model="extra.source" :max-length="32"/>
                    <template #help>
                        最大32个字
                    </template>
                </a-form-item>
                <a-form-item label="分类">
                    <a-select v-model="extra.categoryId" placeholder="请选择分类">
                        <a-option v-for="category in categories" :value="category.id">{{ category.name }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="标签">
                    <a-select v-model="extra.tags" placeholder="请输入标签" multiple scrollbar allow-clear allow-search
                              allow-create>
                        <a-option v-for="tag in articleTags" :value="tag">{{ tag }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="描述">
                    <a-textarea v-model="extra.description" :auto-size="{minRows: 4}"
                                placeholder="请输入描述，不能超过64个字"
                                allow-clear :max-length="64" show-word-limit/>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import Vditor from "vditor";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import MessageUtil from "@/utils/MessageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleSource} from "@/entity/article";

export default defineComponent({
    name: 'editor',
    data: () => ({
        id: 0,
        title: '',
        content: '',
        preview: {
            show: false,
            src: ''
        },
        extra: {
            visible: false,
            tags: new Array<string>(),
            categoryId: null as number | null,
            description: '',
            createTime: '' as Date | string,
            source: ''
        },
        vditor: null as Vditor | null
    }),
    computed: {
        ...mapState(useGlobalStore, ['size', 'isDark']),
        ...mapState(useArticleStore, ['articleTags']),
        ...mapState(useCategoryStore, ['categories'])
    },
    created() {
    },
    mounted() {
        this.init()
            .then(() => console.debug("初始化成功"));
    },
    methods: {
        async init() {
            const id = this.$route.params.id as string;
            if (id !== '0') {
                this.id = parseInt(id);
                const articleIndex = useArticleStore().articleMap.get(this.id);
                if (!articleIndex) {
                    MessageUtil.error(`文章【${id}】未找到，请刷新后重试！`);
                    return;
                }
                this.extra = {
                    visible: false,
                    tags: articleIndex.tags,
                    categoryId: articleIndex.categoryId,
                    description: articleIndex.description,
                    createTime: articleIndex.createTime,
                    source: articleIndex.source
                }
                this.title = articleIndex.name;
                const contentWrap = await utools.db.promises.get(LocalNameEnum.ARTICLE_CONTENT + id);
                if (contentWrap) {
                    this.content = (contentWrap.value as ArticleSource).content
                }
            }
            const vditor = new Vditor("editor-instance", {
                height: '100%',
                width: '100%',
                theme: this.isDark ? 'dark' : 'classic',
                preview: {
                    hljs: {
                        lineNumber: true
                    }
                },
                cache: {
                    enable: false
                },
                link: {
                    isOpen: true,
                    click(ele: Element) {
                        utools.shellOpenExternal(ele.innerHTML);
                    }
                },
                image: {
                    isPreview: true,
                    preview: (ele: Element) => {
                        this.preview = {
                            show: true,
                            // @ts-ignore
                            src: ele.src
                        }
                    }
                },
                upload: {
                    handler(files: File[]) {
                        utools.redirect("图床", {
                            type: "files",
                            // @ts-ignore
                            data: files.map(e => e.path)
                        })
                        return Promise.resolve("");
                    }
                },
                value: this.content
            });
            this.vditor = markRaw(vditor);
        },
        toHome() {
            this.$router.push("/home");
        },
        save() {
            if (!this.vditor) {
                MessageUtil.warning("编辑器未加载完成，无法保存");
                return;
            }
            if (this.id === 0) {
                useArticleStore().add({
                    name: this.title,
                    description: this.extra.description,
                    tags: this.extra.tags,
                    categoryId: this.extra.categoryId,
                    source: this.extra.source
                }, this.vditor.getValue(), this.vditor.getHTML())
                    .then(() => MessageUtil.success("保存文章成功"))
                    .catch(e => MessageUtil.error("保存文章失败", e));
            } else {
                useArticleStore().update(this.id, {
                    name: this.title,
                    description: this.extra.description,
                    tags: this.extra.tags,
                    categoryId: this.extra.categoryId,
                    source: this.extra.source,
                    createTime: this.extra.createTime
                }, this.vditor.getValue(), this.vditor.getHTML())
                    .then(() => MessageUtil.success("保存文章成功"))
                    .catch(e => MessageUtil.error("保存文章失败", e));
            }
        }
    }
});
</script>
<style lang="less">
.editor {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 51;
    background-color: var(--color-bg-1);

    .header {
        padding: 4px 7px;
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;
            width: 50%;
        }
    }

    .container {
        position: absolute;
        top: 40px;
        left: 7px;
        right: 7px;
        bottom: 7px;

        .vditor-reset {
            color: var(--color-text-1);
        }
    }

}
</style>
