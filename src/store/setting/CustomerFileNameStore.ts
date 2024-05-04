import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref} from "vue";
import {CustomerFileNameSetting} from "@/entity/setting/CustomerFileNameSetting";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {useFolderStore} from "@/store/db/FolderStore";
import {map} from "@/utils/lang/ArrayUtil";

let isInit = false;

export const useCustomerFileNameStore = defineStore(LocalNameEnum.SETTING_CUSTOMER_FILE_NAME, () => {
    const customerFileNames = ref<Array<CustomerFileNameSetting>>([])
    let rev: string | undefined = undefined;

    const customerFileNameMap = computed(() => map(customerFileNames.value, 'folderId'))

    async function init() {
        if (isInit) {
            return;
        }
        isInit = true;
        const res = await getFromOneByAsync(LocalNameEnum.SETTING_CUSTOMER_FILE_NAME);
        if (res.record) {
            customerFileNames.value = res.record;
        }
        rev = res.rev;
        return customerFileNames.value
    }

    async function save(res: Array<CustomerFileNameSetting>) {
        // 数据校验
        const {folderMap} = useFolderStore();

        for (let i = 0; i < res.length; i++) {
            const e = res[i];
            if (!folderMap.has(e.folderId)) {
                return Promise.reject(new Error(`第${i + 1}个规则未配置文件夹`))
            }
            for (let j = i + 1; j < res.length; j++) {
                // 判断是否有重复的
                if (res[j] && res[i].folderId === res[j].folderId) {
                    return Promise.reject(new Error(`第${i + 1}个规则和第${j + 1}配置的文件夹重复`))
                }

            }
        }


        customerFileNames.value = res;

        rev = await saveOneByAsync(LocalNameEnum.SETTING_CUSTOMER_FILE_NAME, customerFileNames.value, rev);


    }

    return {
        customerFileNames, customerFileNameMap,
        init, save
    }


})
