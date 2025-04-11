export type EncryptEditorDataType = 'plaintext' | 'markdown' | 'rich-text'

export interface EncryptEditorData {
  text: string;
  password: string;
  type?: EncryptEditorDataType
}

export function buildEncryptEditorData(): EncryptEditorData {
  return {
    text: '',
    password: '',
  };
}