import MindMap from "simple-mind-map";
import {Drawer} from "@arco-design/web-vue";
import {List, ListItem, ListItemMeta, RadioButton, RadioGroup} from "tdesign-vue-next";
import {themeList} from '../../constant'
import {useGlobalStore} from "@/store/GlobalStore";

export function openMindMapTheme(mindMap: MindMap) {
  const isDark = ref(useGlobalStore().isDark);
  const themes = computed(() => themeList.filter(e => e.dark === isDark.value));

  function setTheme(value: string) {
    mindMap.setTheme(value);
    mindMap.emit('data_change');
  }

  Drawer.open({
    title: () => <RadioGroup variant={'primary-filled'} v-model={isDark.value}>
      <RadioButton value={false}>白天</RadioButton>
      <RadioButton value={true}>黑夜</RadioButton>
    </RadioGroup>,
    width: 400,
    footer: false,
    content: () => <List split={true}>
      {themes.value.map(theme =>
        <ListItem>
          <ListItemMeta>{{
            title: () => <div>{theme.name}</div>,
            description: () => <div style={{cursor: "pointer"}} onClick={() => setTheme(theme.value)}>
              <img style={{width: '323px'}} src={`./mind-map/img/themes/${theme.value}.jpg`} alt={theme.name}/>
            </div>
          }}</ListItemMeta>
        </ListItem>)}
    </List>,
  });
}
