import {defineStore} from "pinia";
import {getDefaultZoneBase, ZoneBase, ZoneContent, ZoneIndex, ZonePreview} from "@/entity/zone";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import md from "@/plugin/sdk/markdown";
import {
    getFromOneWithDefaultByAsync,
    listByAsync,
    removeOneByAsync,
    saveListByAsync,
    saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import {clone} from "xe-utils";

export const useZoneStore = defineStore('zone', {
    state: () => ({
        value: new Array<ZoneIndex>(),
        rev: undefined as string | undefined
    }),
    getters: {
        zones: state => state.value.sort((a, b) => b.id - a.id)
    },
    actions: {
        async init() {
            const res = await listByAsync(LocalNameEnum.ZONE);
            this.rev = res.rev;
            this.value = res.list;
        },
        addSimple(content: string): Promise<ZoneIndex> {
            return this.add({
                image: [],
                attachments: [],
                tags: [],
                location: ''
            }, {
                body: content
            })
        },
        async add(base: ZoneBase, content: ZoneContent): Promise<ZoneIndex> {
            let now = new Date();
            let id = now.getTime();
            // 更新索引
            const zoneIndex = {
                id: id,
                createTime: now,
                updateTime: now,
            };
            this.value.push(zoneIndex);
            await this._sync();
            // 新增基础信息
            await saveOneByAsync(LocalNameEnum.ZONE_BASE + id, clone(base, true));

            // 新增文章内容
            await saveOneByAsync(
                LocalNameEnum.ZONE_CONTENT + id,
                {
                    body: content.body,
                } as ZoneContent);
            // 新增文章预览
            await saveOneByAsync(
                LocalNameEnum.ZONE_PREVIEW + id,
                {
                    html: md.render(content.body)
                } as ZonePreview
            );
            return Promise.resolve(zoneIndex);
        },
        async remove(id
                         :
                         number
        ) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("动态未找到，请刷新后重试！");
            }
            await MessageBoxUtil.confirm("确定删除此动态？删除后无法恢复", "删除动态提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消"
            })
            this.value.splice(index, 1);
            await this._sync();
            // 删除基本信息
            const baseWrap = await getFromOneWithDefaultByAsync(LocalNameEnum.ZONE_BASE + id, getDefaultZoneBase());
            await removeOneByAsync(LocalNameEnum.ZONE_BASE + id, true);
            //  删除附件
            if (baseWrap) {
                const base = baseWrap.record;
                for (let image of base.image) {
                    await removeOneByAsync(LocalNameEnum.ZONE_ATTACHMENT + image.id, true)
                }
            }
            // 删除内容
            await removeOneByAsync(LocalNameEnum.ZONE_CONTENT + id, true);
            // 删除预览
            await removeOneByAsync(LocalNameEnum.ZONE_PREVIEW + id, true);
        }
        ,
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.ZONE, this.value, this.rev);
        }
        ,
        async page(num
                       :
                       number, size
                       :
                       number
        ):
            Promise<Array<ZoneIndex>> {
            const startIndex = Math.max((num - 1) * size, 0);
            const endIndex = Math.min(num * size, this.value.length);
            if (startIndex > endIndex
            ) {
                return Promise.resolve([]);
            }
            return Promise.resolve(this.zones.slice(startIndex, endIndex));
        }
    }
})
