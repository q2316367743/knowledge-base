import {API, BlockTool, BlockToolConstructorOptions} from "@editorjs/editorjs";
import {makeElement} from "@/utils/lang/DocumentUtil";
import {buildKanbanData, KanbanData} from "@/editor/SuperEditor/tools/KanbanTool/types";
import KanbanTool from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanTool.vue";


export default class Kanban implements BlockTool {

  /**
   * Notify core that read-only mode is supported
   */
  public static readonly isReadOnlySupported = true

  static get toolbox(): { icon: string, title: string } {
    return {
      icon: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M469.333333 170.666667v682.666666a85.333333 85.333333 0 0 1-85.333333 85.333334H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333334V170.666667a85.333333 85.333333 0 0 1 85.333334-85.333334h213.333333a85.333333 85.333333 0 0 1 85.333333 85.333334zM384 170.666667H170.666667v682.666666h213.333333V170.666667z m554.666667 0v512a85.333333 85.333333 0 0 1-85.333334 85.333333h-213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h213.333333a85.333333 85.333333 0 0 1 85.333334 85.333334z m-85.333334 0h-213.333333v512h213.333333V170.666667z"></path></svg>',
      title: '看板',
    };
  }

  private readonly api: API;
  private readonly readOnly;
  public data: Ref<KanbanData>;
  public fs: Ref<boolean> = ref(false);

  private wrapper: HTMLDivElement | null = null;

  constructor(props: BlockToolConstructorOptions<KanbanData>) {
    const {api, readOnly, data} = props;
    this.api = api;
    this.readOnly = readOnly;
    if (!data || !Object.keys(data).length) {
      this.data = ref(buildKanbanData());
    } else {
      this.data = ref(data);
    }
  }

  render(): Promise<HTMLElement> | HTMLElement {
    if (!this.wrapper) {
      this.wrapper = makeElement('div');
    }

    const {data, readOnly, api} = this;

    const app = createApp({
      setup() {
        return () => <KanbanTool v-model={data.value} readOnly={readOnly} api={api}/>
      }
    });
    app.mount(this.wrapper);
    return this.wrapper;
  }

  save(): KanbanData {
    return this.data.value;
  }


}