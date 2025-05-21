import MindMap from "simple-mind-map";
import {DrawerPlugin, List, ListItem, ListItemMeta} from "tdesign-vue-next";
import {layoutList} from "../../constant";

export function openMindMapLayout(mindMap: MindMap) {

  function setLayout(value: string) {
    mindMap.setLayout(value);
    mindMap.emit('data_change');
  }

  DrawerPlugin({
    header: "布局设置",
    size: '400px',
    footer: false,
    default: () => <List split={true}>
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
