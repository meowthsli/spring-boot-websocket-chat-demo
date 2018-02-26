package org.wolna.ouchatserver.model;

import java.io.Serializable;
import java.time.Instant;
import org.apache.ignite.cache.query.annotations.QuerySqlField;

/**
 *
 * @author yurij
 */
public class Message implements Serializable {

   /*@QuerySqlField(orderedGroups = {
        @QuerySqlField.Group(name = "histo_idx", order = 2, descending = true)})*/
    public Instant created;
    @QuerySqlField(index = true, orderedGroups = {
        @QuerySqlField.Group(name = "histo_idx", order = 0)})
    //@AffinityKeyMapped
    public String clientLogin;
    @QuerySqlField(orderedGroups = {
        @QuerySqlField.Group(name = "histo_idx", order = 1, descending = true)})
    public long msgId;
    public boolean fromClient;
    public String text;

    public Instant getAt() {
        return created;
    }

    public String getClientLogin() {
        return this.clientLogin;
    }
    /*public static class MessageKey implements Serializable {
    public String clientLogin;
    public long messageId;
    @Override
    public int hashCode() {
    int hash = 7;
    hash = 23 * hash + Objects.hashCode(this.clientLogin);
    hash = 23 * hash + (int) (this.messageId ^ (this.messageId >>> 32));
    return hash;
    }
    @Override
    public boolean equals(Object obj) {
    if (this == obj) {
    return true;
    }
    if (obj == null) {
    return false;
    }
    if (getClass() != obj.getClass()) {
    return false;
    }
    final MessageKey other = (MessageKey) obj;
    if (!Objects.equals(this.clientLogin, other.clientLogin)) {
    return false;
    }
    return true;
    }
    }*/

}
