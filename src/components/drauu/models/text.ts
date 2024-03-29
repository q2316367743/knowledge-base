import type { Point } from '../types'
import { BaseModel } from './base'

export class TextModel extends BaseModel<SVGTextElement> {

    private div: HTMLDivElement | null = null;
    private input: HTMLInputElement | null = null;

    override onStart(point: Point) {

        const {x, y} = point;
        let el = this.drauu.el;

        this.div = document.createElement('div');
        this.input = document.createElement('input');

        this.div.style.position = 'absolute';
        this.div.style.left = `${x}px`;
        this.div.style.top = `${y}px`;
        this.div.style.zIndex = '999999';
        this.div.style.width = '200px';
        this.div.className = 'arco-input-wrapper'

        const complete = () => {
            if (this.input) {
                const value = this.input.value;
                if (value && value.trim() !== '') {
                    if (el) {
                        const text = this.createElement('text');
                        text.textContent = value;
                        text.setAttribute('x', `${x}`);
                        text.setAttribute('y', `${y}`);
                        text.setAttribute('stroke', 'transparent');
                        text.setAttribute('fill', this.brush.color);
                        text.setAttribute('font-size', `${this.brush.size >= 3 ? (this.brush.size - 2) :  (this.brush.size / 3)}rem`);
                        text.setAttribute('stroke-width', '1');
                        el.appendChild(text);
                        // 触发变更
                        this.drauu.emitChanged();
                    }
                }
            }
            if (el) {
                let parentElement = el.parentElement;
                if (parentElement) {
                    this.removeNonSvgElements(parentElement);
                }
            }
        }

        this.input.className = 'arco-input arco-input-size-medium';
        this.input.onblur = complete;
        this.input.onkeydown = (e) => {
            if (e.code === 'Enter') {
                complete();
            }
        }

        this.div.appendChild(this.input);
        if (el) {
            let parentElement = el.parentElement;
            if (parentElement) {
                parentElement.appendChild(this.div);
                this.input.focus();
            }
        }

        return undefined
    }

    private removeNonSvgElements(parentElement: HTMLElement) {
        const children = parentElement.childNodes;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child instanceof HTMLDivElement) {
                parentElement.removeChild(child);
            }
        }
    }

    override onMove(point: Point) {

        return false;
    }

    override onEnd() {
        return false;

    }
}
