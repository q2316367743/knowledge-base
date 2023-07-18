<template>
    <a-typography class="comment">
        <a-typography-title :heading="5" style="margin-left: 14px">全部评论 0</a-typography-title>
        <div class="add">
            <div class="avatar">
                <a-avatar :image-url="admin.avatar" style="margin: 4 16px;"></a-avatar>
            </div>
            <div>
                <a-textarea v-model="comment" :auto-size="{minRows: 3, maxRows: 5}"
                            placeholder="请输入评论（支持markdown）"/>
                <div class="option">
                    <a-button-group type="text">
                        <a-button>
                            <template #icon>
                                <icon-face-smile-fill/>
                            </template>
                            表情
                        </a-button>
                        <a-button>
                            <template #icon>
                                <icon-image/>
                            </template>
                            图片
                        </a-button>
                    </a-button-group>
                    <a-button type="primary">
                        发送
                    </a-button>
                </div>
            </div>
        </div>
        <a-divider />
    </a-typography>
</template>
<script lang="ts" setup>
import {ref} from "vue";

const props = defineProps({
    id: Number
});

const admin = Object.assign({
    avatar: '',
    name: '未知用户'
}, utools.getUser());
const comment = ref('');
</script>
<style scoped>

</style>
