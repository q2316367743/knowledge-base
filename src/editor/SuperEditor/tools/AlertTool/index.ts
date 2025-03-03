import './index.less';
import {API, BlockTool, BlockToolConstructorOptions, PasteEvent} from "@editorjs/editorjs";
import {makeElement} from '@/utils/lang/DocumentUtil';

/**
 * Build styles
 */

/**
 * Import Tool's icons
 */
import ToolboxIcon from './assets/icon.svg?raw';
import SettingsIcon from './assets/settings-icon.svg?raw';
import AlignLeftIcon from './assets/align-left-icon.svg?raw';
import AlignCenterIcon from './assets/align-center-icon.svg?raw';
import AlignRightIcon from './assets/align-right-icon.svg?raw';

interface AlertData {
  type: string;
  align?: string;
  alignType?: string;
  message: string;
}

interface AlertConfig {
  defaultType?: string;
  defaultAlignType?: string;
  messagePlaceholder?: string;
  alertTypes?: Array<string>;
  defaultAlign?: string;
}

/**
 * 警告组件
 */
export default class AlertTool implements BlockTool {

  public static readonly toolbox = {
    icon: ToolboxIcon,
    title: '警告',
  }
  /**
   * Allow to press Enter inside the Alert block
   */
  public static readonly enableLineBreaks = true;
  /**
   * Default Alert type
   */
  public static readonly DEFAULT_TYPE = 'primary'
  /**
   * Default Alert align type
   *
   * @public
   * @returns {string}
   */
  public static readonly DEFAULT_ALIGN_TYPE = 'left';
  /**
   * Default placeholder for Alert message
   *
   * @public
   * @returns {string}
   */
  public static readonly DEFAULT_MESSAGE_PLACEHOLDER = 'Type here...'
  /**
   * Supported Alert types
   */
  public static readonly ALERT_TYPES = [
    'default',
    'primary',
    'success',
    'warning',
    'danger',
  ]
  /**
   * Supported Align types
   */
  public static readonly ALIGN_TYPES = ['left', 'center', 'right'];

  /**
   * Alert Tool`s styles
   */
  get CSS(): Record<string, any> {
    return {
      wrapper: 'cdx-alert',
      wrapperForType: (type: string) => `cdx-alert-${type}`,
      wrapperForAlignType: (alignType: string) => `cdx-alert-align-${alignType}`,
      message: 'cdx-alert__message',
    };
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   *
   */
  public static readonly isReadOnlySupported = true;

  private readonly api: API;
  private readonly readOnly: boolean;
  private alertTypes: Array<string>;
  private defaultType: string;
  private defaultAlign: string;
  private messagePlaceholder: string;
  private data: AlertData;
  private container: HTMLDivElement | undefined;

  /**
   * Render plugin`s main Element and fill it with saved data
   */
  constructor(props: BlockToolConstructorOptions<AlertData, AlertConfig>) {
    const {data, config, api, readOnly} = props;
    this.api = api;

    this.alertTypes = config?.alertTypes || AlertTool.ALERT_TYPES;
    this.defaultType = config?.defaultType || AlertTool.DEFAULT_TYPE;
    this.defaultAlign = config?.defaultAlign || AlertTool.DEFAULT_ALIGN_TYPE;
    this.messagePlaceholder =
      config?.messagePlaceholder || AlertTool.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      type: this.alertTypes.includes(data.type)
        ? data.type
        : this.defaultType,
      align: AlertTool.ALIGN_TYPES.includes(data.align || '')
        ? data.align
        : this.defaultAlign,
      message: data.message || '',
    };

    this.container = undefined;

    this.readOnly = readOnly;
  }

  /**
   * Create Alert Tool container
   */
  render() {
    const containerClasses = [
      this.CSS.wrapper,
      this.CSS.wrapperForType(this.data.type),
      this.CSS.wrapperForAlignType(this.data.align),
    ];

    this.container = makeElement('div', containerClasses);

    const messageEl = makeElement('div', [this.CSS.message], {
      contentEditable: `${!this.readOnly}`,
      innerHTML: this.data.message,
    });

    messageEl.dataset.placeholder = this.messagePlaceholder;

    this.container.appendChild(messageEl);

    return this.container;
  }

  /**
   * Create Block's settings block
   */
  renderSettings() {
    const alertTypes = this.alertTypes.map((type) => ({
      icon: SettingsIcon,
      name: `alert-${type}`,
      label: this._getFormattedName(type),
      toggle: 'settings-icon-variant',
      isActive: this.data.type === type,
      onActivate: () => {
        this._changeAlertType(type);
      },
    }));

    const alignTypes = AlertTool.ALIGN_TYPES.map((align) => ({
      icon:
        align == 'left'
          ? AlignLeftIcon
          : align == 'center'
            ? AlignCenterIcon
            : align == 'right'
              ? AlignRightIcon
              : 'IconAlign_left',
      name: `align-${align}`,
      label: this._getFormattedName(align),
      toggle: 'align',
      isActive: this.data.align === align,
      onActivate: () => {
        this._changeAlignType(align);
      },
    }));
    return [...alertTypes, ...alignTypes];
  }

  /**
   * Helper for formatting Alert Type / Align Type
   *
   * @param name - Alert type or Align type
   * @returns
   */
  private _getFormattedName(name: string): string {
    return this.api.i18n.t(name.charAt(0).toUpperCase() + name.slice(1));
  }

  /**
   * Helper for changing style of Alert block with the selected Alert type
   *
   * @param newType - new Alert type to be applied to the block
   */
  private _changeAlertType(newType: string) {
    // Save new type
    this.data.type = newType;

    this.alertTypes.forEach((type) => {
      const alertClass = this.CSS.wrapperForType(type);

      // Remove the old Alert type class
      this.container?.classList.remove(alertClass);

      if (newType === type) {
        // Add an Alert class for the selected Alert type
        this.container?.classList.add(alertClass);
      }
    });
  }

  /**
   * Helper for changing align of Alert block with the selected Align type
   *
   * @param newAlign - new align type to be applied to the block
   * @private
   */
  _changeAlignType(newAlign: string) {
    // Save new type
    this.data.align = newAlign;

    AlertTool.ALIGN_TYPES.forEach((align) => {
      const alignClass = this.CSS.wrapperForAlignType(align);

      // Remove the old Alert type class
      this.container?.classList.remove(alignClass);

      if (newAlign === align) {
        // Add an Alert class for the selected Alert type
        this.container?.classList.add(alignClass);
      }
    });
  }

  /**
   * Extract Alert data from Alert Tool element
   *
   * @param alertElement - element to save
   */
  save(alertElement: HTMLDivElement): AlertData {
    const messageEl = alertElement.querySelector(`.${this.CSS.message}`);
    return {...this.data, message: messageEl?.innerHTML || ''};
  }

  /**
   * Fill Alert's message with the pasted content
   *
   * @param event - event with pasted content
   */
  onPaste(event: PasteEvent) {
    if ("data" in event.detail) {
      const {data} = event.detail;
      if (typeof data === 'string') {
        this.data = {
          type: this.defaultType,
          message: data,
        };
      } else {
        this.data = {
          type: this.defaultType,
          message: data.innerHTML || '',
        };
      }
    }

  }

  /**
   * Allow Alert to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      // export Alert's message for other blocks
      export: (data: AlertData) => data.message,
      // fill Alert's message from other block's export string
      import: (string: string) => {
        return {
          message: string,
          type: this.DEFAULT_TYPE,
          alignType: this.DEFAULT_ALIGN_TYPE,
        };
      },
    };
  }

  /**
   * Sanitizer config for Alert Tool saved data
   */
  public static readonly sanitize = {
    message: true,
    type: false,
    alignType: false,
  }
}