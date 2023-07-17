import {defineStore} from "pinia";
import Zone from "@/entity/zone";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import ZoneContent from "@/entity/zone/ZoneContent";
import {toRaw} from "vue";
import ArticleContent from "@/entity/zone/ZoneContent";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export const useZoneStore = defineStore('zone', {
    state: () => ({
        zones: new Array<Zone>(),
        rev: undefined as string | undefined
    }),
    actions: {
        async init() {
            if (this.zones.length > 0) {
                return Promise.resolve();
            }
            const res = await utools.db.promises.get(LocalNameEnum.ZONE);
            if (res) {
                this.zones = res.value;
                this.rev = res._rev;
            }
        },
        async add(zone: Pick<Zone, 'image' | 'attachments'>, content: ZoneContent) {
            let now = new Date();
            let id = now.getTime();
            // 更新索引
            this.zones.push({
                id: id,
                createTime: now,
                updateTime: now,
                image: toRaw(zone.image),
                attachments: zone.attachments,
                collect: false
            });
            await this._sync()
            // 新增文章内容
            let contentRes = await utools.db.promises.put({
                _id: '/zone/content/' + id,
                value: {
                    id: id + '',
                    tags: toRaw(content.tags),
                    body: content.body,
                    location: content.location
                } as ArticleContent
            });
            if (contentRes.error) {
                // 删除索引
                this.zones.pop();
                await this._sync();
                // TODO: 删除附件
                // 删除图片
                zone.image.forEach(id => utools.db.remove(`/zone/attachment/${id}`));
                // TODO: 获取视频
                // TODO: 获取声音
                return Promise.reject(contentRes.message);
            }
            // 刷新状态
        },
        async remove(id: number) {
            const index = this.zones.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("动态未找到，请刷新后重试！");
            }
            await MessageBoxUtil.confirm("确定删除此动态？删除后无法恢复", "删除动态提示", {
                confirmButtonText: "删除",
                cancelButtonText: "取消"
            })
            let item = this.zones.splice(index, 1)[0];
            await this._sync();
            // 删除内容
            utools.db.remove('/zone/content/' + item.id);
            // TODO: 删除附件
            // 删除图片
            item.image.forEach(image => utools.db.remove(`/zone/attachment/${image.id}`));
            // TODO: 删除视频
            // TODO: 删除声音
            MessageUtil.success("删除成功");
        },
        async _sync() {
            const res = await utools.db.promises.put({
                _id: LocalNameEnum.ZONE,
                _rev: this.rev,
                value: toRaw(this.zones)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        },
    }
})
