/**
 * Build styles
 */
import './index.css'
import {API, BlockTool, BlockToolConstructorOptions, PasteEvent} from "@editorjs/editorjs";
import {makeElement} from "@/utils/lang/DocumentUtil";
import {IconAlignLeft, IconAlignRight, IconAlignCenter, IconAlignJustify} from '@codexteam/icons';

type ParagraphAlignment = 'left' | 'center' | 'right' | 'justify';

interface ParagraphConfig {
  placeholder?: string;
  defaultAlignment?: ParagraphAlignment;
  preserveBlank?: boolean;
}

interface ParagraphData {
  text?: string;
  alignment?: ParagraphAlignment;
}

interface ParagraphSetting {
  name: ParagraphAlignment;
  icon: string;
}


export class Paragraph implements BlockTool {
  /**
   * Default placeholder for Paragraph Tool
   */
  public static DEFAULT_PLACEHOLDER = ''

  /**
   * Allowed paragraph alignments
   */
  public static ALIGNMENTS: Record<ParagraphAlignment, ParagraphAlignment> = {
    left: 'left',
    center: 'center',
    right: 'right',
    justify: 'justify'
  };

  /**
   *
   * @returns {boolean}
   */
  public static isReadOnlySupported = true;

  /**
   * Default paragraph alignment
   */
  public static DEFAULT_ALIGNMENT: ParagraphAlignment = Paragraph.ALIGNMENTS.left;

  private readonly api: API;
  private readonly config: ParagraphConfig;
  private readonly readOnly: boolean;
  private _CSS: {
    block: string;
    wrapper: string;
    alignment: Record<ParagraphAlignment, string>
  };
  private CSS: {
    baseClass: string;
    loading: string;
    input: string;
    settingsButton: string;
    settingsButtonActive: string;
  }
  private readonly settings: Array<ParagraphSetting>;
  private readonly _placeholder: string;
  private _data?: ParagraphData;
  private readonly _element: HTMLDivElement;
  private readonly _preserveBlank?: boolean;


  /**
   *
   * @param data
   * @param config
   * @param api
   * @param readOnly
   */
  constructor({data, config, api, readOnly}: BlockToolConstructorOptions<ParagraphData, ParagraphConfig>) {
    this.api = api;
    this.config = config || {};
    this.readOnly = readOnly;
    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-paragraph',
      alignment: {
        left: 'ce-paragraph--left',
        center: 'ce-paragraph--center',
        right: 'ce-paragraph--right',
        justify: 'ce-paragraph--justify',
      }
    }
    this.CSS = {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    }

    this.settings = [
      {
        name: 'left',
        icon: IconAlignLeft
      },
      {
        name: 'center',
        icon: IconAlignCenter
      },
      {
        name: 'right',
        icon: IconAlignRight
      },
      {
        name: 'justify',
        icon: IconAlignJustify
      }
    ];

    this.onKeyUp = this.onKeyUp.bind(this)

    /**
     * Placeholder for paragraph if it is first Block
     * @type {string}
     */
    this._placeholder = config?.placeholder ? config.placeholder : Paragraph.DEFAULT_PLACEHOLDER;

    this._data = {
      text: data.text || '',
      alignment: data.alignment || config?.defaultAlignment || Paragraph.DEFAULT_ALIGNMENT
    };
    this._element = this.drawView();
    this.data = data;

    this._preserveBlank = config?.preserveBlank !== undefined ? config.preserveBlank : false;

  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   */
  onKeyUp(e: KeyboardEvent) {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    const {textContent} = this._element;

    if (textContent === '') {
      this._element.innerHTML = '';
    }
  }

  /**
   * Create Tool's view
   */
  drawView() {
    const div = makeElement('div',
      [this._CSS.wrapper, this._CSS.block, this._CSS.alignment[this.data?.alignment || Paragraph.DEFAULT_ALIGNMENT] || ''],
      {
        contentEditable: !this.readOnly,
        innerHTML: this.data?.text
      })
    div.dataset.placeholder = this.api.i18n.t(this._placeholder);
    div.addEventListener('keyup', this.onKeyUp);
    return div;
  }

  /**
   * Return Tool's view
   */
  render() {
    return this._element;
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   */
  merge(data: ParagraphData) {

    let newData: ParagraphData = {
      text: (this.data?.text || '') + (data.text || ''),
      alignment: this.data?.alignment,
    };

    this._element.innerHTML = this.data?.text || '';

    this.data = newData;
  }

  /**
   * Validate Paragraph block data:
   * - check for emptiness
   */
  validate(savedData: ParagraphData) {
    return !(savedData.text?.trim() === '' && !this._preserveBlank);
  }

  /**
   * Extract Tool's data from the view
   */
  save(toolsContent: HTMLDivElement): ParagraphData {
    return Object.assign(this.data || {}, {
      text: toolsContent.innerHTML,
    });
  }

  /**
   * On paste callback fired from Editor.
   */
  onPaste(event: PasteEvent) {
    this.data = {
      // @ts-ignore
      text: event.detail.data.innerHTML,
      alignment: this.config.defaultAlignment || Paragraph.DEFAULT_ALIGNMENT
    };
  }

  /**
   * Get current Tools`s data
   */
  get data() {
    return this._data || {};
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   */
  set data(data: ParagraphData) {
    this._data = {
      text: data.text || '',
      alignment: data.alignment || this.config.defaultAlignment || Paragraph.DEFAULT_ALIGNMENT
    }
    this._element.innerHTML = this._data.text || '';
  }


  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other block
   */
  static get conversionConfig() {
    return {
      export: 'text', // to convert Paragraph to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      },
      alignment: {}
    };
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   */
  static get pasteConfig(): { tags: string[] } {
    return {
      tags: ['P']
    };
  }

  renderSettings() {
    const wrapper = document.createElement('div');

    this.settings.map(tune => {
      /**
       * buttonのdomを作成して、alignのtoggleをactiveに設定する
       * @type {HTMLDivElement}
       */
      const button = document.createElement('div');
      button.classList.add('cdx-settings-button');
      button.innerHTML = tune.icon;

      button.classList.toggle(this.CSS.settingsButtonActive, tune.name === this.data.alignment);

      wrapper.appendChild(button);

      return button;
    }).forEach((element, index, elements) => {

      element.addEventListener('click', () => {

        this._toggleTune(this.settings[index].name);

        elements.forEach((el, i) => {
          const {name} = this.settings[i];
          el.classList.toggle(this.CSS.settingsButtonActive, name === this.data.alignment);
          //paragraphのdivにalignmentのclassをつける。
          this._element.classList.toggle(this._CSS.alignment[name], name === this.data.alignment)
        });
      });
    });

    return wrapper;
  }


  /**
   * Click on the Settings Button
   */
  private _toggleTune(tune: ParagraphAlignment) {
    this.data.alignment = tune;
  }

  /**
   * Icon and title for displaying at the Toolbox
   */
  static get toolbox() {
    return {
      icon: `<svg t="1746595561179" class="icon" viewBox="0 0 1068 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4941" width="16" height="16"><path d="M904.147478 811.631304H164.374261a30.898087 30.898087 0 0 0-30.809044 30.853566c0 16.918261 13.890783 30.809043 30.809044 30.809043h739.773217c16.918261 0 30.809043-13.846261 30.809044-30.809043a30.898087 30.898087 0 0 0-30.809044-30.809044z m0-169.494261H164.374261a30.898087 30.898087 0 0 0-30.809044 30.809044c0 16.962783 13.890783 30.853565 30.809044 30.853565h739.773217c16.918261 0 30.809043-13.890783 30.809044-30.853565a30.898087 30.898087 0 0 0-30.809044-30.809044z m0-169.538782h-246.605913a30.898087 30.898087 0 0 0-30.809043 30.853565c0 16.918261 13.846261 30.809043 30.809043 30.809044h246.605913c16.918261 0 30.809043-13.890783 30.809044-30.809044a30.898087 30.898087 0 0 0-30.809044-30.853565z m-246.605913-277.370435h246.605913c16.918261 0 30.809043-13.890783 30.809044-30.853565A30.898087 30.898087 0 0 0 904.147478 133.565217h-246.605913a30.898087 30.898087 0 0 0-30.809043 30.809044c0 16.962783 13.846261 30.853565 30.809043 30.853565z m246.605913 107.876174h-246.605913a30.898087 30.898087 0 0 0-30.809043 30.809043c0 16.918261 13.846261 30.809043 30.809043 30.809044h246.605913c16.918261 0 30.809043-13.846261 30.809044-30.809044a30.898087 30.898087 0 0 0-30.809044-30.809043zM213.704348 561.997913a31.298783 31.298783 0 0 0 40.069565-16.918261l56.987826-135.657739c3.116522 0 4.674783 1.558261 7.746783 1.558261h123.325217c3.027478 0 4.585739 0 7.657739-1.558261l56.987826 135.613217c4.674783 12.332522 17.007304 18.521043 27.781566 18.521044 4.630261 0 7.702261 0 12.332521-3.116522a31.298783 31.298783 0 0 0 16.918261-40.069565L409.510957 150.528C403.18887 141.267478 392.414609 133.565217 380.082087 133.565217a30.45287 30.45287 0 0 0-27.737044 18.476522L198.299826 521.928348c-7.702261 16.918261 0 33.925565 15.404522 40.069565z m166.422261-317.44l43.186087 104.759652H335.471304l44.655305-104.804174z" fill="#999999" p-id="4942"></path></svg>`,
      title: 'Text'
    };
  }
}
