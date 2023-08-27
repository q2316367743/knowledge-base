import {defineStore} from "pinia";
import {ZoneBase, ZoneContent, ZoneIndex, ZonePreview} from "@/entity/zone";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import md from "@/plugin/markdown";

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
            if (this.value.length > 0) {
                return Promise.resolve();
            }
            const res = await utools.db.promises.get(LocalNameEnum.ZONE);
            if (res) {
                const value: Array<ZoneIndex> = res.value;
                this.rev = res._rev;
                this.value = value;
            }
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
            let baseRes = await utools.db.promises.put({
                _id: LocalNameEnum.ZONE_BASE + id,
                value: JSON.parse(JSON.stringify(base))
            });
            if (baseRes.error) {
                this.value.pop();
                await this._sync();
                return Promise.reject("新增基础信息异常：" + baseRes.message)
            }

            // 新增文章内容
            let contentRes = await utools.db.promises.put({
                _id: LocalNameEnum.ZONE_CONTENT + id,
                value: {
                    body: content.body,
                } as ZoneContent
            });
            if (contentRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                // 删除基础信息
                await utools.db.promises.remove(LocalNameEnum.ZONE_BASE + id);
                return Promise.reject("新增文章内容异常：" + contentRes.message);
            }
            // 新增文章预览
            let previewRes = await utools.db.promises.put({
                _id: LocalNameEnum.ZONE_PREVIEW + id,
                value: {
                    html: md.render(content.body)
                } as ZonePreview
            });
            if (previewRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                // 删除基础信息
                await utools.db.promises.remove(LocalNameEnum.ZONE_BASE + id);
                // 删除内容
                await utools.db.promises.remove(LocalNameEnum.ZONE_CONTENT + id)
                return Promise.reject("新增文章预览异常：" + previewRes.message);
            }
            return Promise.resolve(zoneIndex);
        },
        async remove(id: number) {
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
            const baseWrap = await utools.db.promises.get(LocalNameEnum.ZONE_BASE + id);
            await utools.db.promises.remove(LocalNameEnum.ZONE_BASE + id);
            //  删除附件
            if (baseWrap) {
                const base = baseWrap.value as ZoneBase;
                base.image.forEach(image => utools.db.remove(LocalNameEnum.ZONE_ATTACHMENT + image.id));
            }
            // 删除内容
            await utools.db.promises.remove(LocalNameEnum.ZONE_CONTENT + id);
            // 删除预览
            await utools.db.promises.remove(LocalNameEnum.ZONE_PREVIEW + id);
        },
        async _sync() {
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.ZONE,
                _rev: this.rev,
                value: toRaw(this.value)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        },
        async page(num: number, size: number): Promise<Array<ZoneIndex>> {
            const startIndex = Math.max((num - 1) * size, 0);
            const endIndex = Math.min(num * size, this.value.length);
            if (startIndex > endIndex) {
                return Promise.resolve([]);
            }
            return Promise.resolve(this.zones.slice(startIndex, endIndex));
        }
    }
})
