import './index.css';
import {API, BlockTool, BlockToolConstructorOptions, PasteEvent} from "@editorjs/editorjs";
import {IconHeading, IconAlignLeft, IconAlignRight, IconAlignCenter, IconAlignJustify} from '@codexteam/icons';

type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeaderAlignment = 'left' | 'center' | 'right' | 'justify';
type HeaderTag = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6'

interface HeaderData {
  text: string;
  level: HeaderLevel;
  alignment: HeaderAlignment;
}

interface HeaderConfig {
  placeholder?: string;
  levels?: Array<HeaderLevel>;
  defaultLevel?: HeaderLevel;
  defaultAlignment?: HeaderAlignment;
}

interface HeaderSetting {
  name: HeaderAlignment,
  icon: string;
}

interface HeaderLevelConfig {
  number: HeaderLevel;
  tag: HeaderTag;
  svg: string;
}

/**
 * Header block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */
export class Header implements BlockTool {

  private readonly api: API;
  private readonly readOnly: boolean;
  private readonly _CSS: {
    block: string;
    settingsButton: string;
    settingsButtonActive: string;
    wrapper: string;
    alignment: Record<HeaderAlignment, string>;
  };
  private readonly CSS: {
    baseClass: string;
    loading: string;
    input: string;
    settingsButton: string;
    settingsButtonActive: string;
  }
  private readonly inlineToolSettings: Array<HeaderSetting>;
  private readonly _settings: HeaderConfig;
  private readonly settingsButtons: Array<HTMLElement>;
  private _data: HeaderData;
  private _element: HTMLHeadingElement;

  constructor({data, config, api, readOnly}: BlockToolConstructorOptions<HeaderData, HeaderConfig>) {
    this.api = api;
    this.readOnly = readOnly;

    this._CSS = {
      block: this.api.styles.block,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: "ce-header",
      alignment: {
        left: "ce-header--left",
        center: "ce-header--center",
        right: "ce-header--right",
        justify: "ce-header--justify",
      },
    };
    this.CSS = {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };

    this.inlineToolSettings = [
      {
        name: "left",
        icon: IconAlignLeft,
      },
      {
        name: "center",
        icon: IconAlignCenter,
      },
      {
        name: "right",
        icon: IconAlignRight,
      },
      {
        name: "justify",
        icon: IconAlignJustify,
      },
    ];
    this._settings = config || {};
    this._data = this.normalizeData(data);
    this.settingsButtons = [];
    this._element = this.getTag();
  }

  /**
   * Normalize input data
   */
  private normalizeData(data?: HeaderData): HeaderData {
    const newData: HeaderData = {
      level: this.defaultLevel.number,
      alignment: Header.DEFAULT_ALIGNMENT,
      text: "",
    };

    if (typeof data !== "object") return newData;

    newData.text = data?.text || "";
    newData.level = data?.level || this.defaultLevel.number;
    newData.alignment = data?.alignment || Header.DEFAULT_ALIGNMENT;

    return newData;
  }

  /**
   * Return Tool's view
   */
  render(): HTMLHeadingElement {
    return this._element;
  }

  /**
   * Click on the Settings Button
   */
  private _toggleTune(tune: HeaderAlignment) {
    this._data.alignment = tune;
  }

  /**
   * Create Block's settings block
   */
  renderSettings(): HTMLElement {
    const holder = document.createElement("DIV");

    // do not add settings button, when only one level is configured
    if (this.levels.length <= 1) {
      return holder;
    }

    this.inlineToolSettings
      .map((tune) => {
        const button = document.createElement("div");
        button.classList.add(this._CSS.settingsButton);
        button.innerHTML = tune.icon;

        button.classList.toggle(this.CSS.settingsButtonActive, tune.name === this.data.alignment);

        holder.appendChild(button);

        return button;
      })
      .forEach((element, index, elements) => {
        element.addEventListener("click", () => {
          this._toggleTune(this.inlineToolSettings[index].name);

          elements.forEach((el, i) => {
            const {name} = this.inlineToolSettings[i];
            el.classList.toggle(this.CSS.settingsButtonActive, name === this.data.alignment);
            //headerのdivにalignmentのclassをつける。
            this._element.classList.toggle(this._CSS.alignment[name], name === this.data.alignment);
          });
        });
      });

    /** Add type selectors */
    this.levels.forEach((level) => {
      const selectTypeButton = document.createElement("SPAN");

      selectTypeButton.classList.add(this._CSS.settingsButton);

      /**
       * Highlight current level button
       */
      if (this.currentLevel.number === level.number) {
        selectTypeButton.classList.add(this._CSS.settingsButtonActive);
      }

      // Add SVG icon
      selectTypeButton.innerHTML = level.svg;
      // Save level to its button
      selectTypeButton.dataset.level = level.number + '';
      // Set up click handler
      selectTypeButton.addEventListener("click", () => {
        this.setLevel(level.number);
      });
      // Append settings button to holder
      holder.appendChild(selectTypeButton);
      // Save settings buttons
      this.settingsButtons.push(selectTypeButton);
    });

    return holder;
  }

  /**
   * Callback for Block's settings buttons
   */
  setLevel(level: HeaderLevel) {
    this.data = {
      level: level,
      text: this.data.text,
      alignment: this.data.alignment,
    };

    /**
     * Highlight button by selected level
     */
    this.settingsButtons.forEach((button) => {
      button.classList.toggle(this._CSS.settingsButtonActive, parseInt(button.dataset.level || '2') === level);
    });
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   */
  merge(data: HeaderData) {
    this.data = {
      text: this.data.text + data.text,
      level: this.data.level,
      alignment: this.data.alignment,
    };
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   */
  validate(blockData: HeaderData) {
    return blockData.text.trim() !== "";
  }

  /**
   * Extract Tool's data from the view
   */
  save(toolsContent: HTMLHeadingElement): HeaderData {
    return {
      text: toolsContent.innerHTML,
      level: this.currentLevel.number,
      alignment: this.data.alignment,
    };
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  static conversionConfig = {
    export: "text", // use 'text' property for other blocks
    import: "text", // fill 'text' property from other block's export string
  };

  /**
   * Sanitizer Rules
   */
  static sanitize = {
    level: false,
    text: {},
  };

  /**
   * Returns true to notify core that read-only is supported
   */
  static isReadOnlySupported = true;

  /**
   * Get current Tools`s data
   */
  get data(): HeaderData {
    this._data.text = this._element.innerHTML;
    this._data.level = this.currentLevel.number;
    this._data.alignment = this._data.alignment || this._settings.defaultAlignment || Header.DEFAULT_ALIGNMENT;

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   */
  set data(data: HeaderData) {
    this._data = this.normalizeData(data);

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      // Create a new tag
      const newHeader = this.getTag();
      // Save Block's content
      newHeader.innerHTML = this._element.innerHTML;
      // Replace blocks
      this._element.parentNode.replaceChild(newHeader, this._element);
      // Save new block to private variable
      this._element = newHeader;
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || "";
    }
  }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   */
  getTag(): HTMLHeadingElement {
    /**
     * Create element for current Block's level
     */
    const tag = document.createElement(this.currentLevel.tag) as HTMLHeadingElement;

    /**
     * Add text to block
     */
    tag.innerHTML = this._data.text || "";

    /**
     * Add styles class
     */
    tag.classList.add(this._CSS.wrapper, this._CSS.alignment[this._data.alignment]);

    /**
     * Make tag editable
     */
    tag.contentEditable = this.readOnly ? "false" : "true";

    /**
     * Add Placeholder
     */
    tag.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || "");

    return tag;
  }

  /**
   * Get current level
   */
  get currentLevel(): HeaderLevelConfig {
    let level = this.levels.find((levelItem) => levelItem.number === this._data.level);

    if (!level) {
      level = this.defaultLevel;
    }

    return level;
  }

  /**
   * Return default level
   */
  get defaultLevel(): HeaderLevelConfig {
    /**
     * User can specify own default level value
     */
    if (this._settings.defaultLevel) {
      const userSpecified = this.levels.find((levelItem) => {
        return levelItem.number === this._settings.defaultLevel;
      });

      if (userSpecified) {
        return userSpecified;
      } else {
        console.warn("(ง'̀-'́)ง Heading Tool: the default level specified was not found in available levels");
      }
    }

    /**
     * With no additional options, there will be H2 by default
     *
     * @type {level}
     */
    return this.levels[1];
  }

  /**
   * Available header levels
   */
  get levels(): Array<HeaderLevelConfig> {
    const availableLevels: Array<HeaderLevelConfig> = [
      {
        number: 1,
        tag: "H1",
        svg: '<svg t="1746595822806" class="icon" viewBox="0 0 1047 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6635" width="16" height="16"><path d="M472.296727 930.909091v-372.363636H116.363636v372.363636h-93.090909V93.090909h93.090909v372.363636h355.886546V93.090909h93.090909v837.818182z" p-id="6636"></path><path d="M874.170182 930.955636v-0.418909h-120.413091v-69.818182h120.413091v-364.171636a283.927273 283.927273 0 0 1-120.413091 67.072V483.141818a301.335273 301.335273 0 0 0 74.146909-31.278545 304.500364 304.500364 0 0 0 66.187636-52.922182h60.183273v461.730909h93.090909v69.818182h-93.090909V930.909091z" p-id="6637"></path></svg>',
      },
      {
        number: 2,
        tag: "H2",
        svg: '<svg t="1746595840049" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1191" width="16" height="16"><path d="M662.667636 930.909091a203.776 203.776 0 0 1 52.130909-139.310546 667.787636 667.787636 0 0 1 118.225455-96.954181 547.467636 547.467636 0 0 0 74.891636-61.021091 130.653091 130.653091 0 0 0 35.979637-87.179637 86.946909 86.946909 0 0 0-24.250182-67.025454 102.4 102.4 0 0 0-71.214546-22.341818 86.853818 86.853818 0 0 0-74.938181 34.257454 163.607273 163.607273 0 0 0-27.927273 97.745455h-80.058182a206.196364 206.196364 0 0 1 50.688-143.034182 170.402909 170.402909 0 0 1 134.981818-57.344 176.267636 176.267636 0 0 1 124.136728 43.938909 150.807273 150.807273 0 0 1 47.662545 114.734545 185.530182 185.530182 0 0 1-51.2 125.952 740.864 740.864 0 0 1-108.683636 85.690182 258.513455 258.513455 0 0 0-101.329455 100.538182H1024V930.909091z m-216.482909 0v-372.363636H93.090909v372.363636H0V93.090909h93.090909v372.363636h353.047273V93.090909h93.090909v837.818182z" p-id="1192"></path></svg>',
      },
      {
        number: 3,
        tag: "H3",
        svg: '<svg t="1746595887686" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1659" width="16" height="16"><path d="M707.490909 894.417455a188.509091 188.509091 0 0 1-61.719273-136.331637h80.802909a110.033455 110.033455 0 0 0 34.490182 82.711273 105.006545 105.006545 0 0 0 74.845091 26.810182 114.641455 114.641455 0 0 0 81.547637-29.789091 90.670545 90.670545 0 0 0 27.22909-66.327273 82.199273 82.199273 0 0 0-28.672-69.259636 119.202909 119.202909 0 0 0-78.568727-22.434909h-38.167273v-61.067637h37.515637a107.799273 107.799273 0 0 0 72.657454-21.643636 78.382545 78.382545 0 0 0 24.994909-61.812364 80.709818 80.709818 0 0 0-22.807272-61.067636 102.4 102.4 0 0 0-71.261091-21.643636 104.866909 104.866909 0 0 0-74.146909 24.66909 110.312727 110.312727 0 0 0-31.604364 73.681455h-78.568727a174.638545 174.638545 0 0 1 58.042182-123.671273 177.524364 177.524364 0 0 1 125.672727-43.938909 194.699636 194.699636 0 0 1 127.022545 38.772364 133.352727 133.352727 0 0 1 47.010909 107.054545 115.246545 115.246545 0 0 1-86.667636 117.015273 146.338909 146.338909 0 0 1 70.516364 43.892364 113.943273 113.943273 0 0 1 26.391272 77.544727 158.999273 158.999273 0 0 1-49.943272 120.645818 200.471273 200.471273 0 0 1-137.309091 47.662546 193.117091 193.117091 0 0 1-129.303273-41.472z m-261.306182 41.890909v-382.976H93.090909v372.363636H0v-837.818182h93.090909v372.363637h353.093818V98.304h93.090909v837.818182z" p-id="1660"></path></svg>',
      },
      {
        number: 4,
        tag: "H4",
        svg: '<svg t="1746595868201" class="icon" viewBox="0 0 1070 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1503" width="16" height="16"><path d="M891.578182 930.909091v-115.432727h-255.581091v-76.8l258.513454-339.781819h73.448728v351.697455h79.127272v64.837818h-79.127272v115.432727z m-190.231273-180.270546h190.231273V501.76h-2.187637zM472.296727 930.909091v-372.363636H116.363636v372.363636h-93.090909V93.090909h93.090909v372.363636h355.933091V93.090909h93.090909v837.818182z" p-id="1504"></path></svg>',
      },
      {
        number: 5,
        tag: "H5",
        svg: '<svg t="1746595898942" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1815" width="16" height="16"><path d="M996.072727 398.941091v76.753454h-254.138182l-14.894545 146.013091h2.234182a146.385455 146.385455 0 0 1 56.599273-35.746909 178.222545 178.222545 0 0 1 64.791272-11.170909A161.559273 161.559273 0 0 1 972.8 623.709091a189.021091 189.021091 0 0 1 47.709091 135.586909 167.889455 167.889455 0 0 1-62.557091 134.981818 211.223273 211.223273 0 0 1-137.122909 46.917818 200.145455 200.145455 0 0 1-124.416-39.470545 155.229091 155.229091 0 0 1-63.301818-117.76h85.643636a89.786182 89.786182 0 0 0 34.304 64.837818 115.153455 115.153455 0 0 0 68.514909 18.618182 115.525818 115.525818 0 0 0 79.732364-29.044364 102.167273 102.167273 0 0 0 32.023273-78.242909 123.019636 123.019636 0 0 0-27.55491-84.154182 98.443636 98.443636 0 0 0-79.127272-30.580363 132.933818 132.933818 0 0 0-59.578182 11.915636 95.790545 95.790545 0 0 0-43.194182 41.006546h-81.035636l29.044363-299.52z" p-id="1816"></path><path d="M449.024 93.090909v372.363636H93.090909V93.090909H0v837.818182h93.090909v-372.363636h355.933091v372.363636h93.090909V93.090909z" p-id="1817"></path></svg>',
      },
      {
        number: 6,
        tag: "H6",
        svg: '<svg t="1746595906988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1972" width="16" height="16"><path d="M449.024 93.090909v372.363636H93.090909V93.090909H0v837.818182h93.090909v-372.363636h355.933091v372.363636h93.090909V93.090909z" p-id="1973"></path><path d="M1010.874182 533.783273h-84.945455a85.224727 85.224727 0 0 0-92.392727-73.774546A94.813091 94.813091 0 0 0 748.637091 512a224.256 224.256 0 0 0-30.580364 122.926545v6.702546h3.723637a133.911273 133.911273 0 0 1 55.854545-48.453818 157.742545 157.742545 0 0 1 71.540364-14.894546 162.909091 162.909091 0 0 1 125.207272 50.082909 181.527273 181.527273 0 0 1 46.917819 128.884364 175.290182 175.290182 0 0 1-54.365091 131.770182 186.181818 186.181818 0 0 1-133.399273 52.130909 174.126545 174.126545 0 0 1-149.736727-70.749091 313.669818 313.669818 0 0 1-50.781091-190.836364 367.709091 367.709091 0 0 1 54.365091-210.850909 167.889455 167.889455 0 0 1 146.757818-80.477091q156.532364 0 176.593454 145.314909m-256.279272 145.268364a113.012364 113.012364 0 0 0-27.554909 81.221818 108.264727 108.264727 0 0 0 29.044363 79.732364 100.445091 100.445091 0 0 0 74.472728 29.044364 97.28 97.28 0 0 0 75.403636-30.999273 113.524364 113.524364 0 0 0 29.090909-80.430546 111.290182 111.290182 0 0 0-27.601455-78.242909 101.003636 101.003636 0 0 0-76.753454-29.789091 96.116364 96.116364 0 0 0-75.962182 29.789091" p-id="1974"></path></svg>',
      },
    ];

    return this._settings.levels
      ? availableLevels.filter((l) => this._settings.levels?.includes(l.number))
      : availableLevels;
  }

  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   */
  onPaste(event: PasteEvent) {
    // @ts-ignore
    const content = event.detail.data;

    let level = this.defaultLevel.number;

    switch (content.tagName) {
      case "H1":
        level = 1;
        break;
      case "H2":
        level = 2;
        break;
      case "H3":
        level = 3;
        break;
      case "H4":
        level = 4;
        break;
      case "H5":
        level = 5;
        break;
      case "H6":
        level = 6;
        break;
    }

    if (this._settings.levels) {
      // Fallback to nearest level when specified not available
      level = this._settings.levels.reduce((prevLevel, currLevel) => {
        return Math.abs(currLevel - level) < Math.abs(prevLevel - level) ? currLevel : prevLevel;
      });
    }

    this.data = {
      level,
      text: content.innerHTML,
      alignment: this._settings.defaultAlignment || Header.DEFAULT_ALIGNMENT,
    };
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   */
  static get pasteConfig(): { tags: Array<HeaderTag> } {
    return {
      tags: ["H1", "H2", "H3", "H4", "H5", "H6"],
    };
  }

  /**
   * Allowed header alignments
   */
  static ALIGNMENTS: Record<HeaderAlignment, HeaderAlignment> = {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify",
  };

  /**
   * Default header alignment
   */
  static DEFAULT_ALIGNMENT: HeaderAlignment = Header.ALIGNMENTS.left;

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  static get toolbox() {
    return {
      icon: IconHeading,
      title: "Heading",
    };
  }
}