import {BaseGraph} from "@/pages/home/layout/editor-content/editor/WhiteboardEditor/components/core/graph/BaseGraph";

export class WhiteboardEngine {

    private readonly canvas: HTMLCanvasElement;
    private readonly shapes: BaseGraph[] = [];

    constructor(el: HTMLCanvasElement) {
        this.canvas = el;
        let parentElement = el.parentElement;
        if (parentElement) {
            this.canvas.width = parentElement.clientWidth * devicePixelRatio;
            this.canvas.height = parentElement.clientHeight * devicePixelRatio;
            this.canvas.style.width = parentElement.clientWidth + 'px';
            this.canvas.style.height = parentElement.clientHeight + 'px';
        }
    }

    resize(width: number, height: number) {
        this.canvas.width = width * devicePixelRatio;
        this.canvas.height = height * devicePixelRatio;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    add(graph: BaseGraph) {
        console.log(graph)
    }

}
