import {loadImageByAsync, loadImageBySync} from "@/components/markdown-editor/common";

export function onAfterRender(callback: (url: string) => void) {
    document.querySelectorAll("#article-container img")
        .forEach((image: any) => {
            if (image.src.startsWith("attachment:")) {
                const attachmentId = image.src.split(':')[1];
                loadImageByAsync(attachmentId).then(url => {
                    image.src = url;
                    image.onclick = () => window.onImagePreview(image.src)
                })
            } else {
                image.onclick = () => window.onImagePreview(image.src)
            }
        })
}

export function renderTemplate(
    name: string,
    content: string
) {
    return `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8"/>
    <link rel="icon" type="image/png" href="/logo.png"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="referrer" content="never">
    <title>${name}</title>
</head>
<body>
<div id="app">${content}</div>
</body>
</html>
`;
}
