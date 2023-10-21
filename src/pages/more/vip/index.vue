<template>
    <div class="vip">
        <a-page-header title="高级版" :show-back="false">
            <template #extra>
                <a-button type="primary" status="success" @click="visible = true" v-if="useVipStore().isNotVip">升级</a-button>
                <a-tooltip content="感谢您的支持" position="bottom" v-else>
                    <a-tag color="green" style="cursor:pointer;">您已开通高级版</a-tag>
                </a-tooltip>
            </template>
        </a-page-header>
        <main class="container">
            <a-table :data="tableData" :pagination="false">
                <template #columns>
                    <a-table-column title="功能" data-index="title"/>
                    <a-table-column title="免费版" data-index="base"/>
                    <a-table-column title="高级版" data-index="vip"/>
                </template>
            </a-table>
            <a-collapse :bordered="false" style="margin-top: 14px">
                <a-collapse-item header="基础功能" key="1">
                    基础功能是指2023年10月18日之前的全部功能
                </a-collapse-item>
                <a-collapse-item header="数据保存到本地" key="2">
                    基础功能是指2023年10月18日之前的全部功能
                </a-collapse-item>
                <a-collapse-item header="合并成书导出" key="3">
                    基础功能是指2023年10月18日之前的全部功能
                </a-collapse-item>
            </a-collapse>
        </main>
        <a-modal v-model:visible="visible" title="开通高级版" ok-text="开通" width="600px" :mask-closable="false" draggable >
            <div class="agreement">
                <a-typography>
                    <a-typography-paragraph style="font-size: 2em;font-weight: bold;text-align: center;">用户协议</a-typography-paragraph>
                    <a-typography-paragraph style="color: red;text-align: center">请认真阅读用户协议后再开通订阅服务！</a-typography-paragraph>
                    <a-typography-paragraph>
                        <ol>
                            <li>本插件的订阅服务仅包括插件功能。</li>
                            <li>本服务为数字产品，请通过普通版进行充分测试后按需购买，完成购买后，恕不接受退款请求。</li>
                            <li>本插件数据完全托管于 uTools 平台，如需进行多设备（同平台）数据同步，请开通 uTools 会员服务。</li>
                            <li>本插件接受任何使用建议和反馈，但最终是否接受相关建议进行调整修改，将由插件作者决定。</li>
                            <li>最终解释权归插件作者所有。</li>
                        </ol>
                    </a-typography-paragraph>
                </a-typography>
            </div>
            <template #footer>
                <a-button type="primary" status="success" @click="openPayment()" >开通</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useVipStore} from "@/store/components/VipStore";

const visible = ref(false);
const isVip = computed(() => useVipStore().isVip);

const tableData = [{
    title: '基础功能',
    base: '✅',
    vip: '✅'
}, {
    title: '数据保存到本地',
    base: '❌',
    vip: '✅'
}, {
    title: '合并成书导出',
    base: '❌',
    vip: '✅'
}, {
    title: '备份到alist',
    base: '❌',
    vip: '✅'
}];

function openPayment() {
    useVipStore().openPayment(() => visible.value = false);
}

</script>
<style lang="less">
.vip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .container {
        position: absolute;
        top: 62px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        overflow: auto;
    }
    .agreement {
        background-color: var(--color-neutral-2);
        padding: 7px;
    }
}
</style>
