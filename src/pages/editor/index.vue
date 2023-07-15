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
            <a-button-group type="text">
                <a-button type="primary" style="margin-right: 7px">保存</a-button>
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
import {defineComponent} from "vue";
import Vditor from "vditor";
import {mapState} from "pinia";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";

export default defineComponent({
    name: 'editor',
    data: () => ({
        title: '',
        content: '',
        preview: {
            show: false,
            src: ''
        },
        extra: {
            visible: false,
            tags: new Array<string>(),
            categoryId: null,
            description: ''
        }
    }),
    computed: {
        ...mapState(useGlobalStore, ['size', 'isDark']),
        ...mapState(useArticleStore, ['articleTags']),
        ...mapState(useCategoryStore, ['categories'])
    },
    mounted() {
        const vditor = new Vditor("editor-instance", {
            height: this.size.height - 47,
            width: this.size.width - 14,
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
            }
        })
    },
    methods: {
        toHome() {
            if (this.title.trim() !== '' || this.content.trim() !== '') {
                MessageBoxUtil.confirm("退出后内容将会丢失，是否继续？", "退出警告", {
                    confirmButtonText: "退出",
                    cancelButtonText: "取消"
                }).then(() => this.$router.push("/home"));

            } else {
                this.$router.push("/home");
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
