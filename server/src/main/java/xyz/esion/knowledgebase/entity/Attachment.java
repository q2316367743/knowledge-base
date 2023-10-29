package xyz.esion.knowledgebase.entity;

import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * @author Esion
 * @since 2023/10/29
 */
@Data
@Accessors(chain = true)
public class Attachment implements Serializable {

    private static final long serialVersionUID = 1L;

    private String _id;

    private String extra;

    private String path;

}
