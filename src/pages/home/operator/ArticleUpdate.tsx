import {Checkbox, ColorPicker, Modal, Typography, TypographyParagraph} from "@arco-design/web-vue";
import {ref} from "vue";

/**
 * 更新文章或文件夹标题颜色
 * @param id 文章或文件夹id
 * @param color 当前的颜色
 * @param article 是否是文章
 */
export function updateFontColor(id: number, color: string, article: boolean) {
  const system = ref(false);
  const oldColor = ref(color);
  Modal.open({
    title: '更新标题颜色',
    content: () => <Typography>
      <TypographyParagraph>请选择新的标题颜色</TypographyParagraph>
      <TypographyParagraph>
        <Checkbox v-model={system.value}>使用系统颜色</Checkbox>
      </TypographyParagraph>
      <TypographyParagraph>
        <ColorPicker v-model={oldColor.value} disabled={system.value}></ColorPicker>
      </TypographyParagraph>
    </Typography>,
    okText: '设置',
    onOk() {

    }
  })
}