package org.wolna.ouchatserver.controller;

import org.apache.ignite.IgniteCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.wolna.ouchat.Envelope;
import org.wolna.ouchatserver.model.Conversation;

/**
 * Class to store user info
 * @author yurij
 */
public class ClientInfo {
    
    @Autowired @Qualifier("convsMeta")
    IgniteCache<String, Conversation> info;
    
    public void updateInfo(String clientLogin, Envelope.UserDescription clientInfo) {
        Conversation c = info.get(clientLogin);
        c.setDesc(clientInfo);
        info.put(clientInfo.userLogin, c);
    }
    
    public Envelope.UserDescription loadInfo(String clientID) {
        return info.get(clientID).getClientInfo();
    }
}
