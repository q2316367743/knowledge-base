<template>
    <div class="container">
        <h1 style="text-align: center;margin-bottom: 24px">请输入token</h1>
        <a-form :model="auth">
            <a-form-item label="token" >
                <a-input-password v-model="auth.password"/>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="login()">进入</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useAuthStore} from "@/store/components/AuthStore";
import MessageUtil from "@/utils/MessageUtil";
import {useRouter} from "vue-router";

const router = useRouter();

const auth = ref(useAuthStore().auth);

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
<style scoped>

</style>
