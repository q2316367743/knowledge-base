<template>
    <div class="about">
        <div class="container">
            <div class="logo">
                <img src="/logo.png" alt="知识库" style="width: 200px"/>
            </div>
            <div class="title">{{ Constant.name }} <span class="version">{{ Constant.version }}</span></div>
            <div class="author">
                <a-link :link="Constant.website" target="_blank" @click="openUrl(Constant.website)">
                    {{ Constant.author }}
                </a-link>
            </div>
            <div class="desc">
                <p>构建属于自己的知识库。</p>
                <p>开通utools会员，数据可同步。</p>
            </div>
            <div class="action">
                <a-button @click="openUrl(Constant.feedback)">反馈中心</a-button>
                <a-button @click="openUrl(Constant.repo)">开源地址</a-button>
                <a-button @click="openUrl(Constant.updateLog)">更新日志</a-button>
                <a-button @click="openUrl(Constant.online)">在线地址</a-button>
                <br />
                <a-tooltip content="控制台">
                    <a-switch :default-checked="consoleShow" @change="changeConsole()" style="margin-top: 14px;">
                        <template #checked>显示</template>
                        <template #unchecked>隐藏</template>
                    </a-switch>
                </a-tooltip>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import Constant from "@/global/Constant";
import {useErrorStore} from "@/store/components/ErrorStore";

const consoleShow = computed(() => useErrorStore().consoleShow);
const changeConsole = () => useErrorStore().changeConsole();

function openUrl(url: string) {
    utools.shellOpenExternal(url);
}


</script>
<style scoped lang="less">
.about {
    position: relative;
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .logo {
        height: 200px;
    }

    .title {
        font-size: 2em;
        background: linear-gradient(60deg, #E21143, #FFB03A);
        -webkit-background-clip: text;
        color: transparent;
        font-weight: bolder;
        margin-top: 28px;
        user-select: none;

        .version {
            font-size: 0.5em;
        }
    }

    .author {
        margin-top: 14px;
    }


    .desc {
        margin-top: 28px;
        user-select: none;
    }

    .action {
        margin-top: 28px;

        .arco-btn {
            margin: 0 7px;
        }
    }

}
</style>
