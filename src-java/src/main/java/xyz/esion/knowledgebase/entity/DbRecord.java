package xyz.esion.knowledgebase.entity;

import cn.hutool.json.JSONObject;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 数据记录
 *
 * @author Esion
 * @since 2023/10/29
 */
@Data
@Accessors(chain = true)
public class DbRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * ID。唯一主键
     */
    private String _id;

    /**
     * 恢复标记
     */
    private String _rev;

    /**
     * 所属用户
     */
    private String userId;

    /**
     * 存储值
     */
    private String value;

}
