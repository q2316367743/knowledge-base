import {useFeedbackPost} from "@/nested/feedback/apis/common";

export function fileUpload(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return useFeedbackPost<string>(`/file/upload`, formData);
}