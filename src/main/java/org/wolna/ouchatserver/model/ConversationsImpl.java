package org.wolna.ouchatserver.model;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.Instant;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import javax.annotation.PostConstruct;
import javax.cache.Cache;
import org.apache.ignite.Ignite;
import org.apache.ignite.IgniteAtomicLong;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.IgniteFileSystem;
import org.apache.ignite.cache.query.FieldsQueryCursor;
import org.apache.ignite.cache.query.QueryCursor;
import org.apache.ignite.cache.query.ScanQuery;
import org.apache.ignite.cache.query.SqlFieldsQuery;
import org.apache.ignite.cache.query.SqlQuery;
import org.apache.ignite.cache.query.TextQuery;
import org.apache.ignite.igfs.IgfsPath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.wolna.ouchat.Envelope;

/**
 *
 * @author yurij
 */
public class ConversationsImpl implements Conversations {

    @Autowired
    @Qualifier("messages")
    IgniteCache<Long, Message> messages;

    @Autowired
    @Qualifier("convsMeta")
    IgniteCache<String, Conversation> convsMeta;

    @Autowired
    @Qualifier("convLocks")
    IgniteCache<String, String> locks;

    @Autowired
    Ignite ignite;

    @Autowired
    ApiKeyRepository keys;

    @Autowired
    IgniteFileSystem files;

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
        if (cons == null) {
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
            for (Cache.Entry<Long, Message> e : cursor) {
                msg.add(e.getValue()); // todo: add real messages
                if (msgCount++ > LAST_N) {
                    break;
                }
            }
        }

        return msg;
    }

    private long getMaxId() {
        SqlFieldsQuery q = new SqlFieldsQuery("select MAX(msgId) from Message");
        try (FieldsQueryCursor<List<?>> cc = messages.query(q)) {
            for (List<?> row : cc.getAll()) {
                return row.get(0) == null ? 1000L : (Long) row.get(0);
            }
        }
        return 1000L;
    }

    @Override
    public void lock(String clientLogin, String operatorLogin) {
        this.locks.put(clientLogin, operatorLogin);
    }

    @Override
    public void release(String clientLogin) {
        this.locks.clear(clientLogin);
    }

    @Override
    public String whoLocked(String clientLogin) {
        if (!locks.containsKey(clientLogin)) {
            return null;
        };
        return locks.get(clientLogin);
    }

    @Override
    public List<String> search(String fio) {
        if (false) {
            ScanQuery<String, Conversation> qry = new ScanQuery<>((id, co) -> {
                return co.getClientInfo().fio.toUpperCase().contains(fio.toUpperCase());
            });
            List<String> res = new ArrayList<>();
            try (QueryCursor<String> cc = this.convsMeta.query(qry, e -> e.getKey())) {
                for (String id : cc) {
                    res.add(id);
                    if (res.size() >= 20) {
                        res.add("...");
                        break;
                    }
                }
            }
            return res;
        } else {
            TextQuery<String, Conversation> qry = new TextQuery<>(Conversation.class, fio);
            List<String> res = new ArrayList<>();
            try (QueryCursor<String> cc = this.convsMeta.query(qry, e -> e.getKey())) {
                for (String id : cc) {
                    res.add(id);
                    if (res.size() >= 20) {
                        res.add("...");
                        break;
                    }
                }
            }
            return res;
        }
    }

    @Override
    public AbstractMap.SimpleEntry<Long, String> addClientFile(String login, String filename, byte[] content) {
        // insert message to history
        AbstractMap.SimpleEntry<Long, String> res = addFile(filename, content);
        Message m = new Message();
        m.msgId = messageIdGen.incrementAndGet();
        m.contentReference = res.getValue();
        m.clientLogin = login;
        m.created = Instant.now();
        m.fromClient = true;
        messages.put(m.msgId, m);
        return res;  
    }

    @Override
    public AbstractMap.SimpleEntry<Long, String> addOpFile(String login, String filename, byte[] message) {
        // insert message to history   
        AbstractMap.SimpleEntry<Long, String> res = addFile(filename, message);
        Message m = new Message();
        m.msgId = messageIdGen.incrementAndGet();
        m.contentReference = res.getValue();
        m.clientLogin = login;
        m.created = Instant.now();
        m.fromClient = false;
        messages.put(m.msgId, m);
        return res;    
    }
    
    private AbstractMap.SimpleEntry<Long, String> addFile(String filename, byte[] content) {
        String fileuid = UUID.randomUUID().toString();
        IgfsPath filePath = new IgfsPath("/file_" + fileuid);
        if (!files.exists(filePath)) {
            synchronized (this) {
                if (!files.exists(filePath)) {
                    files.mkdirs(filePath);
                }
            }
        }
        IgfsPath fileContent = new IgfsPath(filePath, "content");
        IgfsPath fileName = new IgfsPath(filePath, "name");
        try (OutputStream outContent = files.create(fileContent, true); 
            OutputStream outName = files.create(fileName, true)) {
            outName.write(filename.getBytes("UTF-8"));
            outContent.write(content);
        } catch (IOException ex) {
            throw new RuntimeException("error writing file " + filename);
        }
        return new AbstractMap.SimpleEntry<>(messageIdGen.incrementAndGet(), fileuid);
    }

    @Override
    @SuppressWarnings("NestedAssignment")
    public AbstractMap.SimpleEntry<String, byte[]> findFile(String contentReference) {
        
        IgfsPath filePath = new IgfsPath("/file_" + contentReference);
        if (!files.exists(filePath)) {
            return null;
        }
        IgfsPath fileContent = new IgfsPath(filePath, "content");
        IgfsPath fileName = new IgfsPath(filePath, "name");
        try (InputStream inContent = files.open(fileContent); 
            InputStream inName = files.open(fileName)) {
            byte[] name = new byte[1000];
            inName.read(name);
            name[999] = 0;            
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int nRead;
            byte[] data = new byte[16384];
            while ((nRead = inContent.read(data, 0, data.length)) != -1) {
              buffer.write(data, 0, nRead);
            }
            buffer.flush();

            return new AbstractMap.SimpleEntry<>(new String(name, "UTF-8"), buffer.toByteArray());
        } catch (IOException ex) {
            throw new RuntimeException("error writing file " + contentReference);
        }
    }

}
