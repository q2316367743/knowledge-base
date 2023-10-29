package xyz.esion.knowledgebase.config;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import xyz.esion.knowledgebase.entity.Result;

/**
 * @author Esion
 * @since 2023/10/29
 */
@RestControllerAdvice
public class ExceptionConfig {

    @ExceptionHandler(Exception.class)
    public Result<Void> error(Exception e) {
        return Result.fail(e.getMessage());
    }

}
