import JSZip from "jszip";
import {download} from "@/utils/BrowserUtil";
import {toDateString} from "@/utils/lang/FormatUtil";
import {commonAsset} from "@/components/ArticleExport/exportForCommon";

/**
 * 导出文章为epub文件
 * @param folder 文章文件夹ID
 */
export async function exportForEpub(folder: number) {
    const epub = new JSZip();


    // META-INF
    epub.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles> 
</container>`);
// OEBPS
    // content.opf
    epub.file("OEBPS/content.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
  <metadata>
    <dc:title>知识库</dc:title>
    <dc:language>zh-CN</dc:language>
    <dc:creator>${utools.getUser()?.nickname || "匿名"}</dc:creator>
    <dc:identifier id="bookid">urn:uuid:00000000-0000-000000000000</dc:identifier>
    <dc:date>${toDateString(new Date(), "YYYY-MM-DD")}</dc:date>
    <dc:contributor>知识库 [https://u.tools/plugins/detail/%E7%9F%A5%E8%AF%86%E5%BA%93/]</dc:contributor>
    <meta property="dcterms:modified">${toDateString(new Date(), "YYYY-MM-DDTHH:mm:ssZ")}</meta>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="cover" href="assets/logo.jpg" media-type="image/jpeg"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="content" href="content.html" media-type="application/xhtml+xml"/>
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="assets" href="assets/" media-type="application/octet-stream"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`);
    // toc.ncx
    epub.file("OEBPS/toc.ncx", `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:00000000-0000-000000000000"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>知识库</text>
  </docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel>
        <text>目录</text>
      </navLabel>
      <content src="content.html#nav"/>
    </navPoint>
  </navMap>
</ncx>`);
    // TODO: 公共资源处理
    await commonAsset(epub, '/OEBPS/assets/');
    // 默认文件
    epub.file("mimetype", "application/epub+zip");
    // 导出epub文件
    const blob = await epub.generateAsync({type: "arraybuffer"});
    download(blob,
        "知识库|" + toDateString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".epub",
        "application/epub+zip");
}
