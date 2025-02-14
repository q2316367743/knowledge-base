import {base64toBlob} from "@/utils/BrowserUtil";
import {postAttachment} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useSnowflake} from "@/hooks/Snowflake";
import {BASE64_PREFIX} from "@/global/Constant";

export async function useAttachmentUploadByUtools(data: Blob | File | string): Promise<string> {
  if (typeof data === 'string') {
    data = base64toBlob(data.replace(BASE64_PREFIX, ""));
  }
  const id = useSnowflake().nextId();
  const docId = LocalNameEnum.ARTICLE_ATTACHMENT + id;
  await postAttachment(
    docId,
    data
  );
  return docId;
}