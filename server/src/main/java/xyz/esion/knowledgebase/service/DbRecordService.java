package xyz.esion.knowledgebase.service;

import xyz.esion.knowledgebase.entity.DbRecord;

/**
 * @author Esion
 * @since 2023/10/29
 */
public interface DbRecordService {

    /**
     * 根据ID获取内容
     * @param _id ID
     * @return 内容
     */
    DbRecord get(String _id);

    /**
     * 新增记录
     * @param record 记录内容
     * @return 恢复值
     */
    String put(DbRecord record);

    /**
     * 删除记录
     * @param _id 记录ID
     */
    void remove(String _id);

}
