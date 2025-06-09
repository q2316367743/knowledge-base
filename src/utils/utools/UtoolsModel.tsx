import {DialogPlugin, Image, Paragraph} from "tdesign-vue-next";
import reward from "@/assets/image/reward.png";

/**
 * 诚信付款
 */
export function openPayInGoodFaith() {
  return new Promise<void>((resolve, reject) => {
    const dp = DialogPlugin({
      header: '赏赞',
      placement: 'center',
      width: 440,
      default: () => <div>
        <Paragraph>本项目采用诚信付款模式，购买笔记会员仅需7元</Paragraph>
        <Image src={reward}/>
      </div>,
      confirmBtn: '我已诚信付款',
      onConfirm() {
        resolve();
        dp.destroy();
      },
      onCancel() {
        reject();
        dp.destroy();
      }
    });
  })

}