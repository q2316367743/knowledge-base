package xyz.esion.knowledgebase.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import xyz.esion.knowledgebase.dao.AttachmentDao;
import xyz.esion.knowledgebase.entity.Attachment;
import xyz.esion.knowledgebase.entity.PageResult;
import xyz.esion.knowledgebase.service.AttachmentService;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

/**
 * @author Esion
 * @since 2023/10/29
 */
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentDao dao;

    @Override
    public String post(String key, MultipartFile file) throws IOException {
        // 上传文件
        LocalDate now = LocalDate.now();
        String extra = FileUtil.extName(file.getOriginalFilename());
        String fullName = System.currentTimeMillis() + StrUtil.DOT + extra;
        String path = CollUtil.join(CollUtil.newArrayList(now.getYear(), now.getMonthValue(), fullName),
                File.separator);
        FileUtil.writeBytes(file.getBytes(), path);
        dao.save(new Attachment()
                .set_id(fullName)
                .setExtra(extra)
                .setPath(path));
        return "api/attachment/get/" + fullName;
    }

    @Override
    public byte[] get(String key) {
        Optional<Attachment> attachment = dao.findById(key);
        if (attachment.isEmpty()) {
            return new byte[0];
        }
        return FileUtil.readBytes(attachment.get().getPath());
    }

    @Override
    public PageResult<Attachment> page(int page, int size) {
        Page<Attachment> attachmentPage = dao.findAll(Pageable.ofSize(size).withPage(page));
        return PageResult.<Attachment>builder()
                .page(page)
                .size(size)
                .total(attachmentPage.getTotalPages())
                .record(attachmentPage.getContent())
                .build();
    }

    @Override
    public void remove(String _id) {
        Optional<Attachment> attachment = dao.findById(_id);
        if (attachment.isEmpty()) {
            return;
        }
        String path = attachment.get().getPath();
        try {
            FileUtil.del(path);
        } catch (Exception ignore) {
        }
    }
}
