import MindMap from "simple-mind-map";
import {layoutList} from "../../constant";
import {Drawer, Link, List, ListItem} from "@arco-design/web-vue";

export function openMindMapLayout(mindMap: MindMap) {

    function setLayout(value: string) {
        mindMap.setLayout(value);
        mindMap.emit('data_change');
    }

    Drawer.open({
        title: "布局设置",
        width: 400,
        footer: false,
        content: () => <List bordered={false}>
            {layoutList.map(layout =>
                <ListItem><Link onClick={() => setLayout(layout.value)}>{layout.name}</Link></ListItem>)}
        </List>,
    });
}
