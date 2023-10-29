package xyz.esion.knowledgebase.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import xyz.esion.knowledgebase.entity.DbRecord;
import xyz.esion.knowledgebase.entity.Result;
import xyz.esion.knowledgebase.service.DbRecordService;

/**
 * @author Esion
 * @since 2023/10/29
 */
@RestController
@RequestMapping("api/db")
@RequiredArgsConstructor
public class DbRecordController {

    private final DbRecordService dbRecordService;

    /**
     * 根据ID获取内容
     * @param _id ID
     * @return 内容
     */
    @GetMapping("get")
    public Result<DbRecord> get(@RequestParam String _id) {
        return Result.success(dbRecordService.get(_id));
    }

    /**
     * 新增记录
     * @param record 记录内容
     * @return 恢复值
     */
    @PostMapping("put")
    public Result<String> put(@RequestBody DbRecord record) {
        return Result.success(dbRecordService.put(record));
    }

    /**
     * 删除记录
     * @param _id 记录ID
     */
    @DeleteMapping("remove")
    public Result<Void> remove(String _id) {
        dbRecordService.remove(_id);
        return Result.success();
    }

}
