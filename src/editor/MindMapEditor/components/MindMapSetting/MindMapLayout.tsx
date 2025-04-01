import MindMap from "simple-mind-map";
import {Drawer} from "@arco-design/web-vue";
import {List, ListItem, ListItemMeta} from "tdesign-vue-next";
import {layoutList} from "../../constant";

export function openMindMapLayout(mindMap: MindMap) {

  function setLayout(value: string) {
    mindMap.setLayout(value);
    mindMap.emit('data_change');
  }

  Drawer.open({
    title: "布局设置",
    width: 400,
    footer: false,
    content: () => <List split={true}>
      {layoutList.map(layout =>
        <ListItem>
          <ListItemMeta>{{
            title: () => <div> {layout.name}</div>,
            description: () => <div style={{cursor: "pointer"}} onClick={() => setLayout(layout.value)}>
              <img style={{width: '323px'}} src={`./mind-map/img/structures/${layout.value}.png`}
                   alt={layout.name}/>
            </div>
          }}</ListItemMeta>
        </ListItem>)}
    </List>,
  });
}
