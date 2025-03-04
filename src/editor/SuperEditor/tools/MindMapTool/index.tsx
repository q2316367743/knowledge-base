import './index.less';
import {API, BlockTool, BlockToolConstructorOptions} from "@editorjs/editorjs";
import {Button} from "tdesign-vue-next";
import {FullscreenExitIcon, FullscreenIcon} from 'tdesign-icons-vue-next';
import {makeElement} from "@/utils/lang/DocumentUtil";
import {MindMapTreeData} from "@/editor/MindMapEditor/domain";
import MindMapEditor from '@/editor/MindMapEditor/index.vue';
import {buildMindMapData} from "@/editor/MindMapEditor/constant";


export default class Index implements BlockTool {

  /**
   * Notify core that read-only mode is supported
   */
  public static readonly isReadOnlySupported = true

  static get toolbox(): { icon: string, title: string } {
    return {
      icon: '<svg  class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M823.138462 602.584615V468.676923h-263.876924V378.092308h157.538462V153.6H342.646154v224.492308h177.230769v90.584615H259.938462v133.907692H118.153846V827.076923h299.323077v-224.492308h-118.153846v-94.523077H787.692308v94.523077h-141.784616V827.076923H945.230769v-224.492308h-122.092307zM382.030769 192.984615h295.384616v145.723077H382.030769V192.984615zM378.092308 787.692308H157.538462v-145.723077h220.553846V787.692308zM905.846154 787.692308h-220.553846v-145.723077H905.846154V787.692308z" fill="#7E8694" ></path></svg>',
      title: '思维导图',
    };
  }

  private readonly api: API;
  private readonly readOnly;
  public data: Ref<MindMapTreeData>;
  public fs: Ref<boolean> = ref(false);

  private wrapper: HTMLDivElement | null = null;

  constructor(props: BlockToolConstructorOptions<MindMapTreeData>) {
    const {api, readOnly, data} = props;
    this.api = api;
    this.readOnly = readOnly;
    if (!data || !Object.keys(data).length) {
      this.data = ref(buildMindMapData());
    } else {
      this.data = ref(data);
    }
  }

  render(): Promise<HTMLElement> | HTMLElement {
    if (!this.wrapper) {
      this.wrapper = makeElement('div', [this.api.styles.block, this.api.styles.input, 'ce-mind-map']);
    }

    const {data, readOnly, fs} = this;

    watch(fs, val => {
      if (val) {
        this.wrapper?.classList.add('ce-mind-map-fullscreen-active');
      } else {
        this.wrapper?.classList.remove('ce-mind-map-fullscreen-active');
      }
    })

    const app = createApp({
      setup() {
        return () => <>
          <div class={'ce-mind-map-fullscreen'}>
            <Button theme={'primary'} variant={'text'} shape={'square'} size={'small'} onClick={() => fs.value = !fs.value}>{{
              icon: () => fs.value ? <FullscreenExitIcon/> : <FullscreenIcon/>
            }}</Button>
          </div>
          <MindMapEditor v-model={data.value} readOnly={readOnly}/>
        </>
      }
    });
    app.mount(this.wrapper);
    return this.wrapper;
  }

  save(): MindMapTreeData {
    return this.data.value;
  }


}