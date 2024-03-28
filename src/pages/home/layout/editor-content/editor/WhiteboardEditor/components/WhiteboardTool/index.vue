<template>
    <div class="leafer-tool">
        <a-radio-group v-model="mode">
            <a-radio value='select'>
                <icon-fullscreen />
            </a-radio>
            <a-radio value='rect'>
                <icon-record />
            </a-radio>
        </a-radio-group>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {LeaferToolMode} from "./types";


const mode = ref<LeaferToolMode>('select');

</script>
<style scoped>
.leafer-tool {
    position: absolute;
    top: 20px;
    left: 40px;
}
</style>
