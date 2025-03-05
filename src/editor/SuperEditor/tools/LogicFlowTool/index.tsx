import './index.less';
import {API, BlockTool, BlockToolConstructorOptions} from "@editorjs/editorjs";
import {Button} from "tdesign-vue-next";
import {makeElement} from "@/utils/lang/DocumentUtil";
import {FullscreenExitIcon, FullscreenIcon} from "tdesign-icons-vue-next";
import {buildLogicFlowData, LogicFlowData} from "@/editor/LogicFlow/constants";
import LogicFlow from "@/editor/LogicFlow/LogicFlow.vue";


export default class LogicFlowTool implements BlockTool {

  /**
   * Notify core that read-only mode is supported
   */
  public static readonly isReadOnlySupported = true

  static get toolbox(): { icon: string, title: string } {
    return {
      icon: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M223.94 831.74V615.55c0-17.06 13.83-30.88 30.88-30.88 17.06 0 30.88 13.83 30.88 30.88v216.18c0 17.06-13.83 30.88-30.88 30.88-17.05 0.01-30.88-13.82-30.88-30.87zM594.54 542.64H378.36c-17.06 0-30.88-13.83-30.88-30.88 0-17.06 13.83-30.88 30.88-30.88h216.18c17.06 0 30.88 13.83 30.88 30.88 0 17.05-13.82 30.88-30.88 30.88z" p-id="4578"></path><path d="M627.42 862.62H252.83c-15.95 0-28.89-12.93-28.89-28.89v-3.99c0-15.95 12.93-28.89 28.89-28.89h374.59c15.95 0 28.89 12.93 28.89 28.89v3.99c0 15.96-12.94 28.89-28.89 28.89zM328.95 635.28H180.71c-27.29 0-49.41-22.12-49.41-49.41V437.63c0-27.29 22.12-49.41 49.41-49.41h148.24c27.29 0 49.41 22.12 49.41 49.41v148.24c0 27.29-22.12 49.41-49.41 49.41z m-12.36-86.47v-74.12c0-13.65-11.06-24.71-24.71-24.71h-74.12c-13.65 0-24.71 11.06-24.71 24.71v74.12c0 13.65 11.06 24.71 24.71 24.71h74.12c13.65 0 24.71-11.06 24.71-24.71zM693.37 372.78v-92.65c0-17.06 13.83-30.88 30.88-30.88 17.06 0 30.88 13.83 30.88 30.88v92.65c0 17.06-13.83 30.88-30.88 30.88-17.06 0-30.88-13.83-30.88-30.88zM693.37 743.38v-92.65c0-17.06 13.83-30.88 30.88-30.88 17.06 0 30.88 13.83 30.88 30.88v92.65c0 17.06-13.83 30.88-30.88 30.88-17.06 0-30.88-13.83-30.88-30.88z" p-id="4579"></path><path d="M847.78 187.48c0 68.23-55.31 123.53-123.53 123.53S600.72 255.7 600.72 187.48 656.03 63.95 724.25 63.95s123.53 55.3 123.53 123.53z m-123.53-61.77c-34.11 0-61.77 27.65-61.77 61.77s27.65 61.77 61.77 61.77 61.77-27.65 61.77-61.77-27.66-61.77-61.77-61.77zM847.78 836.03c0 68.23-55.31 123.53-123.53 123.53s-123.53-55.31-123.53-123.53S656.03 712.5 724.25 712.5s123.53 55.3 123.53 123.53z m-123.53-61.77c-34.11 0-61.77 27.65-61.77 61.77s27.65 61.77 61.77 61.77 61.77-27.65 61.77-61.77-27.66-61.77-61.77-61.77zM689.31 657.95L584.49 553.13c-19.3-19.3-19.3-50.58 0-69.88l104.82-104.82c19.3-19.3 50.58-19.3 69.88 0l104.82 104.82c19.3 19.3 19.3 50.58 0 69.88L759.19 657.95c-19.3 19.29-50.58 19.29-69.88 0z m52.41-69.88l52.41-52.41c9.65-9.65 9.65-25.29 0-34.94l-52.41-52.41c-9.65-9.65-25.29-9.65-34.94 0l-52.41 52.41c-9.65 9.65-9.65 25.29 0 34.94l52.41 52.41c9.65 9.65 25.29 9.65 34.94 0z"></path></svg>',
      title: '流程图',
    };
  }

  private readonly api: API;
  private readonly readOnly;
  public data: Ref<LogicFlowData>;
  public fs: Ref<boolean> = ref(false);

  private wrapper: HTMLDivElement | null = null;

  constructor(props: BlockToolConstructorOptions<LogicFlowData>) {
    const {api, readOnly, data} = props;
    this.api = api;
    this.readOnly = readOnly;
    if (!data || !Object.keys(data).length) {
      this.data = ref(buildLogicFlowData(false));
    } else {
      this.data = ref(data);
    }
  }

  render(): Promise<HTMLElement> | HTMLElement {
    if (!this.wrapper) {
      this.wrapper = makeElement('div', ['ce-logic-flow']);
    }

    const {data, readOnly, fs} = this;

    watch(fs, val => {
      if (val) {
        this.wrapper?.classList.add('ce-logic-flow-fullscreen-active');
      } else {
        this.wrapper?.classList.remove('ce-logic-flow-fullscreen-active');
      }
    })

    const app = createApp({
      setup() {
        return () => <>
          <div class={'ce-logic-flow-fullscreen'}>
            <Button theme={'primary'} variant={'text'} shape={'square'} size={'small'}
                    onClick={() => fs.value = !fs.value}>{{
              icon: () => fs.value ? <FullscreenExitIcon/> : <FullscreenIcon/>
            }}</Button>
          </div>
          <LogicFlow v-model={data.value} readOnly={readOnly}/>
        </>
      }
    });
    app.mount(this.wrapper);
    return this.wrapper;
  }

  save(): LogicFlowData {
    return this.data.value;
  }


}