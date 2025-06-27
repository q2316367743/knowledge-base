export type TodoInstanceView = 'list' | 'note';

export interface ITodoInstance {
  getView(): TodoInstanceView;
  setView(view: TodoInstanceView): void;
}

export const TodoInstance = Symbol() as InjectionKey<ITodoInstance>;