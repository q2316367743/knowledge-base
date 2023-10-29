package xyz.esion.knowledgebase.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import xyz.esion.knowledgebase.entity.Attachment;

/**
 * @author Esion
 * @since 2023/10/29
 */
public interface AttachmentDao extends MongoRepository<Attachment, String> {
}
