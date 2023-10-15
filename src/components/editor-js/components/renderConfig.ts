import {EditorConfig} from "@editorjs/editorjs";
// 官方组件
import Header from "@editorjs/header/dist/bundle.js";
import InlineCode from "@editorjs/inline-code/dist/bundle.js";
import Link from "@editorjs/link/dist/bundle.js";
import LinkAutoComplete from "@editorjs/link-autocomplete/dist/link-autocomplete.js";
import Marker from "@editorjs/marker/dist/bundle.js";
import Underline from "@editorjs/underline/dist/bundle.js";
import List from "@editorjs/list/dist/bundle.js";
import CheckList from "@editorjs/checklist/dist/bundle.js";
import Quote from "@editorjs/quote/dist/bundle.js";
import Warning from "@editorjs/warning/dist/bundle.js";
import Table from "@editorjs/table/dist/table.js";
import Code from "@editorjs/code/dist/bundle.js";
import Raw from "@editorjs/raw/dist/bundle.js";
import Image from "@editorjs/image/dist/bundle.js";
import Attaches from "@editorjs/attaches/dist/bundle.js";
// 自定义组件
import {UtoolsImage} from "@/components/editor-js/plugins/UtoolsImage";
import {BilibiliVideo} from "@/components/editor-js/plugins/BiliBiliVideo";

export function renderConfig(modelValue: any, readOnly: boolean, emits: (event: "update:modelValue", ...args: any[]) => void): EditorConfig {
    let data = {
        "time": new Date().getTime(),
        "blocks": [],
        "version": "2.29.0-rc.1"
    };
    if (typeof modelValue === 'object' && data['version']) {
        data = modelValue;
    }
    return {
        holder: 'editor-js-editor',
        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        tools: {
            header: {
                class: Header,
                inlineToolbar: true
            },
            InlineCode: {
                class: InlineCode,
                inlineToolbar: true
            },
            Link: {
                class: Link,
                inlineToolbar: true
            },
            LinkAutoComplete: {
                class: LinkAutoComplete,
                inlineToolbar: true
            },
            Marker: {
                class: Marker,
                inlineToolbar: true
            },
            Underline: {
                class: Underline,
                inlineToolbar: true
            },
            list: List,
            checklist: CheckList,
            Quote: Quote,
            Warning: Warning,
            table: Table,
            Code: Code,
            Raw: Raw,
            UtoolsImage: UtoolsImage,
            Image: Image,
            BilibiliVideo: BilibiliVideo,
            Attaches: Attaches,
        },
        data: data,
        /**
         * onChange callback
         */
        onChange: (api) => {
            api.saver.save()
                .then(data => emits('update:modelValue', data))
                .catch(e => console.error('保存失败', e))
        },
        readOnly: readOnly
    }
}
