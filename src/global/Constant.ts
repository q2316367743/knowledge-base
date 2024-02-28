import UpdateLog from "@/global/UpdateLog";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";

export default {
    uid: 'zdllh16g',
    id: 'knowledge-base',
    name: '知识库',
    version: UpdateLog[0].version,
    author: '落雨不悔',
    platform: import.meta.env.VITE_PLATFORM as PlatformTypeEnum,
    website: 'https://blog.esion.xyz',
    homepage: 'https://txc.qq.com/products/612648',
    repo: 'https://gitee.com/qiaoshengda/knowledge-base',
    online: 'https://blog.esion.xyz/apps/knowledge-base',
    updateLog: UpdateLog[0].url || '',
    statistics: "http://project-esion.nat300.top/webhook/5e512530-23e3-4bf4-8fa7-1720da99a6b6",
    feature: {
        ADD: 'function:add-article',
        IMPORT: 'function:md-import',
        TODO_CATEGORY: 'todo:'
    },
    autoCollapsedWidth: 1080,
    goodsId: 'nrniJTkDF7bjDosiki1vjXxAxGNbUsG6'
}
