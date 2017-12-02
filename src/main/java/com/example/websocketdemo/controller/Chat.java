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
    
    public Chat(String clientID) {
        //this.history.addFirst(new Item(ids++, "Hello? Is anybody here", ZonedDateTime.now(), "DvmDK"));
        //this.history.addFirst(new Item(ids++, "Yes we are here", ZonedDateTime.now(), null));
        this.clientID = clientID;
    }
    
    public final Deque<Chat.Item> history = new ArrayDeque<>();

    synchronized boolean lock(String clientId) {
        if(isLocked(clientId)) {
            return true;
        }
        
        this.locker = clientId;
        this.lockTime = Instant.now();
        
        return true;
    }
    
    public boolean isLocked(String clientId) {
        return this.lockTime != null || (clientId.equals(locker) 
                && Duration.between(lockTime, Instant.now()).toMinutes() < 5);
    }
    
    public synchronized void unlock(String clientId) {
        this.lockTime = null;
        this.locker = null;
    }
    
    synchronized long appendText(String text, String opId) {
        long id = ids++;
        this.history.add(new Item(id, text, ZonedDateTime.now(), opId));
        return id;
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
    
    public final class Item {
        
        public Item(long id, String text, ZonedDateTime at, String opId) {
            this.id = id;
            this.text = text;
            this.at = at;
            this.opId = opId;
        }
        public String text;
        public ZonedDateTime at;
        public long id;
        public  String opId;
    }
    
    public Item[] getLastN(int n) {
        return history.stream().limit(n).toArray(Item[]::new);
    }    
}
