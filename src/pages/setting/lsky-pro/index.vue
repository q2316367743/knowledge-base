<template>
    <div class="lsky-pro">
        <a-tabs v-model:active-key="activeKey" hide-content>
            <a-tab-pane key="1" title="上传文件"/>
            <a-tab-pane key="2" title="我的图片" :disabled="disabled"/>
            <a-tab-pane key="3" title="其他工具" :disabled="disabled"/>
            <template #extra>
                <a-button type="text" v-if="disabled" style="margin-right: 7px;" @click="login()">登录</a-button>
                <a-dropdown v-else-if="isLogin">
                    <a-button type="text">
                        <a-avatar :image-url="avatar" :size="32"/>
                        <span style="margin: 0 7px">{{ username }}</span>
                    </a-button>
                    <template #content>
                        <a-doption>清空token</a-doption>
                        <a-doption @click="logout()">注销</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown v-else style="margin-right: 7px;">
                    <a-button type="text">匿名登录</a-button>
                    <template #content>
                        <a-doption @click="login()">登录</a-doption>
                        <a-doption @click="logout()">注销</a-doption>
                    </template>
                </a-dropdown>
            </template>
        </a-tabs>
        <main class="container">
            <lsky-pro-image v-if="activeKey === '2'" />
        </main>
        <a-modal v-model:visible="auth.visible" title="登录">
            <a-form :model="auth" layout="vertical">
                <a-form-item label="服务器地址">
                    <a-input v-model="auth.url"/>
                </a-form-item>
                <a-form-item label="邮箱">
                    <a-input v-model="auth.email"/>
                </a-form-item>
                <a-form-item label="密码">
                    <a-input-password v-model="auth.password"/>
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button type="dashed" @click="anonymous()">匿名登录</a-button>
                <a-button type="primary" @click="submit()">登录</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import LskyProImage from "@/pages/setting/lsky-pro/components/lsky-pro-image.vue";

const activeKey = ref('1');
const auth = ref({
    visible: false,
    url: '',
    email: '',
    password: ''
})

const disabled = computed(() => !useLskyProSettingStore().isAvailable);
const isLogin = computed(() => useLskyProSettingStore().isLogin);
const username = computed(() => useLskyProSettingStore().username);
const avatar = computed(() => useLskyProSettingStore().avatar);


function login() {
    auth.value = {
        ...useLskyProSettingStore().option,
        visible: true,
    };
}

function anonymous() {
    useLskyProSettingStore().anonymous(auth.value)
        .then(() => {
            MessageUtil.success("登录成功");
            auth.value.visible = false;
        })
        .catch(e => MessageUtil.error("登录失败", e))

}

function submit() {
    useLskyProSettingStore().login(auth.value)
        .then(() => {
            MessageUtil.success("登录成功");
            auth.value.visible = false;
        })
        .catch(e => MessageUtil.error("登录失败", e))
}

function logout() {
    MessageBoxUtil.confirm("是否注销登录", "注销登录")
        .then(() => {
            useLskyProSettingStore().logout()
                .then(() => MessageUtil.success("注销成功"))
                .catch(e => MessageUtil.error("注销失败", e));
        })

}
</script>
<style scoped lang="less">
.lsky-pro {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .container {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 7px;
    }
}
</style>
