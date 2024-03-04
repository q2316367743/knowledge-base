import MindMap from "simple-mind-map";
import {Input, InputGroup, Modal} from "@arco-design/web-vue";
import {ref} from "vue";

export function openMindMapExport(mindMap: MindMap) {
    const title = ref('');
    Modal.open({
        title: '导出',
        draggable: true,
        content: () => <div>
            <InputGroup>
                <span style="width: 140px">导出文件名称</span>
                <Input size={'mini'} v-model={title.value}/>
            </InputGroup>
        </div>
    })
}
