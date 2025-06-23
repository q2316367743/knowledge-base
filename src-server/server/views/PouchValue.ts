export interface PouchValue<T> {
  _id: string;
  _rev?: string;
  value: T;
}
