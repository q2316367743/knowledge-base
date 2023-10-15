import {BlockToolConstructorOptions} from "@editorjs/editorjs";
import {loadImageByAsync, useImageUpload} from "@/components/markdown-editor/common";

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
            title: 'utools图片',
            icon: '<svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M512 512m-509.449808 0a509.449808 509.449808 0 1 0 1018.899616 0 509.449808 509.449808 0 1 0-1018.899616 0Z" p-id="4224"></path><path d="M273.066667 205.682759l194.128429 103.302375a24.521073 24.521073 0 0 1 10.122299 33.152491l-4.708046 8.847203a65.127969 65.127969 0 0 1-88.079694 26.894712l-194.658084-103.577011a24.521073 24.521073 0 0 1-8.964904-34.0941l4.43341-8.317548a65.127969 65.127969 0 0 1 88.079693-26.894712z" fill="#B084CC" p-id="4225"></path><path d="M149.362759 370.994023l282.090421 150.127816a67.089655 67.089655 0 0 1 26.933946 90.10023 24.521073 24.521073 0 0 1-33.15249 10.141916L144.144674 471.785441a67.089655 67.089655 0 0 1-27.71862-90.747587 24.521073 24.521073 0 0 1 32.917088-10.043831z" fill="#ACFCD9" p-id="4226"></path><path d="M355.65364 876.559693l-2.197088-220.493486a24.521073 24.521073 0 0 1 24.266053-24.776092l9.416092-0.078467a65.127969 65.127969 0 0 1 65.775326 64.460996l2.197088 219.120306a24.521073 24.521073 0 0 1-24.28567 24.776092l-9.416092 0.098084a65.127969 65.127969 0 0 1-65.755709-63.107433z" fill="#B084CC" p-id="4227"></path><path d="M575.970575 917.912031l-2.00092-319.558621a67.089655 67.089655 0 0 1 66.481533-67.285824 24.521073 24.521073 0 0 1 24.658391 24.344521l2.020536 319.166284a67.089655 67.089655 0 0 1-66.677701 67.501609 24.521073 24.521073 0 0 1-24.481839-24.167969z" fill="#ACFCD9" p-id="4228"></path><path d="M926.111877 451.168123l-181.848275 123.664674a24.521073 24.521073 0 0 1-34.074483-6.473563l-5.296552-7.80751a65.127969 65.127969 0 0 1 17.243218-90.47295l181.985594-123.782376a24.521073 24.521073 0 0 1 34.388353 6.277395l5.296552 7.787893a65.127969 65.127969 0 0 1-17.223602 90.47295z" fill="#B084CC" p-id="4229"></path><path d="M856.668199 261.002299L592.586054 440.594636a67.089655 67.089655 0 0 1-93.199694-17.73364 24.521073 24.521073 0 0 1 6.473563-34.074483l263.925211-179.494252a67.089655 67.089655 0 0 1 93.199694 17.753256 24.521073 24.521073 0 0 1-6.316629 33.956782z" fill="#ACFCD9" p-id="4230"></path></svg>'
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
        loadImageByAsync(this.data.url)
            .then(src => img.src = src);
        return img;
    }

    private uploadFile(file: File) {
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
            });
    }

    save(blockContent: HTMLInputElement | HTMLImageElement): UtoolsImageData {
        return this.data
    }
}
