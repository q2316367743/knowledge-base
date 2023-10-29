package xyz.esion.knowledgebase.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import xyz.esion.knowledgebase.entity.Attachment;
import xyz.esion.knowledgebase.entity.PageResult;
import xyz.esion.knowledgebase.entity.Result;
import xyz.esion.knowledgebase.service.AttachmentService;

import java.io.IOException;

/**
 * @author Esion
 * @since 2023/10/29
 */
@RestController
@RequestMapping("api/attachment")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    /**
     * 上传附件
     *
     * @param key  附件的key
     * @param file 附件
     * @return 附件链接
     */
    @PostMapping("post")
    public Result<String> post(
            @RequestParam("key") String key,
            @RequestParam("file") MultipartFile file) throws IOException {
        return Result.success(attachmentService.post(key, file));
    }

    /**
     * 读取附件
     *
     * @param fullName  附件的key
     * @return 附件内容
     */
    @GetMapping("get/{fullName}")
    public ResponseEntity<byte[]> get(@PathVariable String fullName) {
        byte[] bytes = attachmentService.get(fullName);
        return ResponseEntity.ok()
                .contentLength(bytes.length)
                .body(bytes);
    }

    /**
     * 分页查询附件
     *
     * @param page 页码
     * @param size 页数
     * @return 分页查询
     */
    public Result<PageResult<Attachment>> page(int page, int size) {
        return Result.success(attachmentService.page(page, size));
    }

    /**
     * 删除一个附件
     *
     * @param _id 附件ID
     */
    @DeleteMapping("delete")
    public Result<Void> remove(String _id) {
        attachmentService.remove(_id);
        return Result.success();
    }

}
