export interface CardTodoSetting {
    categoryId: number | undefined;
}

export function buildCardTodoSetting(): CardTodoSetting {
    return {
        categoryId: undefined
    }
}
