import {BlockToolConstructorOptions} from "@editorjs/editorjs";
import {useLoadImageByAsync, useImageUpload} from "@/plugin/image";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";

interface UtoolsImageData {

    url: string;

}

export class UtoolsImage {

    private readonly data: UtoolsImageData;
    private wrapper: HTMLDivElement | null = null;
    private readonly = false;

    constructor(ops: BlockToolConstructorOptions<UtoolsImageData>) {
        this.data = ops.data;
        this.readonly = ops.readOnly;
    }

    static get toolbox() {
        return {
            title: '图片',
            icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-file-image" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-2bc6460e="" style="font-size: 32px;"><path d="m26 33 5-6v6h-5Zm0 0-3-4-4 4h7Zm11 9H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2ZM17 19h1v1h-1v-1Z"></path></svg>'
        };
    }


    /**
     * Returns true to notify the core that read-only mode is supported
     *
     * @returns {boolean}
     */
    static get isReadOnlySupported() {
        return true;
    }

    render() {
        this.wrapper = document.createElement('div');
        if (this.data.url) {
            const img = this.renderImg();
            if (img) {
                this.wrapper.append(img);
            }
        } else {
            const upload = document.createElement('input');
            upload.type = 'file'
            upload.accept = "image/*";
            upload.disabled = this.readonly;
            upload.onchange = (e: Event) => {
                const files = upload.files;
                if (files) {
                    const file = files[0];
                    if (file) {
                        this.uploadFile(file);
                    }
                }
            }
            if (!this.readonly){
                // 不是只读，模拟点击
                upload.click();
            }
            this.wrapper.append(upload);
        }
        return this.wrapper;
    }

    private renderImg() {
        if (!this.wrapper) {
            return;
        }
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        useLoadImageByAsync(this.data.url)
            .then(src => img.src = src);
        return img;
    }

    private uploadFile(file: File) {
        useGlobalStore().startLoading("图片上传中");
        useImageUpload(file)
            .then(id => {
                // 数据赋值
                this.data.url = id;
                // 重新渲染
                const img = this.renderImg();
                if (img && this.wrapper) {
                    this.wrapper.innerHTML = '';
                    this.wrapper.append(img);
                }
            })
            .catch(e => MessageUtil.error("图片上传失败", e))
            .finally(() => useGlobalStore().closeLoading());
    }

    save(blockContent: HTMLInputElement | HTMLImageElement): UtoolsImageData {
        return this.data
    }
}
