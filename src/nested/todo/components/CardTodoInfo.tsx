import {createApp, onMounted, ref, shallowRef, watch} from "vue";
import {Button, Input} from "@arco-design/web-vue";
import {IconLeft, IconSave} from "@arco-design/web-vue/es/icon";
import {useTodoStore} from "@/store/components/TodoStore";
import {getDefaultTodoItem} from "@/entity/todo/TodoItem";
import {buildRickText} from "@/nested/note/func";
import {IDomEditor} from "@wangeditor/editor";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openCardTodoInfo(id: number) {
    const element = document.createElement('div');
    document.body.appendChild(element);


    function onClose() {
        app.unmount();
        element.remove();
    }

    const app = createApp({
        setup() {

            const editorRef = ref();
            const loading = ref(false);
            const todoItem = ref(getDefaultTodoItem());
            const editor = shallowRef<IDomEditor>()


            onMounted(() => {
                useTodoStore().getTodoItem(id).then(res => {
                    todoItem.value = res;
                    editor.value = buildRickText(editorRef);
                    editor.value.setHtml(res.content.record.content);
                });
            })

            function onSave() {
                // TODO: 更新内容
                MessageUtil.success("保存成功")
                onClose();
            }


            return () => <div class={'card-todo-info'}>
                <div class={'header'}>
                    <Button size={'mini'} type={'text'} onClick={onClose} loading={loading.value}>
                        {{
                            icon: () => <IconLeft/>
                        }}
                    </Button>
                    <Input allowClear size={'mini'} v-model={todoItem.value.index.title} disabled={loading.value}/>
                    <Button size={'mini'} type={'text'} style={{marginLeft: '7px'}} onClick={onSave}
                            loading={loading.value}>
                        {{
                            icon: () => <IconSave/>
                        }}
                    </Button>
                </div>
                <div class={'container kb-wang-editor'}>
                    <div class={'editor'} ref={editorRef}/>
                </div>
            </div>
        },
    });

    app.mount(element);

}
