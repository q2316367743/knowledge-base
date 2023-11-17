<template>
    <a-dropdown position="bl">
        <a-button type="primary" title="切换工作空间">
            <template #icon>
                <es-icon :icon="true" :type="type"/>
            </template>
        </a-button>
        <template #content>
            <a-doption @click="clearDriver()">
                <template #icon>
                    <icon-close/>
                </template>
                <span>清空</span>
            </a-doption>

            <a-doption v-for="driver in drivers" :key="driver.id" :disabled="driver.id === driverId"
                       @click="setDriverId(driver.id)">
                <template #icon>
                    <es-icon :type="driver.type"/>
                </template>
                <span>{{ driver.name }}</span>
            </a-doption>
        </template>
        <template #footer>
            <a-button type="text" long @click="visible = true">管理</a-button>
        </template>
    </a-dropdown>
    <a-modal v-model:visible="visible" title="管理工作空间" :footer="false" draggable class="es-workspace-model"
             width="700px">
        <a-button type="primary" style="margin-bottom: 7px;" @click="addDriver()">新增</a-button>
        <a-table :data="drivers">
            <template #columns>
                <a-table-column data-index="type" title="类型" :width="60">
                    <template #cell="{ record }">
                        <es-icon :type="record.type"/>
                    </template>
                </a-table-column>
                <a-table-column data-index="name" title="名称"/>
                <a-table-column data-index="path" title="地址"/>
                <a-table-column title="操作" :width="150">
                    <template #cell="{ record }">
                        <a-button-group type="primary">
                            <a-button status="success" :disabled="record.id === driverId" @click="updateDriver(record)">
                                编辑
                            </a-button>
                            <a-popconfirm content="确认删除此工作空间？" @ok="removeDriver(record)" ok-text="删除">
                                <a-button status="danger">删除</a-button>
                            </a-popconfirm>
                        </a-button-group>
                    </template>
                </a-table-column>
            </template>
        </a-table>
    </a-modal>
    <a-modal v-model:visible="editDriver.visible" :title="(editDriver.id === 0 ? '新增' : '修改') + '工作空间'"
             draggable :ok-text="editDriver.id === 0 ? '新增' : '修改'" @ok="submitDriver()">
        <a-form :model="editDriver.record" layout="vertical">
            <a-form-item label="类型">
                <a-radio-group v-model="editDriver.record.type">
                    <a-radio :value="EditorDriverTypeEnum.LOCAL">本地</a-radio>
                    <a-radio :value="EditorDriverTypeEnum.GITEE" disabled>Gitee</a-radio>
                    <a-radio :value="EditorDriverTypeEnum.GITHUB" disabled>GitHub</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="名称">
                <a-input v-model="editDriver.record.name" allow-clear/>
            </a-form-item>
            <a-form-item label="地址">
                <a-input v-model="editDriver.record.path" allow-clear>
                    <template #append>
                        <a-button type="text" @click="chooseFile()"
                                  v-if="editDriver.record.type === EditorDriverTypeEnum.LOCAL">
                            <template #icon>
                                <icon-file/>
                            </template>
                        </a-button>
                    </template>
                </a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import EsIcon from "@/pages/editor/components/editor-side/es-icon.vue";
import {EditorDriver, getDefaultEditorDriver} from "@/entity/editor/EditorDriver";
import EditorDriverTypeEnum from "@/enumeration/EditorDriverTypeEnum";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

const visible = ref(false);
const editDriver = ref({
    visible: false,
    id: 0,
    record: getDefaultEditorDriver()
})

const drivers = computed(() => useEditorDriverStore().drivers);
const driverId = computed(() => useEditorDriverStore().driverId);
const type = computed(() => {
    if (driverId.value > 0) {
        for (let valueElement of drivers.value) {
            if (valueElement.id === driverId.value) {
                return valueElement.type;
            }
        }
    }
    return undefined;
})

function addDriver() {
    editDriver.value = {
        visible: true,
        id: 0,
        record: getDefaultEditorDriver()
    }
}

function updateDriver(driver: EditorDriver) {
    editDriver.value = {
        visible: true,
        id: driver.id,
        record: driver
    }
}

function submitDriver() {
    if (editDriver.value.id === 0) {
        // 新增
        useEditorDriverStore().add(editDriver.value.record)
                .then(() => MessageUtil.success("新增成功"))
                .catch(e => MessageUtil.error("新增失败", e));
    } else {

        useEditorDriverStore().update(editDriver.value.id, editDriver.value.record)
                .then(() => MessageUtil.success("更新成功"))
                .catch(e => MessageUtil.error("更新失败", e));
    }
}

function removeDriver(driver: EditorDriver) {
    MessageBoxUtil.confirm(`确认删除工作空间【${driver.name}】？`, "删除工作空间", {
        confirmButtonText: "删除"
    }).then(() => useEditorDriverStore().remove(driver.id)
            .then(() => MessageUtil.success("删除成功"))
            .catch(e => MessageUtil.error("删除失败", e)));
}

function chooseFile() {
    const paths = utools.showOpenDialog({
        title: "选择目录",
        properties: ['openDirectory', "createDirectory"],
        buttonLabel: "选择"
    });
    if (paths && paths.length > 0) {
        editDriver.value.record.path = paths[0];
    }
}

function setDriverId(driverId: number) {
    useEditorDriverStore().setEditorDriver(driverId)
            .then(() => MessageUtil.success("切换工作空间成功"))
            .catch(e => MessageUtil.error("切换工作空间失败", e))
}
function clearDriver() {
    useEditorDriverStore().clear();
    MessageUtil.success("切换工作空间成功")
}


</script>
<style lang="less">
.es-workspace-model {
    .arco-modal-body {
        max-height: 50vh;
        overflow-y: auto;
    }
}
</style>
