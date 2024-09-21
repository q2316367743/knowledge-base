import {LogicFlow} from "@logicflow/core";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";
import MessageUtil from "@/utils/modal/MessageUtil";
import {LogicFlowOption} from "@/editor/LogicFlow/components/LogicFlowOption";
import {Options as LFOptions} from "@logicflow/core/src/options";

/**
 * 导出流程图
 * @param id 触发的ID
 * @param articleId 文章ID
 * @param lf 流程图实例
 */
export function onLogicFlowExport(id: number, articleId: number, lf?: LogicFlow) {
    if (articleId !== id) {
        return;
    }
    createArticleExport(id, [{
        key: 1,
        name: '图片',
        desc: '暂不支持'
    }]).then(res => {
        if (!lf){
            MessageUtil.error('请先创建流程图！');
            return;
        }
        if (res.type === 1) {
            // 导出图片
            lf.getSnapshot()
        }
    })
}

export function buildLogicFlowConfigFromOptions(options: LogicFlowOption): Omit<LFOptions.Common, 'container'> {
    if (options.grid === 'dot' || options.grid === 'mesh') {
        return {
            grid: {
                type: options.grid,
                size: options.gridSize,
                visible: options.gridVisible,
                config: {
                    color: options.gridConfigColor,
                    thickness: options.gridConfigThickness,
                }
            },
        }
    }
    return  {
        grid: false
    }
}
