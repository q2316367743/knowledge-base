import MindMap from "simple-mind-map";
import {themeList} from '../../constant'
import {Drawer, Image, Link, List, ListItem, Radio, RadioGroup} from "@arco-design/web-vue";
import {computed, ref} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";

export function openMindMapTheme(mindMap: MindMap) {
    const isDark = ref(useGlobalStore().isDark);
    const themes = computed(() => themeList.filter(e => e.dark === isDark.value));

    function setTheme(value: string) {
        mindMap.setTheme(value);
        mindMap.emit('data_change');
    }

    Drawer.open({
        title: () => <RadioGroup type={'button'} v-model={isDark.value}>
            <Radio value={false}>白天</Radio>
            <Radio value={true}>黑夜</Radio>
        </RadioGroup>,
        width: 400,
        footer: false,
        content: () => <List bordered={false}>
            {themes.value.map(theme =>
                <ListItem>
                    <div style={{cursor: "pointer"}} onClick={() => setTheme(theme.value)}>
                        <img style={{width: '323px'}} src={`./mind-map/img/themes/${theme.value}.jpg`} alt={theme.name}/>
                    </div>
                    {theme.name}
                </ListItem>)}
        </List>,
    });
}
