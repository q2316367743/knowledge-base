import Cherry from "cherry-markdown";
import {sendMessage} from "@/store/setting/ChatSettingStore";

export const useAskAi = () => {
    return Cherry.createMenuHook('问问AI',  {
        onClick: function(selection: string) {
            sendMessage(selection)
            return ""
        }
    });
}

