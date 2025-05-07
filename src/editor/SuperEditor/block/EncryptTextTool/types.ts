export interface EncryptTextData {
  text: string;
  password: string;
  height: number;
}

export function buildEncryptTextData(): EncryptTextData {
  return {
    text: '',
    password: '',
    height: 350
  };
}