export interface AttachmentUpload {
  upload: (data: Blob | File | string) => Promise<string>;
  render: (url: string) => string;
}