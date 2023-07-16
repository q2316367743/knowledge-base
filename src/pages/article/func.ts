import hljs from "highlight.js";

export function onAfterRender() {
    hljs.highlightAll();
    document.querySelectorAll("#article-container a")
        .forEach((ele: any) => {
            ele.onclick = () => {
                utools.shellOpenExternal(ele.href)
            }
        });
    document.querySelectorAll("#article-container img")
        .forEach((ele: any) => {
            ele.onclick = () => window.onImagePreview(ele.src)
        })
}
