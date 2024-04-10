export interface CardTodoSetting {
    categoryId: number | null;
}

export function buildCardTodoSetting(): CardTodoSetting {
    return {
        categoryId: null
    }
}
