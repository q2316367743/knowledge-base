import './index.less';
import {BlockToolConstructorOptions, BlockTool, API} from "@editorjs/editorjs";

interface LinkToolNode {
  wrapper: HTMLDivElement | null,
  container: HTMLDivElement | null,
  progress: HTMLLabelElement | null,
  input: HTMLDivElement | null,
  inputHolder: HTMLElement | null,
  linkContent: HTMLElement | null,
  linkImage: HTMLDivElement | null,
  linkTitle: HTMLElement | null,
  linkDescription: HTMLParagraphElement | null,
  linkText: HTMLElement | null,
}

interface LinkToolDataMeta {
  title?: string;
  description?: string | null;
  image?: { url?: string | null };
  url?: string;
}

interface LinkToolData {
  link: string;
  meta: LinkToolDataMeta;
}

interface UploadResponseFormat extends LinkToolData {
  success: 1 | 0;
}

/**
 * Tool may have any data provided by backend, currently are supported by design:
 * title, description, image, url
 */
export default class LinkTool implements BlockTool {

  /**
   * Notify core that read-only mode supported
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  static get toolbox(): { icon: string, title: string } {
    return {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72"/></svg>',
      title: 'Link',
    };
  }

  /**
   * Allow to press Enter inside the LinkTool input
   *
   */
  static get enableLineBreaks(): boolean {
    return true;
  }


  private readonly nodes: LinkToolNode
  private readonly api: API;
  private readonly readOnly: boolean;
  private _data: LinkToolData;

  constructor(props: BlockToolConstructorOptions) {
    const {data, api, readOnly} = props;
    this.api = api;
    this.readOnly = readOnly;


    this.nodes = {
      wrapper: null,
      container: null,
      progress: null,
      input: null,
      inputHolder: null,
      linkContent: null,
      linkImage: null,
      linkTitle: null,
      linkDescription: null,
      linkText: null,
    };

    this._data = {
      link: '',
      meta: {},
    };

    this.data = data;
  }

  /**
   * Renders Block content
   *
   */
  render(): HTMLDivElement {
    this.nodes.wrapper = this.make('div', this.CSS.baseClass);
    this.nodes.container = this.make('div', this.CSS.container);

    this.nodes.inputHolder = this.makeInputHolder();
    this.nodes.linkContent = this.prepareLinkPreview();

    /**
     * If Tool already has data, render link preview, otherwise insert input
     */
    if (Object.keys(this.data.meta).length) {
      this.nodes.container.appendChild(this.nodes.linkContent);
      if (this.data.meta) this.showLinkPreview(this.data.meta);
    } else {
      this.nodes.container.appendChild(this.nodes.inputHolder);
    }

    this.nodes.wrapper.appendChild(this.nodes.container);

    return this.nodes.wrapper;
  }

  /**
   * Return Block data
   */
  save(): LinkToolData {
    return this.data;
  }

  /**
   * Validate Block data
   * - check if given link is an empty string or not.
   *
   * @returns  false if saved data is incorrect, otherwise true
   */
  validate(): boolean {
    return this.data.link.trim() !== '';
  }

  /**
   * Stores all Tool's data
   *
   * @param data - data to store
   */
  set data(data: LinkToolData) {
    this._data = Object.assign({
      link: '',
      meta: {},
    }, {
      link: data.link || this._data.link,
      meta: data.meta || this._data.meta,
    });
  }

  /**
   * Return Tool data
   */
  get data() {
    return this._data;
  }

  /**
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,

      /**
       * Tool's classes
       */
      container: 'link-tool',
      inputEl: 'link-tool__input',
      inputHolder: 'link-tool__input-holder',
      inputError: 'link-tool__input-holder--error',
      linkContent: 'link-tool__content',
      linkContentRendered: 'link-tool__content--rendered',
      linkImage: 'link-tool__image',
      linkTitle: 'link-tool__title',
      linkDescription: 'link-tool__description',
      linkText: 'link-tool__anchor',
      progress: 'link-tool__progress',
      progressLoading: 'link-tool__progress--loading',
      progressLoaded: 'link-tool__progress--loaded',
    };
  }

  /**
   * Prepare input holder
   */
  makeInputHolder(): HTMLElement {
    const inputHolder = this.make('div', this.CSS.inputHolder);

    this.nodes.progress = this.make('label', this.CSS.progress);
    this.nodes.input = this.make('div', [this.CSS.input, this.CSS.inputEl], {
      contentEditable: `${!this.readOnly}`,
    });

    this.nodes.input.dataset.placeholder = this.api.i18n.t('Link');

    if (!this.readOnly) {
      this.nodes.input.addEventListener('paste', (event) => {
        this.startFetching(event);
      });

      this.nodes.input.addEventListener('keydown', (event) => {
        const [ENTER, A] = [13, 65];
        const cmdPressed = event.ctrlKey || event.metaKey;

        switch (event.keyCode) {
          case ENTER:
            event.preventDefault();
            event.stopPropagation();

            this.startFetching(event);
            break;
          case A:
            if (cmdPressed) {
              this.selectLinkUrl(event);
            }
            break;
        }
      });
    }

    inputHolder.appendChild(this.nodes.progress);
    inputHolder.appendChild(this.nodes.input);

    return inputHolder;
  }

  /**
   * Activates link data fetching by url
   *
   * @param event - fetching could be fired by a pase or keydown events
   */
  startFetching(event: KeyboardEvent | ClipboardEvent) {
    let url: string | null | undefined = this.nodes.input?.textContent;

    if (event.type === 'paste') {
      // @ts-ignore
      url = (event.clipboardData || window.clipboardData).getData('text');
    }

    this.removeErrorStyle();
    if (url) this.fetchLinkData(url).then(() => console.debug(`获取链接${url}元数据成功`))
  }

  /**
   * If previous link data fetching failed, remove error styles
   */
  removeErrorStyle() {
    this.nodes.inputHolder?.classList.remove(this.CSS.inputError);
    if (this.nodes.progress) this.nodes.inputHolder?.insertBefore(this.nodes.progress, this.nodes.input);
  }

  /**
   * Select LinkTool input content by CMD+A
   *
   * @param event - keydown
   */
  selectLinkUrl(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();

    const selection = window.getSelection();
    const range = new Range();
    if (selection) {
      const currentNode = selection.anchorNode?.parentNode;
      if (currentNode) {
        const currentItem = (currentNode as HTMLElement).closest(`.${this.CSS.inputHolder}`);
        if (currentItem) {
          const inputElement = currentItem.querySelector(`.${this.CSS.inputEl}`);
          if (inputElement) {
            range.selectNodeContents(inputElement);
          }
        }
      }
      selection.removeAllRanges();
      selection.addRange(range);
    }


  }

  /**
   * 准备链接预览保持器
   *
   */
  prepareLinkPreview(): HTMLElement {
    const holder = this.make('a', this.CSS.linkContent, {
      target: '_blank',
      rel: 'nofollow noindex noreferrer',
    });

    this.nodes.linkImage = this.make('div', this.CSS.linkImage);
    this.nodes.linkTitle = this.make('div', this.CSS.linkTitle);
    this.nodes.linkDescription = this.make('p', this.CSS.linkDescription);
    this.nodes.linkText = this.make('span', this.CSS.linkText);

    return holder;
  }

  /**
   * Compose link preview from fetched data
   *
   */
  showLinkPreview(props: LinkToolDataMeta) {
    const {image, title, description} = props;
    if (this.nodes.linkContent && this.nodes.container) {
      this.nodes.container.appendChild(this.nodes.linkContent);
    }

    if (image && image.url) {
      if (this.nodes.linkImage && this.nodes.linkContent) {
        this.nodes.linkImage.style.backgroundImage = 'url(' + image.url + ')';
        this.nodes.linkContent.appendChild(this.nodes.linkImage);
      }
    }

    if (title && this.nodes.linkTitle && this.nodes.linkContent) {
      this.nodes.linkTitle.textContent = title;
      this.nodes.linkContent.appendChild(this.nodes.linkTitle);
    }

    if (description && this.nodes.linkDescription && this.nodes.linkContent) {
      this.nodes.linkDescription.textContent = description;
      this.nodes.linkContent.appendChild(this.nodes.linkDescription);
    }

    this.nodes.linkContent?.classList.add(this.CSS.linkContentRendered);
    this.nodes.linkContent?.setAttribute('href', this.data.link);
    if (this.nodes.linkText) this.nodes.linkContent?.appendChild(this.nodes.linkText);

    if (this.nodes.linkText) {
      try {
        this.nodes.linkText.textContent = (new URL(this.data.link)).hostname;
      } catch (e) {
        this.nodes.linkText.textContent = this.data.link;
      }
    }
  }

  /**
   * Show loading progress bar
   */
  showProgress() {
    this.nodes.progress?.classList.add(this.CSS.progressLoading);
  }

  /**
   * Hide loading progress bar
   */
  hideProgress(): Promise<void> {
    return new Promise((resolve) => {
      this.nodes.progress?.classList.remove(this.CSS.progressLoading);
      this.nodes.progress?.classList.add(this.CSS.progressLoaded);

      setTimeout(resolve, 500);
    });
  }

  /**
   * If data fetching failed, set input error style
   */
  applyErrorStyle() {
    this.nodes.inputHolder?.classList.add(this.CSS.inputError);
    this.nodes.progress?.remove();
  }

  /**
   * Sends to backend pasted url and receives link data
   *
   * @param url - link source url
   */
  async fetchLinkData(url: string) {
    this.showProgress();
    this.data = {link: url, meta: {}};

    try {

      const rsp = await fetch(url);
      const body = await rsp.text();
      const dom = new DOMParser().parseFromString(body, 'text/html');


      this.onFetch({
        link: url,
        meta: {
          title: dom.title,
          description: dom.querySelector('meta[name="description"]')?.textContent || dom.body.textContent?.slice(0, 100),
          image: {
            url: dom.querySelector('meta[property="og:image"]')?.textContent,
          },
        },
        success: 1
      });
    } catch (error) {
      this.fetchingFailed(this.api.i18n.t('Couldn\'t fetch the link data'));
    }
  }

  /**
   * Link data fetching callback
   *
   * @param response - backend response
   */
  onFetch(response: UploadResponseFormat) {
    if (!response || !response.success) {
      this.fetchingFailed(this.api.i18n.t('Couldn\'t get this link data, try the other one'));

      return;
    }

    const metaData = response.meta;

    const link = response.link || this.data.link;

    this.data = {
      meta: metaData,
      link,
    };

    if (!metaData) {
      this.fetchingFailed(this.api.i18n.t('Wrong response format from the server'));

      return;
    }

    this.hideProgress().then(() => {
      this.nodes.inputHolder?.remove();
      this.showLinkPreview(metaData);
    });
  }

  /**
   * 处理链接获取错误
   *
   * @private
   *
   * @param errorMessage - message to explain user what he should do
   */
  fetchingFailed(errorMessage: string) {
    this.api.notifier.show({
      message: errorMessage,
      style: 'error',
    });

    this.applyErrorStyle();
  }

  /**
   * 辅助方法用于元素创建
   *
   * @param tagName - name of creating element
   * @param classNames - list of CSS classes to add
   * @param attributes - object with attributes to add
   */
  make<T extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementTagNameMap[T]>(tagName: T, classNames?: string | string[], attributes?: Record<K, string>): HTMLElementTagNameMap[T] {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      // @ts-ignore
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}