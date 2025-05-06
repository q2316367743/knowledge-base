/**
 * import types
 */
import type {
  API,
  ToolboxConfig,
  BlockTool,
  ToolConfig,
  BlockToolData,
} from '@editorjs/editorjs';

/**
 * Import Tool's icon
 */
import { IconWarning } from '@codexteam/icons';

/**
 * Build styles
 */
import './index.css';
import {makeElement} from "@/utils/lang/DocumentUtil";

/**
 * Warning Tool`s CSS classnames
 */
interface WarningCSS {
  baseClass: string;
  wrapper: string;
  title: string;
  input: string;
  message: string;
}

/**
 * Warning Tool's input and output data
 */
export interface WarningData extends BlockToolData {
  /**
   * Warning's title
   */
  title: string;
  /**
   * Warning's message
   */
  message: string;
}

/**
 * Warning Tool's initial configuration
 */
export interface WarningConfig extends ToolConfig {
  /**
   * Placeholder to show in warning`s title input
   */
  titlePlaceholder?: string;
  /**
   * Placeholder to show in warning`s message input
   */
  messagePlaceholder?: string;
}

/**
 * Warning Tool's constructor arguments
 */
interface WarningConstructorArgs {
  /**
   * Previously saved warning`s data
   */
  data: WarningData;
  /**
   * Warning Tool`s configuration
   */
  config?: WarningConfig;
  /**
   * Editor.js API instance
   */
  api: API;
  /**
   * Read-only mode
   */
  readOnly: boolean;
}

/**
 * @class Warning
 * @classdesc Warning Tool for Editor.js
 * @property {API} api - Editor.js API instance
 * @property {WarningData} data - Warning Tool`s input and output data
 * @property {boolean} readOnly - Read-only mode
 * @property {string} titlePlaceholder - Placeholder for title input
 * @property {string} messagePlaceholder - Placeholder for message input
 */
export default class Warning implements BlockTool {
  /**
   * Editor.js API instance
   */
  private api: API;
  /**
   * Warning Tool`s input and output data
   */
  private readonly data: WarningData;
  /**
   * Read-only mode is supported
   */
  private readonly readOnly: boolean;
  /**
   * Placeholder for the title input
   */
  private readonly titlePlaceholder: string;
  /**
   * Placeholder for the message input
   */
  private readonly messagePlaceholder: string;

  /**
   * Notify core that read-only mode is supported
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Get Toolbox settings
   *
   * @public
   * @returns {ToolboxConfig} An object containing Tool's icon and title.
   */
  static get toolbox(): ToolboxConfig {
    return {
      icon: IconWarning,
      title: '警告块',
    };
  }

  /**
   * Allow to press Enter inside the Warning
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks(): boolean {
    return true;
  }

  /**
   * Default placeholder for warning title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TITLE_PLACEHOLDER(): string {
    return '标题';
  }

  /**
   * Default placeholder for warning message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER(): string {
    return '内容';
  }

  /**
   * Warning Tool`s styles
   *
   * @returns {WarningCSS} An object containing Tool`s CSS classnames.
   */
  get CSS(): WarningCSS {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-warning',
      title: 'cdx-warning__title',
      input: this.api.styles.input,
      message: 'cdx-warning__message',
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params — constructor params
   * @param {WarningData} params.data — previously saved data
   * @param {WarningConfig} params.config — user config for Tool
   * @param {API} params.api - Editor.js API
   * @param {boolean} params.readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }: WarningConstructorArgs) {
    this.api = api;
    this.readOnly = readOnly;

    this.titlePlaceholder =
      config?.titlePlaceholder || Warning.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder =
      config?.messagePlaceholder || Warning.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      title: data.title || '',
      message: data.message || '',
    };
  }

  /**
   * Create Warning Tool container with inputs
   *
   * @returns {Element} Html element of Warning Tool.
   */
  render(): HTMLElement {
    const container = makeElement('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const title = makeElement('div', [this.CSS.input, this.CSS.title], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.title,
    });
    const message = makeElement('div', [this.CSS.input, this.CSS.message], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.message,
    });

    title.dataset.placeholder = this.titlePlaceholder;
    message.dataset.placeholder = this.messagePlaceholder;

    container.appendChild(title);
    container.appendChild(message);

    return container;
  }

  /**
   * Extract Warning data from Warning Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData} Warning Tool`s data.
   */
  save(warningElement: HTMLDivElement): WarningData {
    const title = warningElement.querySelector(`.${this.CSS.title}`);
    const message = warningElement.querySelector(`.${this.CSS.message}`);

    return Object.assign(this.data, {
      title: title?.innerHTML ?? '',
      message: message?.innerHTML ?? '',
    });
  }

  /**
   * Sanitizer config for Warning Tool saved data
   *
   */
  static get sanitize() {
    return {
      title: {},
      message: {},
    };
  }
}