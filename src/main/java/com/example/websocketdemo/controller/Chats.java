/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.websocketdemo.controller;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 *
 * @author yurij
 */
@Service
public class Chats {
       
    public final Map<String, Chat> chats = new HashMap<>();
    
    public Chats() {
        chats.put("cGFzc3dvcmQ=", new Chat());
    }
    
    /**
     * Chats to show
     * @return 
    */
    public Collection<Chat> getUnreadChats() {
        return Collections.unmodifiableCollection(chats.values());
    }
    
    public synchronized Chat tryLock(String clientId) {
        if(chats.containsKey(clientId)) {
            chats.get(clientId).lock(clientId);
            return chats.get(clientId);
        }
        return null;
    }

    Chat getChat(String sender) {
        Chat ch = chats.getOrDefault(sender, new Chat());
        if(!chats.containsKey(sender)) {
            chats.put(sender, ch);
        }
        return ch;
    }
}
