<template>
    <div class="login">
        <div class="container">
            <h1 style="text-align: center;margin-bottom: 24px">请选择存储位置</h1>
            <a-form :model="auth">
                <a-form-item label="类型">
                    <a-radio-group v-model="auth.type" type="button">
                        <a-radio :value="AuthType.UTOOLS">utools</a-radio>
                        <a-radio :value="AuthType.ALIST">AList</a-radio>
                        <a-radio :value="AuthType.WEBDAV" disabled>WebDAV</a-radio>
                        <a-radio :value="AuthType.LOCATION">本地文件夹</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="主机地址" v-if="host">
                    <a-input v-model="auth.host"/>
                </a-form-item>
                <a-form-item label="路径" v-if="path">
                    <a-input v-model="auth.path"/>
                    <template #help>
                        请以/开头，不要以/结尾，如果在根目录，请置空。
                    </template>
                </a-form-item>
                <a-form-item label="用户名" v-if="username">
                    <a-input v-model="auth.username"/>
                </a-form-item>
                <a-form-item :label="passwordLabel" v-if="host">
                    <a-input-password v-model="auth.password"/>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="login()">进入</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {AuthType} from "@/entity/auth";
import {useAuthStore} from "@/store/components/AuthStore";
import MessageUtil from "@/utils/MessageUtil";
import {useRouter} from "vue-router";

const router = useRouter();

const auth = ref(useAuthStore().auth);
const host = computed(() => auth.value.type === AuthType.ALIST ||
    auth.value.type === AuthType.WEBDAV)
const path = computed(() => auth.value.type === AuthType.ALIST ||
    auth.value.type === AuthType.WEBDAV ||
    auth.value.type === AuthType.LOCATION);
const username = computed(() => auth.value.type === AuthType.WEBDAV);
const passwordLabel = computed(() => auth.value.type === AuthType.ALIST ? "TOKEN" : "密码")

useAuthStore().init().then(() => auth.value = useAuthStore().auth);

function login() {
    // 保存
    useAuthStore().save(auth.value)
        .then(() => {
            MessageUtil.success("设置成功");
            router.push('/home');
        })
        .catch(e => MessageUtil.error("设置存储失败", e));
}
</script>
<style lang="less">
.login {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 51;
    background-color: var(--color-bg-1);
    color: var(--color-text-1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .container {
        width: 50vw;
    }
}
</style>
