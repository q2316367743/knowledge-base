function htmlDecode(text: string): string {
    let temp = document.createElement("div");
    temp.innerHTML = text;
    let output = temp.innerText || temp.textContent;
    return output || '';
}

/**
 * 创建博客目录
 * @param id 文章ID
 * @param interval 间隔
 * @param toc 目录容器
 */
function createBlogDirectory(
    id: string, interval: number,
    toc: HTMLDivElement
) {
    //获取博文正文div容器
    let elem = document.getElementById(id);
    if (!elem) return false;
    //获取div中所有元素结点
    let nodes = elem.getElementsByTagName("*");
    let tocContents = document.createElement('DIV');
    tocContents.style.display = 'none';
    tocContents.setAttribute('id', 'sideBarContents');
    toc.appendChild(tocContents);
    //创建自定义列表
    let dlist = document.createElement("dl");
    tocContents.appendChild(dlist);
    let num = 0;//统计找到的mt和st
    //遍历所有元素结点
    for (let i = 0; i < nodes.length; i++) {
        let tits = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
        if (tits.indexOf(nodes[i].nodeName) !== -1) { // nodes[i].nodeName == mt|| nodes[i].nodeName == st
            //获取标题文本
            let nodetext = nodes[i].innerHTML.replace(/<\/?[^>]+>/g, "");//innerHTML里面的内容可能有HTML标签，所以用正则表达式去除HTML的标签
            nodetext = htmlDecode(nodetext);
            //插入锚
            nodes[i].setAttribute("id", "blogTitle" + num);
            let item;
            switch (nodes[i].nodeName) {
                case 'H1':    //若为主标题
                    item = document.createElement("dt");
                    break;
                case 'H3':
                    item = document.createElement("dd");
                    item.setAttribute('class', 'indent3');//通过CSS样式定义距离
                    break;
                case 'H4':
                    item = document.createElement("dd");
                    item.setAttribute('class', 'indent4');
                    break;
                case 'H5':
                    item = document.createElement("dd");
                    item.setAttribute('class', 'indent5');
                    break;
                case 'H6':
                    item = document.createElement("dd");
                    item.setAttribute('class', 'indent6');
                    break;
                default:    //若为子标题
                    item = document.createElement("dd");
                    break;
            }

            //创建锚链接
            let itemtext = document.createTextNode(nodetext);
            item.className = item.className + ' arco-link'
            item.appendChild(itemtext);
            item.setAttribute("name", num + '');
            //添加鼠标点击触发函数
            item.onclick = function () {
                nodes[i].scrollIntoView();
            };

            //将自定义表项加入自定义列表中
            dlist.appendChild(item);
            num++;
        }
    }
    tocContents.style.display = 'block';

}


export default createBlogDirectory;
