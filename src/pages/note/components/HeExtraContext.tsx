import {ColorPickerPanel, DialogPlugin, FormItem, Switch} from "tdesign-vue-next";
import {useArticleStore, useFolderStore} from "@/store";
import {isNotEmptyString} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";

function getColor(id: number, note: boolean): { color: string, diffusion: boolean } {
  if (note) {
    const article = useArticleStore().articleMap.get(id);
    if (article) {
      return {color: article.fontColor || '', diffusion: false}
    }
  } else {
    const folder = useFolderStore().folderMap.get(id);
    if (folder) {
      return {color: folder.fontColor || '', diffusion: folder.diffusion || false}
    }
  }

  return {color: '', diffusion: false};
}

/**
 * 设置颜色
 * @param id ID
 * @param note 是否是文章
 */
export function setColor(id: number, note: boolean) {
  const old = getColor(id, note);

  const active = ref(isNotEmptyString(old.color))
  const color = ref(old.color);
  const diffusion = ref(old.diffusion);

  // 获取数据

  const plugin = DialogPlugin({
    header: '设置颜色',
    placement: 'center',
    confirmBtn: '设置',
    default: () => <div>
      <FormItem label={'是否可用'} labelAlign={'top'}>
        <Switch v-model={active.value}/>
      </FormItem>
      {active.value && <FormItem label={'颜色'} labelAlign={'top'}>
        <ColorPickerPanel v-model={color.value} colorModes={['monochrome']} recentColors={false}
                          swatchColors={[]}/>
      </FormItem>}
      {!note && <FormItem label={'扩散'} labelAlign={'top'}
                          help={'如果开启，则此文件夹下创建的文章会自动附带此颜色，仅限于此文件夹下的文章'}>
        <Switch v-model={diffusion.value}/>
      </FormItem>}
    </div>,
    onConfirm: () => {
      (note ? useArticleStore().updateIndex(id, {
        fontColor: active.value ? color.value : '',
      }) : useFolderStore().update(id, {
        fontColor: active.value ? color.value : '',
        diffusion: diffusion.value,
      })).then(() => {
        MessageUtil.success('设置成功');
        plugin.destroy();
      }).catch(e => MessageUtil.error('设置失败', e));
    },
  })
}