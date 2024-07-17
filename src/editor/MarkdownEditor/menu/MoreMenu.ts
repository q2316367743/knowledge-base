import Cherry from "cherry-markdown";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";
import {ShallowRef} from "vue";

export const useMoreMenu = Cherry.createMenuHook('更多', {
    onClick: function() {}
});

export async function useMoreItemMenu(instance: ShallowRef<Cherry | undefined>) {
    const menus = await usePluginSettingStore().getPlugins(PluginSettingTypeEnum.MARKDOWN_MENU);
    return menus.map((menu, index) => ({
        name: `other-${index}`,
        hook: Cherry.createMenuHook(menu.name, {
            onClick: function(selection: string) {
                const func = new Function('selection', 'instance', menu.content);
                return func(selection, instance.value, Cherry);
            }
        })
    }));
}
