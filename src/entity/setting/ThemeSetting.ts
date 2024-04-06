export interface ThemeSetting {

    theme: number;

    markdownMenus: Array<number>;

    markdownSyntaxes: Array<number>;

}

export const getDefaultThemeSetting = (): ThemeSetting => ({
    theme: 0,
    markdownMenus: [],
    markdownSyntaxes: []
})
