export interface EncryptEditorData {
  text: string;
  password: string;
}

export function buildEncryptEditorData(): EncryptEditorData {
  return {
    text: '',
    password: ''
  };
}