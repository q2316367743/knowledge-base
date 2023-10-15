import UpdateLog from "@/global/UpdateLog";

export default {
    uid: 'zdllh16g',
    id: 'knowledge-base',
    name: '知识库',
    version: UpdateLog[0].version,
    author: '落雨不悔',
    website: 'https://blog.esion.xyz',
    homepage: 'https://flowus.cn/esion/share/3f990895-e56a-4693-8e0f-5ab2998a1039',
    repo: 'https://gitee.com/qiaoshengda/knowledge-base',
    online: 'https://blog.esion.xyz/apps/knowledge-base',
    updateLog: UpdateLog[0].url || '',
    statistics: "http://project-esion.nat300.top",
    feature: {
        ADD: 'function:add-article',
        IMPORT: 'function:md-import',
        ADD_ZONE: 'function:add-zone',
        TODO_CATEGORY: 'todo:'
    },
    autoCollapsedWidth: 1080
}
