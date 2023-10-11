<template>
    <div class="he-preview">
        <kb-article v-if="show" :id="id"/>
    </div>
</template>
<script lang="ts" setup>
import KbArticle from '@/pages/article/index.vue';
import {ref, watch} from "vue";

const props = defineProps({
    id: String
});

const id = ref('');
const show = ref(false);

watch(() => props.id, value => {
    if (value) {
        show.value = false;
        id.value = value;
        show.value = true;
    }
});

if (props.id) {
    show.value = false;
    id.value = props.id;
    show.value = true;
}

</script>
<style scoped>
.he-preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
