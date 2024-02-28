<template>
    <div class="home-editor-side">
        <header style="margin: 7px;">
            <a-input-group style="width: 100%">
                <a-input style="width: calc(100% - 32px);" v-model="keyword" allow-clear placeholder="请输入文章标题"/>
                <he-more/>
            </a-input-group>
        </header>
        <div id="editor-tree" class="ztree"/>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import HeMore from "@/pages/home/layout/editor-side/components/he-more.vue";
import {ZTreeInstance} from "@/plugin/sdk/ZTree";
import {buildZTreeSetting, getTreeNodes} from "@/pages/home/layout/editor-side/components/ZTreeSetting";

const size = useWindowSize();

const keyword = ref('');

const zTreeObj = shallowRef<null | ZTreeInstance>(null)

onMounted(_init);

async function _init() {
    zTreeObj.value = window.$.fn.zTree.init(window.$("#editor-tree"), buildZTreeSetting(zTreeObj), null);
    zTreeObj.value && zTreeObj.value.addNodes(null, 0, getTreeNodes(0), false);
}

</script>
<style lang="less">
.home-editor-side {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    .option {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 14px;
        display: flex;
        justify-content: center;

        .btn {
            border: 1px solid var(--color-neutral-3);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            background-color: rgba(255, 255, 255, 0.6);
        }

    }
}

body[arco-theme=dark] {
    .home-editor-side {

        .option {

            .btn {
                background-color: rgba(0, 0, 0, 0.6);
            }

        }
    }
}

.ztree {
    color: var(--color-text-1);

    li a {
        width: calc(100% - 19px);
        padding-left: 0;

        &.curSelectedNode {
            background-color: rgb(var(--orange-2));
            border: 1px rgb(var(--orange-6));
        }
    }

    .node_name {
        color: var(--color-text-1);

    }
}
</style>
