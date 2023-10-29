package xyz.esion.knowledgebase.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2023/10/29
 */
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private final Integer code;

    private final String message;

    private T data;

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    public static <T> Result<T> success() {
        return new Result<>(200, "success");
    }

    public static Result<Void> fail(String message) {
        return new Result<>(500, message);
    }

}
