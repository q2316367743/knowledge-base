import {CommonResult} from "@/plugin/sdk/LskyPro";
import {utools} from "@/plugin/utools";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Descriptions, DescriptionsItem, Link, Modal} from "@arco-design/web-vue";
import {h} from "vue";

export function copyUrl(item: CommonResult) {
    utools.copyText(item.links.url);
    MessageUtil.success("成功复制到剪切板");
}

export function copyMarkdown(item: CommonResult) {
    utools.copyText(item.links.markdown);
    MessageUtil.success("成功复制到剪切板");
}

export function openInfo(item: CommonResult) {
    Modal.open({
        title: "图片信息",
        width: "600px",
        content: () => h(Descriptions, {
            bordered: true,
            column: 1,
            width: 400,
            footer: false
        }, () => ([
            h(DescriptionsItem, {
                label: "图片唯一秘钥"
            }, () => (item.key)),
            h(DescriptionsItem, {
                label: "图片名称"
            }, () => (item.name)),
            h(DescriptionsItem, {
                label: "图片原始名称"
            }, () => (item.origin_name)),
            h(DescriptionsItem, {
                label: "图片大小"
            }, () => (item.size + " KB")),
            h(DescriptionsItem, {
                label: "md5"
            }, () => (item.md5)),
            h(DescriptionsItem, {
                label: "sha1"
            }, () => (item.sha1)),
            h(DescriptionsItem, {
                label: "链接"
            }, () => ([
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.url);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制链接")),
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.html);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制html")),
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.markdown);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制markdown")),
                h(Link, {
                    onClick: () => {
                        utools.copyText(item.links.markdown_with_link);
                        MessageUtil.success("成功复制到剪切板");
                    }
                }, () => ("复制链接的markdown"))
            ]))
        ]))
    })
}
