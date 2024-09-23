import {LogicFlow} from "@logicflow/core";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";
import MessageUtil from "@/utils/modal/MessageUtil";
import {LogicFlowOption} from "@/editor/LogicFlow/components/LogicFlowOption";
import {Options as LFOptions} from "@logicflow/core/src/options";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {Button, Modal, Space, Typography, TypographyParagraph, TypographyTitle} from "@arco-design/web-vue";

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
        if (!lf) {
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
    return {
        grid: false
    }
}

export function firstUseLogicFlow() {
    const res = utools.dbStorage.getItem(LocalNameEnum.FIRST_USE_LOGIC_FLOW) as boolean;
    if (!res) {
        // 第一次使用

        // 永远关闭
        function onClose() {
            utools.dbStorage.setItem(LocalNameEnum.FIRST_USE_LOGIC_FLOW, true);
            modalReturn.close();
        }

        // 关闭一次
        function onCancel() {
            modalReturn.close();
        }

        // 提示
        const modalReturn = Modal.open({
            title: '欢迎使用流程图',
            draggable: true,
            content: () => <Typography>
                <TypographyParagraph>欢迎使用流程图笔记，本流程图笔记基于LogicFlow开发。</TypographyParagraph>
                <TypographyTitle heading={3}>* 特别注意</TypographyTitle>
                <TypographyParagraph>
                    <ol>
                        <li>
                            <span>由于流程图数据十分复杂，所以</span>
                            <span class={'color-red'}>不支持自动保存</span>
                            <span>，请</span>
                            <span class={'color-red'}>点击又上角</span>
                            <span>或</span>
                            <span class={'color-red'}>按下Ctrl+S</span>
                            <span>手动保存，以防止数据丢失。</span>
                        </li>
                        <li>默认背景为自适应背景色，可以在左下角【更多】-【功能配置】中设置为点状图或网格图。</li>
                        <li>左侧有四组图形：【基础节点】、【基础图形】、【箭头】、【流程图】，
                            鼠标移到分组上会显示该分组的全部图形，
                            <span class={'color-red'}>拖拽图形到画布上即可创建流程图</span>。
                        </li>
                        <li>右下角小地图可以在【更多】-【功能配置】中关闭。</li>
                        <li>【更多】-【编辑配置】中修改后记得点击【保存】按钮生效。</li>
                        <li>点击单个图形或框选多个图形，右侧的属性面板会显示该图形的属性，可以修改图形的颜色、字体、样式等。</li>
                    </ol>
                </TypographyParagraph>
            </Typography>,
            footer: () => <Space>
                <Button onClick={onCancel}>关闭一次</Button>
                <Button type="primary" onClick={onClose}>永久关闭</Button>
            </Space>
        });
    }
}
