package xyz.esion.knowledgebase.service;

import org.springframework.web.multipart.MultipartFile;
import xyz.esion.knowledgebase.entity.Attachment;
import xyz.esion.knowledgebase.entity.PageResult;

import java.io.IOException;

/**
 * @author Esion
 * @since 2023/10/29
 */
public interface AttachmentService {

    /**
     * 上传附件
     *
     * @param key  附件的key
     * @param file 附件
     * @return 附件链接
     */
    String post(String key, MultipartFile file) throws IOException;

    /**
     * 读取附件
     *
     * @param key  附件的key
     * @return 附件内容
     */
    byte[] get(String key);

    /**
     * 分页查询附件
     *
     * @param page 页码
     * @param size 页数
     * @return 分页查询
     */
    PageResult<Attachment> page(int page, int size);

    /**
     * 删除一个附件
     *
     * @param _id 附件ID
     */
    void remove(String _id);

}
