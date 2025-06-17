export interface ThemeSetting {
  lightBgImage: string;
  darkBgImage: string;
  // 是否启用
  enabled: boolean;
  // 背景模糊像素
  bgBlur: number;
}

export const defaultThemeSetting = (): ThemeSetting => ({
  lightBgImage: '',
  darkBgImage: '',
  enabled: false,
  bgBlur: 5,
})