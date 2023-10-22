<template>
    <div class="login">
        <login-docker v-if="Constant.platform === PluginPlatformEnum.DOCKER" />
        <login-utools v-else />
    </div>
</template>
<script lang="ts" setup>
import LoginDocker from "@/pages/login/login-docker.vue";
import Constant from "@/global/Constant";
import PluginPlatformEnum from "@/enumeration/PluginPlatformEnum";
import LoginUtools from "@/pages/login/login-utools.vue";
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
