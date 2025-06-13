import {DrawerPlugin, List, ListItem, ListItemMeta, Tag} from "tdesign-vue-next";
import {useAiServiceStore} from "@/store";

export function showUtoolsModel() {
  const {innerAiService} = useAiServiceStore()
  if (!innerAiService) return;
  DrawerPlugin({
    header: 'uTools服务',
    footer: false,
    size: '800px',
    closeBtn: true,
    default: () => <List split={true}>
      {innerAiService.models.map(model => <ListItem>{{
        default: () => <ListItemMeta avatar={model.icon} title={model.label} description={model.description}/>,
        action: () => <Tag theme={'success'}>{model.cost} 能量</Tag>
      }}</ListItem>)}
    </List>
  })
}