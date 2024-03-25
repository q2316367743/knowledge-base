import Cherry from "cherry-markdown";
import {useArticleAiEvent} from "@/store/components/HomeEditorStore";

export const useAskAi = (id: number) => {
    return Cherry.createMenuHook('问问AI', {
        onClick: function (selection: string) {
            useArticleAiEvent.emit({id, content: selection})
            return ""
        }
    });
}

