import {TextNode, TextNodeModel} from '@logicflow/core'
import {getShapeStyleFunction, getTextStyleFunction} from '../getShapeStyleUtil'

// 文本节点
class TextNewNode extends TextNode {
}

class TextNewModel extends TextNodeModel {
    getNodeStyle() {
        const style = super.getNodeStyle()
        const properties = this.getProperties()
        return getShapeStyleFunction(style, properties)
    }

    getTextStyle() {
        const style = super.getTextStyle()
        const properties = this.getProperties()
        if (properties.backgroundColor) {
            style.backgroundStyle = {
                fill: 'var(--td-bg-color-component);',
            }
        }
        return getTextStyleFunction(style, {
            ...properties,
            fontColor: 'var(--td-text-color-primary)'
        })
    }

    setAttributes() {
        super.setAttributes()
        if (!this.text.value) {
            this.text.value = 'text'
        }
    }
}

export default {
    type: 'pro-text',
    tip: '文本',
    view: TextNewNode,
    model: TextNewModel
}
