<template>
    <div class="more-setting-image">
        <a-form :model="instance" layout="vertical">
            <a-form-item label="图片上传策略">
                <a-radio-group v-model="instance.imageStrategy">
                    <a-radio :value="ImageStrategyEnum.NONE" :disabled="isUtools">未设置</a-radio>
                    <a-radio :value="ImageStrategyEnum.INNER" :disabled="!isUtools">内部实现</a-radio>
                    <a-radio :value="ImageStrategyEnum.IMAGE" :disabled="!isUtools">插件【图床】</a-radio>
                    <a-radio :value="ImageStrategyEnum.LSKY_PRO" :disabled="!isAvailable">兰空图床(推荐)</a-radio>
                </a-radio-group>
                <template #help>
                    <span v-if="instance.imageStrategy === ImageStrategyEnum.INNER">
                        上传到插件内部，占用个人存储空间，最大图片仅支持10m
                    </span>
                    <span v-else-if="instance.imageStrategy === ImageStrategyEnum.IMAGE">
                        需要安装插件【图床】
                    </span>
                    <span v-else-if="instance.imageStrategy === ImageStrategyEnum.LSKY_PRO">
                        推荐使用，需要自己部署图床服务器
                    </span>
                </template>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="save()">保存</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {clone} from "xe-utils";
import {useImageSettingStore} from "@/store/setting/ImageSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import {isUtools} from "@/global/BeanFactory";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";

const router = useRouter();

const instance = ref(clone(useImageSettingStore().imageSetting, true));
const isAvailable = computed(() => useLskyProSettingStore().isAvailable);

function save() {
    // 校验图床
    if (instance.value.imageStrategy === ImageStrategyEnum.LSKY_PRO) {
        if (!useLskyProSettingStore().isAvailable) {
            MessageBoxUtil.confirm("检测到您未配置兰空图床，是否立即前往配置?", "错误")
                .then(() => router.push("/setting/lsky-pro"))
            return;
        }
    }
    useImageSettingStore().save(instance.value)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
}
</script>
<style scoped>
.more-setting-image {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
    overflow: auto;
}
</style>
