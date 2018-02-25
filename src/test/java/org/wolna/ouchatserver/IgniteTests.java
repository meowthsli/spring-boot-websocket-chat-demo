package org.wolna.ouchatserver;

import java.util.List;
import javax.cache.Cache.Entry;
import org.apache.ignite.IgniteCache;
import org.apache.ignite.cache.query.SqlFieldsQuery;
import org.apache.ignite.cache.query.SqlQuery;
import org.junit.Assert;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.wolna.ouchatserver.model.Conversation;
import org.wolna.ouchatserver.model.Message;

/**
 *
 * @author yurij
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"spring.datasource.url=jdbc:hsqldb:mem:test"})
public class IgniteTests {
    @Autowired @Qualifier("convsMeta")
    IgniteCache<String, Conversation> convs;
    
     @Autowired @Qualifier("messages")
    IgniteCache<Long, Message> messages;
    
    @Test
    public void conversationsClassCastExceptionTest() {
        // Ignite i = Ignition.start();
        //IgniteCache<String, Message> convs = i.getOrCreateCache("messages");
        convs.put("12345L", new Conversation(1L));
        Conversation m = convs.get("12345L");
    }
    
    @Test
    public void messagesIndexesTest() {
        // Ignite i = Ignition.start();
        //IgniteCache<String, Message> convs = i.getOrCreateCache("messages");
        Message m1 = new Message();
        m1.msgId = 2L;
        m1.clientLogin = "hello";
        messages.put(m1.msgId, m1);
        
        Message m = new Message();
        m.msgId = 1L;
        m.clientLogin = "hello2";
        messages.put(m.msgId, m);
        
        Message m2 = new Message();
        m2.msgId = 3L;
        m2.clientLogin = "hello";
        messages.put(m2.msgId, m2);
        
        Message m3 = new Message();
        m3.msgId = 4L;
        m3.clientLogin = "hello3";
        messages.put(m3.msgId, m3);
        
        Message m0 = new Message();
        m0.msgId = 0L;
        m0.clientLogin = "hello";
        messages.put(m0.msgId, m0);
        
        Assert.assertNotNull(messages.get(4L));
        
        SqlQuery<Long, Message> q = new SqlQuery<>(Message.class, "clientLogin = ? and msgId < ? ORDER BY msgId DESC");
        q.setArgs("hello", 5L);
        
        List<Entry<Long, Message>> mm = messages.query(q).getAll();
        Assert.assertEquals(3, mm.size());
        Assert.assertTrue(mm.get(0).getKey().equals(3L));
        Assert.assertTrue(mm.get(1).getKey().equals(2L));
        Assert.assertTrue(mm.get(2).getKey().equals(0L));
    }
}
