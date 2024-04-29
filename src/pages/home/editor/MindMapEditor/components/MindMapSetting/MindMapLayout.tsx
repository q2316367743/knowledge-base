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
                <ListItem>
                    <div style={{cursor: "pointer"}} onClick={() => setLayout(layout.value)}>
                        <img style={{width: '323px'}} src={`./mind-map/img/structures/${layout.value}.png`}
                             alt={layout.name}/>
                    </div>
                    {layout.name}
                </ListItem>)}
        </List>,
    });
}
