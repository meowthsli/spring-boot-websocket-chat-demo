package org.wolna.ouchatserver.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.cache.Cache;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteAtomicLong;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.cache.query.FieldsQueryCursor;
import org.apache.ignite.cache.query.QueryCursor;
import org.apache.ignite.cache.query.SqlFieldsQuery;
import org.apache.ignite.cache.query.SqlQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.wolna.ouchat.Envelope;

/**
 *
 * @author yurij
 */
public class ConversationsImpl implements Conversations {
    @Autowired @Qualifier("messages")
    IgniteCache<Long, Message> messages;
    
    @Autowired @Qualifier("convsMeta")
    IgniteCache<String, Conversation> convsMeta;
    
    @Autowired
    Ignite ignite;
    
    @Autowired
    ApiKeyRepository keys;
    
    @PostConstruct
    void onCreate() {
        messageIdGen = ignite.atomicLong(
                "messageIdGen", // Atomic long name.
                getMaxId() + 10, // Initial value.
                true);     		// Create if it does not exist.
    }
    private IgniteAtomicLong messageIdGen;

    @Override
    public void initConversation(Envelope.UserDescription desc, String who, String apiKeyValue) {
        Conversation cons = convsMeta.get(who);
        if(cons == null) {
            cons = new Conversation(keys.findCompanyIdByKeyValue(apiKeyValue));
        }
        // update description: set desc, time, etc..
        cons.setDesc(desc);
        // put meta back
        convsMeta.put(who, cons);
    }

    @Override
    public void updateOperator(String clientLogin, Envelope.UserDescription operator) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public long addClientMessage(String clientLogin, String message) {
        Message m = new Message();
        m.msgId = messageIdGen.incrementAndGet();
        m.text = message;
        m.clientLogin = clientLogin;
        m.created = Instant.now();
        m.fromClient = true;
        messages.put(m.msgId, m);
        return m.msgId;
    }
    
    @Override
    public long addOpMessage(String clientLogin, String message) {
        Message m = new Message();
        m.msgId = messageIdGen.incrementAndGet();
        m.text = message;
        m.clientLogin = clientLogin;
        m.created = Instant.now();
        m.fromClient = false;
        messages.put(m.msgId, m);
        return m.msgId;
    }
    
     private SqlQuery createHistoryQuery(String who, long lastSeen) {
        SqlQuery q = new SqlQuery(Message.class, "clientLogin = ? and msgId < ? ORDER BY msgId DESC");
        q.setPageSize(60);
        q.setArgs(who, lastSeen > 0 ? lastSeen : Long.MAX_VALUE);
        return q;
    }

    @Override
    public Collection<Message> loadHistory(String clientLogin, Long lastSeenId) {
        SqlQuery q = createHistoryQuery(clientLogin, lastSeenId);
        
        // take last 50
        final int LAST_N = 50;
        int msgCount = 0;
        List<Message> msg = new ArrayList<>();
        try (QueryCursor<Cache.Entry<Long, Message>> cursor = messages.query(q)) {
            for(Cache.Entry<Long, Message> e: cursor) {
                msg.add(e.getValue()); // todo: add real messages
                if(msgCount++ > LAST_N) {
                    break;
                }
            }
        }
        
        return msg;
    }

    @Override
    public void lockConversation(String clientLogin) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    private long getMaxId() {
        SqlFieldsQuery q = new SqlFieldsQuery("select MAX(msgId) from Message");
        try(FieldsQueryCursor<List<?>> cc = messages.query(q)){
            for (List<?> row : cc.getAll()) {
                return row.get(0) == null ? 1000L : (Long)row.get(0);
            }
        }
        return 1000L;
    }

}
