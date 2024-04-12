import {createApp, onMounted, onUnmounted, ref, shallowRef} from "vue";
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
                    editor.value = buildRickText(editorRef, value => {
                        todoItem.value.content.record.content = value;
                    });
                    editor.value.setHtml(res.content.record.content);
                });
            });

            onUnmounted(() => {
                editor.value && editor.value.destroy();
            })

            function onSave() {
                loading.value = true;
                useTodoStore().updateContent(id, todoItem.value.index, {
                    content: todoItem.value.content.record.content
                })
                    .then(() => {
                        MessageUtil.success("保存成功")
                        onClose();
                    })
                    .catch(e => MessageUtil.error("保存失败", e))
                    .finally(() => loading.value = false);
            }


            return () => <div class={'card-todo-info'}>
                <div class={'header'}>
                    <Button type={'text'} onClick={onClose} loading={loading.value}>
                        {{
                            icon: () => <IconLeft/>
                        }}
                    </Button>
                    <Input allowClear v-model={todoItem.value.index.title} disabled={loading.value}/>
                    <Button type={'text'} style={{marginLeft: '7px'}} onClick={onSave}
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
