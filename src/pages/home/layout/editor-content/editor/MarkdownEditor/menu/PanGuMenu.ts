import Cherry from "cherry-markdown";
import {spacing} from 'pangu';

/**
 * 截屏菜单
 */
export const usePanGu = () => {
    return Cherry.createMenuHook('盘古之白',  {
        onClick: function(selection: string) {
            return spacing(selection)
        }
    });
}
