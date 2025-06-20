import {defineStore} from "pinia";
import {Folder} from "@/entity/folder";
import {listToTree} from "@/entity/ListTree";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {group, map} from "@/utils/lang/ArrayUtil";
import {useArticleStore} from "@/store";
import {useAsyncDebounce} from "@/hooks/AsyncDebounce";

export const useFolderStore = defineStore('folder', () => {
  const folders = ref(new Array<Folder>());
  const rev = ref<string>();

  const folderTree = computed(() => listToTree(folders.value, "全部文件夹"));
  const folderIds = computed(() => folders.value.map(folder => folder.id));
  const folderMap = computed<Map<number, Folder>>(() => map(folders.value, 'id'));
  const folderGroupMap = computed(() => group(folders.value, 'pid'));

  async function init() {
    const res = await listByAsync<Folder>(LocalNameEnum.FOLDER);
    folders.value = res.list;
    rev.value = res.rev
  }

  const _sync = useAsyncDebounce(async () => {
    rev.value = await saveListByAsync<Folder>(LocalNameEnum.FOLDER, folders.value, rev.value);
  }, 300);

  async function addFolder(pid: number, name: string) {
    const now = new Date();
    const folder = {
      id: now.getTime(),
      createTime: now,
      updateTime: now,
      name: name,
      pid: pid
    };
    folders.value.push(folder);
    _sync();
    return folder
  }

  async function update(id: number, folder: Partial<Omit<Folder, 'id'>>) {
    const index = folders.value.findIndex(folder => folder.id === id);
    if (index == -1) {
      return Promise.reject(`文件夹【${id}】不存在`)
    }
    folders.value[index] = {
      ...folders.value[index],
      ...folder,
      updateTime: new Date()
    }
    _sync();
    if (typeof folder.fontColor !== 'undefined') {
      if (folder.diffusion) {
        // 把子文件夹都更新一遍
        await useArticleStore().updateMultiIndex((useArticleStore().folderMap.get(id) || [])
          .map(a => ({
            id: a.id,
            fontColor: folder.fontColor
          })))
      }
    }
  }

  async function removeFolder(id: number) {
    const index = folders.value.findIndex(folder => folder.id === id);
    if (index == -1) {
      return Promise.reject(`文件夹【${id}】不存在`)
    }
    folders.value.splice(index, 1);
    _sync();
  }

  async function renameFolder(id: number, name: string) {
    await update(id, {name});
  }

  async function drop(id: number, pid: number) {
    if (pid != 0 && !folderMap.value.has(pid)) {
      return Promise.reject(new Error("父目录错误，无法移动"));
    }
    const index = folders.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("文件夹未找到，请刷新后重试！");
    }
    folders.value[index] = {
      ...folders.value[index],
      pid: pid,
      updateTime: new Date(),
    }
    // 同步
    _sync();
  }

  async function updateMulti(props: Array<Partial<Folder> & { id: number }>) {
    for (let folder of props) {
      const index = folders.value.findIndex(e => e.id === folder.id);
      if (index === -1) {
        continue;
      }
      // 新增索引
      folders.value[index] = {
        ...folders.value[index],
        ...folder,
        updateTime: new Date(),
      };
    }
    // 同步
    _sync();
  }

  return {
    folders, folderTree, folderIds, folderMap, folderGroupMap,
    init, addFolder, update, removeFolder, renameFolder, drop, updateMulti
  }
})