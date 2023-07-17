
export function onAfterRender() {
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
