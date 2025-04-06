import {NoteImportGroup} from "@/modules/NoteImport/types";

export const NoteImportGroups: Array<NoteImportGroup> = [{
  id: '0',
  name: '博客平台',
  items: [{
    "id": "000",
    "name": "CSDN",
    "regex": /.*blog.csdn.net.*/,
    "title": "#articleContentId",
    "body": "#content_views",
    "timeout": 5000,
    "headers": {},
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
  }, {
    "id": "001",
    "name": "博客园",
    "regex": /.*www.cnblogs.com.*/,
    "title": "#cb_post_title_url",
    "body": "#cnblogs_post_body",
    "timeout": 5000,
    "headers": {},
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
  }, {
    "id": "002",
    "name": "51cto",
    "regex": /.*blog.51cto.com.*/,
    "body": "#container",
    "timeout": 5000,
    "headers": {},
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
  }, {
    "id": "003",
    "name": "语雀",
    "regex": /.*www.yuque.com.*/,
    "body": ".ne-viewer-body",
    "timeout": 5000,
    "headers": {},
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
  }, {
    "id": "004",
    "name": "segmentfault",
    "regex": /.*segmentfault.com.*/,
    "body": ".article",
    "timeout": 5000,
    "headers": {},
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
  }]
}, {
  id: "1",
  name: "微信公众号",
  items: [{
    id: "105",
    name: "微信公众号",
    regex: /.*mp.weixin.qq.com.*/,
    wait: 1000,
    title: "#activity-name",
    body: "#js_content",
    timeout: 5000,
    headers: {},
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
  }]
}]