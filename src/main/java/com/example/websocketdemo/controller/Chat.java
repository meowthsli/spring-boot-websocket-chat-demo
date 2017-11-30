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
    public String userID = "cGFzc3dvcmQ=";
    private String locker;
    private Instant lockTime;
    
    private int ids = 0;
    
    public Chat() {
        this.history.addFirst(new Item(ids++, "Hello? Is anybody here", ZonedDateTime.now(), false));
        this.history.addFirst(new Item(ids++, "Yes we are here", ZonedDateTime.now(), true));
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

    synchronized int appendText(String text) {
        int id = ids++;
        this.history.add(new Item(id, text, ZonedDateTime.now(), true));
        return id;
    }
    
    public final class Item {
        
        public Item(int id, String text, ZonedDateTime at, boolean isClient) {
            this.id = id;
            this.text = text;
            this.at = at;
            this.isClient = isClient;
        }
        public String text;
        public ZonedDateTime at;
        public boolean isClient;
        public long id;
    }
    
    public Item[] getLastN(int n) {
        return history.stream().limit(n).toArray(Item[]::new);
    }    
}
