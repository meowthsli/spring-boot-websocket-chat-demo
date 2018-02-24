package org.wolna.ouchatserver.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.cache.Cache;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteAtomicLong;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.cache.query.QueryCursor;
import org.apache.ignite.cache.query.SqlQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.wolna.ouchat.Envelope;
import org.wolna.ouchatserver.model.Conversations;

/**
 *
 * @author yurij
 */
public class ConversationsImpl implements Conversations {
    @Autowired @Qualifier("messages")
    IgniteCache<Long, Message> messages;
    
    @Autowired @Qualifier("convsMeta")
    IgniteCache<String, Conversation> convsMeta;
    
    @Autowired @Qualifier("messageIdGen")
    IgniteAtomicLong messageIdGen;
    
    @Autowired
    ApiKeyRepository keys;

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

        // TODO: add test message
        Message m = new Message();
        m.clientLogin = who ;
        m.at = Instant.now();
        m.id = 0;
        m.text = "hello";
        messages.put(0L, m);
    }

    @Override
    public void updateOperator(String clientLogin, Envelope.UserDescription operator) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public long addMessage(String clientLogin, String message) {
        Message m = new Message();
        m.id = messageIdGen.incrementAndGet();
        m.text = message;
        m.clientLogin = clientLogin;
        m.at = Instant.now();
        messages.put(m.id, m);
        return m.id;
    }
    
     private SqlQuery createHistoryQuery(String who, long lastSeen) {
        SqlQuery q = new SqlQuery(Message.class, "clientLogin = ? and id < ?");
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

}
