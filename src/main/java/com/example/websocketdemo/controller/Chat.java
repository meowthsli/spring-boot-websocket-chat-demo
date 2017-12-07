/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.websocketdemo.controller;

import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.ArrayDeque;
import java.util.Deque;

/**
 *
 * @author yurij
 */
public class Chat {
    private String clientID;
    private String clientLastSession = "";
    private String locker;
    private Instant lockTime;
    
    private int ids = 0;
    private String lockSession;
    
    public Chat(String clientID) {
        //this.history.addFirst(new Item(ids++, "Hello? Is anybody here", ZonedDateTime.now(), "DvmDK"));
        //this.history.addFirst(new Item(ids++, "Yes we are here", ZonedDateTime.now(), null));
        this.clientID = clientID;
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
    
    public synchronized void unlock(String opID) {
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
}
