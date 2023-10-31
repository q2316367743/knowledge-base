export interface ThemeSetting {

    /**
     * 背景图片
     */
    backgroundImage: string;

    /**
     * 文字颜色
     */
    textColor: string;

    /**
     * 背景颜色
     */
    bgColor: string;

    /**
     * 主要颜色
     */
    primaryColor: string;

}

export const getDefaultThemeSetting = (): ThemeSetting => ({
    backgroundImage: "",
    bgColor: "var(--color-bg-1)",
    primaryColor: "rgb(var(--arcoblue-6))",
    textColor: "var(--color-text-1)"
})
