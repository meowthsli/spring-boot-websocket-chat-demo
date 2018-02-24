package org.wolna.ouchatserver.model;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import org.apache.ignite.cache.query.annotations.QuerySqlField;
import org.wolna.ouchat.Envelope;

/**
 * Conversation with user
 * @author yurij
 */
public class Conversation implements Serializable {
    
    public Conversation(long companyId) {
        this.companyId = companyId;
    }
    
    private final long companyId;

    public long getCompanyId() {
        return companyId;
    }
    
    private Envelope.UserDescription client;

    public Envelope.UserDescription getClientLogin() {
        return client;
    }
    
    public void setDesc(Envelope.UserDescription client) {
        this.client = client;
    }
    
}
