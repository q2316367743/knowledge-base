package xyz.esion.knowledgebase.service.impl;

import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import xyz.esion.knowledgebase.dao.DbRecordDao;
import xyz.esion.knowledgebase.entity.DbRecord;
import xyz.esion.knowledgebase.service.DbRecordService;

import java.util.Optional;

/**
 * @author Esion
 * @since 2023/10/29
 */
@Service
@RequiredArgsConstructor
public class DbRecordServiceImpl implements DbRecordService {

    private final DbRecordDao dao;

    @Override
    public DbRecord get(String _id) {
        Optional<DbRecord> record = dao.findById(_id);
        return record.orElse(null);
    }

    @Override
    public String put(DbRecord record) {
        Optional<DbRecord> old = dao.findById(record.get_id());
        long time = System.currentTimeMillis();
        int version = 0;
        if (StrUtil.isNotEmpty(record.get_rev())) {
            try {
                String[] split = record.get_rev().split("-");
                version = Integer.parseInt(split[0]);
            } catch (Exception ignore) {
            }
        }

        if (old.isPresent()) {
            DbRecord dbRecord = old.get();
            int oldVersion = Integer.parseInt(dbRecord.get_rev().split("-")[0]);
            Assert.isTrue(oldVersion <= version, "Document update conflict");
        }
        String _rev = version + 1 + "-" + time;

        dao.save(new DbRecord()
                .set_id(record.get_id())
                .set_rev(_rev)
                .setValue(record.getValue()));
        return _rev;
    }

    @Override
    public void remove(String _id) {
        dao.deleteById(_id);
    }

}
