import LogicFlow from "@logicflow/core";
import {BpmnElement, BpmnXmlAdapter, Menu, MiniMap, SelectionSelect, Snapshot,} from '@logicflow/extension';

export class LogicFlowWrapper {

    readonly lf: LogicFlow;

    private activeNodes = new Array<any>();
    private activeEdges = new Array<any>();
    private properties = {}

    private onResize = (width: number, height: number) => {
    };
    private onSave = (data: any) => {
    };

    constructor(container: HTMLElement, data: any) {
        this.lf = new LogicFlow({
            container: container,
            plugins: [BpmnElement, BpmnXmlAdapter, Snapshot, SelectionSelect, MiniMap, Menu],
            // 其他配置项
            ...(data["config"] || {})
        });
        this.lf.on('selection:selected,node:click,blank:click,edge:click', () => {
            const {nodes, edges} = this.lf.getSelectElements()
            this.activeNodes = nodes
            this.activeEdges = edges
            this.getProperty();
        })
    }

    resize(onResize: (width: number, height: number) => void) {
        this.onResize = onResize;
    }

    save(onSave: (data: any) => void) {
        this.onSave = onSave;
    }

    getProperty() {
        this.properties = {};
        let properties = {}
        const {nodes, edges} = this.lf.getSelectElements()
        nodes.forEach(node => {
            properties = {...properties, ...node.properties}
        })
        edges.forEach(edge => {
            properties = {...properties, ...edge.properties}
        })
        this.properties = properties
    }
}
