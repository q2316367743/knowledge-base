export interface AttachmentInfo {
  // 原始文件名
  filename: string;
  /**
   * KEY
   * @example 2025/06/18/123456.png
   */
  key: string;
  // 上传时间戳
  uploadTime: number;
  // 文件类型mine-type
  type: string;
  // 文件大小
  size: number;
  // 访问链接
  url: string;
}
