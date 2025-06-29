/**
 * Build styles
 */
import './index.css';

import {IconAddBorder, IconStretch, IconAddBackground} from '@codexteam/icons';
import {API, BlockTool, BlockToolConstructorOptions, PasteEvent} from "@editorjs/editorjs";
import {makeElement} from '@/utils/lang/DocumentUtil';
import {useAttachmentUpload} from "@/plugin/AttachmentUpload";

interface SimpleImageNode {
  wrapper: HTMLDivElement | null,
  imageHolder: HTMLDivElement | null,
  image: HTMLImageElement | null,
  caption: HTMLDivElement | null,
}

interface SimpleImageTune<K extends keyof SimpleImageSetting> {
  name: K;
  label: string;
  icon: string;
}

interface SimpleImageSetting {
  withBorder?: boolean;
  withBackground?: boolean;
  stretched?: boolean;
}

interface SimpleImageData extends SimpleImageSetting {
  key: string;
  caption?: string;
  withBorder?: boolean;
  withBackground?: boolean;
  stretched?: boolean;
}

/**
 * SimpleImage Tool for the Editor.js
 * Works only with pasted image URLs and requires no server-side uploader.
 *
 * @description Tool's input and output data format
 * @property  url — image URL
 * @property  caption — image caption
 * @property  withBorder - should image be rendered with border
 * @property withBackground - should image be rendered with background
 * @property stretched - should image be stretched to full width of container
 */
export default class SimpleImage implements BlockTool {

  public isTune = true;

  private readonly api: API;
  private readonly readOnly: boolean;
  private readonly blockIndex: number;
  private CSS: Record<string, string>;
  private nodes: SimpleImageNode;
  private tunes: Array<SimpleImageTune<keyof SimpleImageSetting>>;
  private _data: SimpleImageData;


  /**
   * Render plugin`s main Element and fill it with saved data
   *
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor(p: BlockToolConstructorOptions<SimpleImageData>) {
    const {data, api, readOnly} = p;
    /**
     * Editor.js API
     */
    this.api = api;
    this.readOnly = readOnly;

    /**
     * When block is only constructing,
     * current block points to previous block.
     * So real block index will be +1 after rendering
     *
     * @todo place it at the `rendered` event hook to get real block index without +1;
     */
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;

    /**
     * Styles
     */
    this.CSS = {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,

      /**
       * Tool's classes
       */
      wrapper: 'cdx-simple-image',
      imageHolder: 'cdx-simple-image__picture',
      caption: 'cdx-simple-image__caption',
    };

    /**
     * Nodes cache
     */
    this.nodes = {
      wrapper: null,
      imageHolder: null,
      image: null,
      caption: null,
    };

    /**
     * Tool's initial data
     */
    this.data = {
      key: data.key || '',
      caption: data.caption || '',
      withBorder: data.withBorder !== undefined ? data.withBorder : false,
      withBackground: data.withBackground !== undefined ? data.withBackground : false,
      stretched: data.stretched !== undefined ? data.stretched : false,
    };
    this._data = data;

    /**
     * Available Image tunes
     */
    this.tunes = [
      {
        name: 'withBorder',
        label: 'Add Border',
        icon: IconAddBorder,
      },
      {
        name: 'stretched',
        label: 'Stretch Image',
        icon: IconStretch,
      },
      {
        name: 'withBackground',
        label: 'Add Background',
        icon: IconAddBackground,
      },
    ];
  }

  /**
   * Creates a Block:
   *  1) Show preloader
   *  2) Start to load an image
   *  3) After loading, append image and caption input
   *
   * @public
   */
  render() {
    const wrapper = makeElement('div', [this.CSS.baseClass, this.CSS.wrapper]),
      loader = makeElement('div', this.CSS.loading),
      imageHolder = makeElement('div', this.CSS.imageHolder),
      image = makeElement('img'),
      caption = makeElement('div', [this.CSS.input, this.CSS.caption], {
        contentEditable: `${!this.readOnly}`,
        innerHTML: this.data.caption || '',
      });

    caption.dataset.placeholder = '输入标题';

    wrapper.appendChild(loader);

    if (this.data.key) {
      image.src = useAttachmentUpload.render(this.data.key);
    }

    image.onload = () => {
      wrapper.classList.remove(this.CSS.loading);
      imageHolder.appendChild(image);
      wrapper.appendChild(imageHolder);
      wrapper.appendChild(caption);
      loader.remove();
      this._acceptTuneView();
    };

    image.onerror = (e) => {
      // @todo use api.Notifies.show() to show error notification
      console.log('Failed to load an image', e);
    };

    this.nodes.imageHolder = imageHolder;
    this.nodes.wrapper = wrapper;
    this.nodes.image = image;
    this.nodes.caption = caption;

    return wrapper;
  }

  /**
   * @public
   * @param blockContent - Tool's wrapper
   */
  save(blockContent: Element): SimpleImageData {
    const image = blockContent.querySelector('img');
    const caption = blockContent.querySelector('.' + this.CSS.input);

    if (!image) {
      return this.data;
    }

    return Object.assign(this.data, {
      url: image.src,
      caption: caption?.innerHTML,
    });
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      url: {},
      withBorder: {},
      withBackground: {},
      stretched: {},
      caption: {
        br: true,
      },
    };
  }

  /**
   * 通知核心支持只读模式
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Read pasted image and convert it to base64
   *
   * @static
   * @param  file
   */
  async onDropHandler(file: File): Promise<SimpleImageData> {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    const upload = await useAttachmentUpload.upload(file, file.name, "image/png");
    return {
      key: upload.url,
      caption: upload.name,
    }
  }

  /**
   * On paste callback that is fired from Editor.
   *
   * @param  event - event with pasted config
   */
  onPaste(event: PasteEvent) {
    const {detail} = event;
    if ("data" in detail && detail.data) {
      if (typeof detail.data === 'string') {
        this.data = {
          key: detail.data,
        };
      } else {
        const src = detail.data.getAttribute('src');
        if (src) {
          this.data = {
            key: src,
          };
        }
      }
    } else if ('file' in detail && detail.file) {
      this.onDropHandler(detail.file)
        .then(data => {
          this.data = data;
        });
    }
  }

  /**
   * Returns image data
   */
  get data(): SimpleImageData {
    return this._data;
  }

  /**
   * Set image data and update the view
   *
   * @param data
   */
  set data(data: SimpleImageData) {
    this._data = Object.assign({}, this.data, data);

    if (this.nodes.image && this.data.key) {
      this.nodes.image.src = useAttachmentUpload.render(this.data.key);
    }

    if (this.nodes.caption) {
      this.nodes.caption.innerHTML = this.data.caption || '';
    }
  }

  /**
   * Specify paste substitutes
   */
  static get pasteConfig() {
    return {
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|webp)$/i,
      },
      tags: [
        {
          img: {src: true},
        },
      ],
      files: {
        mimeTypes: ['image/*'],
      },
    };
  }

  /**
   * Returns image tunes config
   */
  renderSettings() {
    return this.tunes.map(tune => ({
      ...tune,
      label: this.api.i18n.t(tune.label),
      toggle: true,
      onActivate: () => this._toggleTune(tune.name),
      isActive: !!this.data[tune.name],
    }))
  };


  /**
   * 点击设置按钮
   *
   * @private
   * @param tune
   */
  private _toggleTune<T extends keyof SimpleImageSetting>(tune: T) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }

  /**
   * Add specified class corresponds with activated tunes
   *
   * @private
   */
  _acceptTuneView() {
    this.tunes.forEach(tune => {
      this.nodes.imageHolder?.classList.toggle(this.CSS.imageHolder + '--' + tune.name?.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`), !!this.data[tune.name]);

      if (tune.name === 'stretched') {
        this.api.blocks.stretchBlock(this.blockIndex, !!this.data.stretched);
      }
    });
  }
}