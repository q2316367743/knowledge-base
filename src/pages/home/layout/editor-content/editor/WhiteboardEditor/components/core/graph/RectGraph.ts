import {BaseGraph} from "@/pages/home/layout/editor-content/editor/WhiteboardEditor/components/core/graph/BaseGraph";

export class RectGraph implements BaseGraph {

    private readonly startX: number;
    private readonly startY: number;
    private readonly endX: number;
    private readonly endY: number;

    constructor(startX: number, startY: number) {
        this.startX = startX;
        this.startY = startY;
        this.endX = startX;
        this.endY = startY;
    }

    get minX() {
        return Math.min(this.startX, this.endX);
    }

    get minY() {
        return Math.min(this.startY, this.endY);
    }

    get maxX() {
        return Math.max(this.startX, this.endX);
    }

    get maxY() {
        return Math.max(this.startY, this.endY);
    }

    draw() {

    }

}
