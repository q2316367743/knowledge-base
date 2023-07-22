export function onAfterRender() {
    document.querySelectorAll("#article-container img")
        .forEach((ele: any) => {
            ele.onclick = () => window.onImagePreview(ele.src)
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
