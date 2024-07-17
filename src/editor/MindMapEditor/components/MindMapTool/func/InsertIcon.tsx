import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {Checkbox, CheckboxGroup, Divider, Drawer} from "@arco-design/web-vue";
import {ref, watch} from "vue";
import styled from "vue3-styled-components";
import {nodeIconList} from "@/editor/MindMapEditor/config/icons";

const IconDiv = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 50%;
    overflow: hidden;
    padding: 4px;
`;


export function openInsertIcon(activeNodes: MindMapNode[]) {
    if (activeNodes.length === 0) {
        return;
    }

    const iconList = ref<Array<string>>(activeNodes
        .flatMap(activeNode => activeNode.getData('icon') || [])
    );

    watch(() => iconList.value, value => {
        activeNodes.forEach(activeNode => activeNode.setIcon(value))
    });

    function getHtml(icon: string): string {
        return /^<svg/.test(icon) ? icon : `<img src="${icon}" alt="图标"/>`
    }

    Drawer.open({
        title: '图标',
        width: 400,
        footer: false,
        content: () =>
            <div>
                {nodeIconList.map(g => <div style={{
                    display: "flex",
                    flexWrap: "wrap"
                }}>
                    <Divider>{g.name}</Divider>
                    <CheckboxGroup v-model={iconList.value}>
                        {g.list.map(i => <Checkbox value={g.type + '_' + i.name}>
                            {{
                                checkbox: (res: { checked: boolean }) => <IconDiv style={{
                                    border: '1px solid ' + (res.checked ? 'rgb(var(--arcoblue-6))' : 'transparent')
                                }}>
                                    <div key={i.name} innerHTML={getHtml(i.icon)} class={{
                                        selected: res.checked
                                    }}></div>
                                </IconDiv>
                            }}
                        </Checkbox>)}
                    </CheckboxGroup>
                </div>)}
            </div>
    })
}
