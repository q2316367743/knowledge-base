import Cherry from "cherry-markdown";

export const useAskAi = (id: number, callback: (content: string) => void) => {
    return Cherry.createMenuHook('问问AI', {
        onClick: function (selection: string) {
            callback(selection)
            return ""
        }
    });
}

