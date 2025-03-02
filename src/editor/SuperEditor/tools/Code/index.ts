/**
 * Build styles
 */
import './index.css';

import {IconHtml} from '@codexteam/icons';
import {API, BlockTool, BlockToolConstructorOptions} from "@editorjs/editorjs";

interface CodeData {
  html: string;
}

interface CodeCss {
  baseClass: string;
  input: string;
  wrapper: string;
  textarea: string;
}

export default class CodeTool implements BlockTool {

  private readonly readOnly: boolean;
  private readonly placeholder: string;
  private api: API;
  private CSS: CodeCss;
  private textarea: HTMLTextAreaElement | null;
  private resizeDebounce: ReturnType<typeof setTimeout> | null;
  private data: CodeData;
  /**
   * Notify core that read-only mode is supported
   */
  public static readonly isReadOnlySupported = true


  /**
   * Should this tool be displayed at the Editor's Toolbox
   */
  public static readonly displayInToolbox = true;

  /**
   * Allow to press Enter inside the RawTool textarea
   */
  public static readonly enableLineBreaks = true;

  /**
   * Get Tool toolbox settings
   */
  static get toolbox() {
    return {
      icon: IconHtml,
      title: '代码块',
    };
  }

  /**
   * Default placeholder for RawTool's textarea
   */
  public static readonly DEFAULT_PLACEHOLDER = '请输入HTML代码';


  constructor(p: BlockToolConstructorOptions<CodeData>) {
    const {data, config, api, readOnly} = p;
    this.api = api;
    this.readOnly = readOnly;

    this.placeholder = api.i18n.t(config.placeholder || CodeTool.DEFAULT_PLACEHOLDER);

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: 'ce-rawtool',
      textarea: 'ce-rawtool__textarea',
    };

    this.data = {
      html: data.html || '',
    };

    this.textarea = null;
    this.resizeDebounce = null;
  }

  /**
   * Return Tool's view
   *
   * @public
   */
  render(): HTMLDivElement {
    const wrapper = document.createElement('div');
    const renderingTime = 100;

    this.textarea = document.createElement('textarea');

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);

    this.textarea.classList.add(this.CSS.textarea, this.CSS.input);
    this.textarea.textContent = this.data.html;
    this.textarea.placeholder = this.placeholder;

    if (this.readOnly) {
      this.textarea.disabled = true;
    } else {
      this.textarea.addEventListener('input', () => {
        this.onInput();
      });
    }

    wrapper.appendChild(this.textarea);

    setTimeout(() => {
      this.resize();
    }, renderingTime);

    return wrapper;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param  rawToolsWrapper - RawTool's wrapper, containing textarea with raw HTML code
   * @returns  raw HTML code
   * @public
   */
  save(rawToolsWrapper: HTMLDivElement): CodeData {
    return {
      html: rawToolsWrapper.querySelector('textarea')?.value || '',
    };
  }

  /**
   * 自动消毒配置
   */
  static get sanitize() {
    return {
      html: true, // Allow HTML tags
    };
  }

  /**
   * 文本区域更改事件
   */
  onInput() {
    if (this.resizeDebounce) {
      clearTimeout(this.resizeDebounce);
    }

    this.resizeDebounce = setTimeout(() => {
      this.resize();
    }, 200);
  }

  /**
   * 调整文本区域的大小以适合整个高度
   */
  resize() {
    if (this.textarea) {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }
  }
}