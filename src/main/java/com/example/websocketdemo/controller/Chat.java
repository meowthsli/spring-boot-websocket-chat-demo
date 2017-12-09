/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.websocketdemo.controller;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

/**
 *
 * @author yurij
 */
public class Chat {
    private final String clientID;
    private ClientDesc clientDesc;
    private String clientLastSession = "";
    private String locker;
    private Instant lockTime;
    
    private int ids = 0;
    private String lockSession;
    
    public Chat(String clientID, ClientDesc clientDesc) {
        this.clientID = clientID;
        this.clientDesc = clientDesc;
    }
    
    public ClientDesc getClientDesc() {
        return this.clientDesc;
    }
    
    public final Deque<Chat.Item> history = new ArrayDeque<>();

    synchronized boolean lock(String opID, String lockSession) {
        if(isLocked()){
            return false;
        }
        
        this.locker = opID;
        this.lockTime = Instant.now();
        this.lockSession = lockSession;
        
        return true;
    }
    
    public boolean isLocked(String opID) {
        return this.lockTime != null || (opID.equals(locker) 
                && Duration.between(lockTime, Instant.now()).toMinutes() < 5);
    }
    
    public boolean isLocked() {
        return locker != null;
    }
    
    public synchronized void unlock() {
        this.lockTime = null;
        this.locker = null;
        this.lockSession = null;
    }
    
    synchronized Item appendText(String text, String opId) {
        Item item = new Item(ids++, text, Instant.now(), opId);
        this.history.add(item);
        return item;
    }

    public void setLastSession(String sessionID) {
        this.clientLastSession = sessionID;
    }

    public String getClientLastSession() {
        return this.clientLastSession;
    }
    
    public String getClientID() {
        return clientID;
    }

    public String getLocker() {
        return this.locker;
    }
    
    public String getLockerSession() {
        return this.lockSession;
    }

    public Long getUnreadCount() {
        
        
        List<Item> hist =  Arrays.asList(history.toArray(new Item[0]));
        Collections.reverse(hist);
        
        Long count = 0L;
        for(Item i : hist) {
            if(i.opId == null) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }

    void setClientDesc(ClientDesc clientDesc) {
        this.clientDesc = clientDesc;
    }
    
    public final class Item {
        
        public Item(long id, String text, Instant at, String opId) {
            this.id = id;
            this.text = text;
            this.at = at;
            this.opId = opId;
        }
        public String text;
        public Instant at;
        public long id;
        public  String opId;
    }
    
    public Item[] getLastN(int n) {
        int size = history.size();
        if(n > size) {
            size = n;
        }
        return history.stream().
                skip(size - n).toArray(Item[]::new);
    }
    
    public static class ClientDesc {
        public String getRealName() {
            return this.realName;
        }
        
        public void setRealName(String realName) {
            this.realName = realName;
        }
        
        public String getEmail() {
            return this.email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        private String email;
        private String realName;
    }
}
