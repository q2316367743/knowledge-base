
export function onAfterRender() {
    document.querySelectorAll("#article-container img")
        .forEach((ele: any) => {
            ele.onclick = () => window.onImagePreview(ele.src)
        })
}
