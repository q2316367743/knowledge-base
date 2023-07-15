<template>
    <div class="home">
        <a-row :gutter="7">
            <a-col :span="12">
                <a-card title="快捷工具">
                    <a-button type="primary">
                        新增文章
                    </a-button>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: '',
    data: () => ({

    })
});
</script>
<style scoped>
.home {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    border: 7px;
}
</style>
