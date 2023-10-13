import Mammoth from 'mammoth';
import CherryEngine from 'cherry-markdown/dist/cherry-markdown.engine.core';

export const docxToMarkdown = async (file: ArrayBuffer): Promise<string> => {
    // docx转html
    const resultObject = await Mammoth.convertToHtml({arrayBuffer: new Uint8Array(file)})
        const html = resultObject.value;
    // html转markdown
    const engine = new CherryEngine({});
    return engine.engine.makeMarkdown(html);
}
